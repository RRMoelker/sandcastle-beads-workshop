import type { IncomingMessage, ServerResponse } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { isAbsolute, relative, resolve } from "node:path";
import { timingSafeEqual, randomUUID } from "node:crypto";
import type { Plugin, ViteDevServer } from "vite";

// Dev-only local command runner for the "Demo time" slides. Disabled unless
// both SLIDEV_RUNNER_PARENT_PATH and SLIDEV_RUNNER_SECRET are configured
// (env vars, or a .env file at the project root) — see the "Enabling the
// demo runner" slide at the end of the deck.
//
// One persistent shell process backs the whole presentation (spawned once,
// reused for every command), so `cd`/exports/etc from one command are still
// in effect for the next — this is "one terminal session for the entire
// duration", not a fresh process per click. Commands clicked from any slide
// are queued and run strictly in the order they were submitted; output is
// broadcast to every connected /__runner/stream client (the shared terminal
// panel), not tied to the HTTP request that queued the command.
//
// Security, all independently enforced:
//   1. Feature is off by default. No env vars set -> no middleware at all.
//   2. The TCP connection must originate from the loopback interface. Holds
//      even with `--remote` (binds 0.0.0.0) — non-loopback requests are
//      rejected regardless of what page they loaded.
//   3. A shared secret (SLIDEV_RUNNER_SECRET) must be echoed back by the
//      client on every request, pasted once into the config slide.
//   4. Every working directory used must resolve inside
//      SLIDEV_RUNNER_PARENT_PATH.
//   5. A custom header blocks simple cross-site form submissions.

const RUNNER_HEADER = "x-slidev-runner";
const SECRET_HEADER = "x-slidev-runner-secret";
const HISTORY_LIMIT = 1000;
const END_MARKER_PREFIX = "__SLIDEV_RUNNER_END__";

function loadDotEnv(root: string) {
  const path = resolve(root, ".env");
  if (!existsSync(path)) return;
  for (const rawLine of readFileSync(path, "utf-8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function isLoopback(req: IncomingMessage): boolean {
  const addr = req.socket.remoteAddress || "";
  return addr === "127.0.0.1" || addr === "::1" || addr === "::ffff:127.0.0.1";
}

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function isWithin(parent: string, child: string): boolean {
  const rel = relative(resolve(parent), resolve(child));
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

function shQuote(s: string): string {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((res, rej) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => res(data));
    req.on("error", rej);
  });
}

function respondJson(res: ServerResponse, code: number, body: unknown) {
  res.statusCode = code;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(body));
}

function isDirectory(path: string): boolean {
  try {
    return !!path && existsSync(path) && statSync(path).isDirectory();
  } catch {
    return false;
  }
}

type HistoryEntry = { event: string; data: string };
type QueueItem = { id: string; script: string; cwd: string };

class RunnerSession {
  private child: ChildProcessWithoutNullStreams;
  private queue: QueueItem[] = [];
  private current: QueueItem | null = null;
  private stdoutBuffer = "";
  private history: HistoryEntry[] = [];
  private subscribers = new Set<ServerResponse>();

  constructor(private readonly parentPath: string) {
    this.child = spawn("bash", ["--noprofile", "--norc"], {
      cwd: parentPath,
      env: process.env,
    });
    this.child.stdout.on("data", (chunk) => this.onStdout(chunk.toString()));
    this.child.stderr.on("data", (chunk) => this.broadcast("err", chunk.toString()));
    this.child.on("exit", (code) => {
      this.broadcast("err", `\n[demo shell exited with code ${code}, restart the dev server to recover]\n`);
    });
  }

  subscribe(res: ServerResponse) {
    this.subscribers.add(res);
    for (const entry of this.history) this.writeFrame(res, entry.event, entry.data);
    res.on("close", () => this.subscribers.delete(res));
  }

  enqueue(script: string, cwd: string): string {
    const id = randomUUID();
    this.queue.push({ id, script, cwd });
    this.broadcast("cmd", JSON.stringify({ id, script, cwd }));
    if (!this.current) this.processNext();
    return id;
  }

  private processNext() {
    const next = this.queue.shift();
    if (!next) {
      this.current = null;
      return;
    }
    this.current = next;
    this.child.stdin.write(`cd ${shQuote(next.cwd)}\n`);
    this.child.stdin.write(`${next.script}\n`);
    this.child.stdin.write(`printf '\\n${END_MARKER_PREFIX}%s_%d\\n' ${next.id} "$?"\n`);
  }

  private onStdout(chunk: string) {
    this.stdoutBuffer += chunk;
    const markerRe = new RegExp(`${END_MARKER_PREFIX}([0-9a-f-]+)_(-?\\d+)\\n`);
    for (;;) {
      const match = this.stdoutBuffer.match(markerRe);
      if (!match) break;
      const before = this.stdoutBuffer.slice(0, match.index);
      if (before) this.broadcast("data", before);
      const [, id, code] = match;
      this.broadcast("cmd-end", JSON.stringify({ id, code: Number(code) }));
      this.stdoutBuffer = this.stdoutBuffer.slice((match.index ?? 0) + match[0].length);
      this.current = null;
      this.processNext();
    }
    // Flush anything left that clearly isn't a partial marker, so regular
    // output shows up promptly instead of waiting for the next marker.
    if (this.stdoutBuffer && !this.stdoutBuffer.includes(END_MARKER_PREFIX.slice(0, 4))) {
      this.broadcast("data", this.stdoutBuffer);
      this.stdoutBuffer = "";
    }
  }

  private broadcast(event: string, data: string) {
    this.history.push({ event, data });
    if (this.history.length > HISTORY_LIMIT) this.history.shift();
    for (const res of this.subscribers) this.writeFrame(res, event, data);
  }

  private writeFrame(res: ServerResponse, event: string, data: string) {
    res.write(`event: ${event}\n`);
    for (const line of data.split("\n")) res.write(`data: ${line}\n`);
    res.write("\n");
  }
}

export default function runnerVitePlugin(): Plugin {
  loadDotEnv(process.cwd());

  const parentPath = process.env.SLIDEV_RUNNER_PARENT_PATH;
  const secret = process.env.SLIDEV_RUNNER_SECRET;

  if (!parentPath || !secret) {
    // Feature disabled: register nothing, /__runner/* 404s as normal.
    return { name: "sandcastle-demo-runner:disabled", apply: "serve" };
  }

  const session = new RunnerSession(parentPath);

  return {
    name: "sandcastle-demo-runner",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/__runner/")) return next();

        if (!isLoopback(req)) {
          return respondJson(res, 403, {
            error: "Refused: only requests from the machine running the dev server are allowed.",
          });
        }
        if (req.headers[RUNNER_HEADER] !== "1") {
          return respondJson(res, 403, { error: "Missing runner header." });
        }
        const providedSecret = String(req.headers[SECRET_HEADER] || "");
        if (!secretsMatch(providedSecret, secret)) {
          return respondJson(res, 403, { error: "Invalid or missing secret." });
        }

        if (req.url === "/__runner/status" && req.method === "GET") {
          return respondJson(res, 200, { enabled: true, parentPath });
        }

        if (req.url === "/__runner/check" && req.method === "POST") {
          let payload: { cwd?: string };
          try {
            payload = JSON.parse(await readBody(req));
          } catch {
            return respondJson(res, 400, { error: "Bad JSON body." });
          }
          const cwd = String(payload.cwd || "");
          if (!isWithin(parentPath, cwd)) {
            return respondJson(res, 200, { ok: false, error: `Must be inside ${parentPath}` });
          }
          return respondJson(res, 200, { ok: isDirectory(cwd) });
        }

        if (req.url === "/__runner/stream" && req.method === "GET") {
          res.writeHead(200, {
            "content-type": "text/event-stream",
            "cache-control": "no-cache",
            connection: "keep-alive",
          });
          session.subscribe(res);
          return;
        }

        if (req.url === "/__runner/exec" && req.method === "POST") {
          let payload: { cwd?: string; script?: string };
          try {
            payload = JSON.parse(await readBody(req));
          } catch {
            return respondJson(res, 400, { error: "Bad JSON body." });
          }
          const cwd = String(payload.cwd || "");
          const script = String(payload.script || "");

          if (!isWithin(parentPath, cwd)) {
            return respondJson(res, 400, { error: `Working directory must be inside ${parentPath}.` });
          }
          if (!isDirectory(cwd)) {
            return respondJson(res, 400, {
              error: "Working directory does not exist. Set it on the config slide first.",
            });
          }
          if (!script.trim()) {
            return respondJson(res, 400, { error: "Empty command." });
          }

          const id = session.enqueue(script, cwd);
          return respondJson(res, 202, { queued: true, id });
        }

        return respondJson(res, 404, { error: "Not found." });
      });
    },
  };
}
