import { reactive, watch } from "vue";

const SUBPATH_KEY = "sandcastle-demo-runner-subpath";
const SECRET_KEY = "sandcastle-demo-runner-secret";
const TERMINAL_LINES_LIMIT = 1000;

export const runnerStore = reactive({
  // The bit the presenter types — always relative, always joined onto the
  // server's SLIDEV_RUNNER_PARENT_PATH, so the full path can never leave it.
  subpath: (typeof localStorage !== "undefined" && localStorage.getItem(SUBPATH_KEY)) || "",
  secret: (typeof localStorage !== "undefined" && localStorage.getItem(SECRET_KEY)) || "",
  checking: false,
  checkResult: null as null | boolean,
  checkError: "",
  // Server-reported status (whether the feature is enabled at all, and the
  // parent path commands are confined to). Null until the first status check.
  status: null as null | { enabled: boolean; parentPath?: string },
  // Full working directory sent to the server: parentPath + "/" + subpath.
  // Empty until the parent path is known (i.e. a valid secret has been checked).
  get cwd(): string {
    const parent = runnerStore.status?.parentPath;
    if (!parent) return "";
    const sub = runnerStore.subpath.replace(/^\/+/, "").replace(/\/+$/, "");
    const base = parent.replace(/\/+$/, "");
    return sub ? `${base}/${sub}` : base;
  },
});

// A single, module-level (not component-level) scrollback shared by every
// runnable slide — this is "one terminal session for the entire duration":
// the array survives slide navigation even though the Terminal.vue instance
// showing it is recreated per slide (it's just re-rendering the same array).
export type TerminalLine = {
  kind: "cmd" | "data" | "err" | "exit-ok" | "exit-fail";
  text: string;
};
export const terminalLines = reactive<TerminalLine[]>([]);

function pushLine(line: TerminalLine) {
  terminalLines.push(line);
  if (terminalLines.length > TERMINAL_LINES_LIMIT) terminalLines.shift();
}

/** Clears the shared scrollback only — the underlying shell session/queue are untouched. */
export function clearTerminal() {
  terminalLines.splice(0, terminalLines.length);
}

if (typeof window !== "undefined") {
  watch(
    () => runnerStore.subpath,
    (val) => {
      localStorage.setItem(SUBPATH_KEY, val);
      runnerStore.checkResult = null;
    },
  );
  watch(
    () => runnerStore.secret,
    (val) => {
      localStorage.setItem(SECRET_KEY, val);
      runnerStore.status = null;
    },
  );
}

function runnerHeaders() {
  return {
    "content-type": "application/json",
    "x-slidev-runner": "1",
    "x-slidev-runner-secret": runnerStore.secret,
  };
}

// Module-level (not component-level) so the stream survives slide navigation:
// only (re)connects when the secret actually changes.
let streamSecret: string | null = null;
let streamAbort: AbortController | null = null;

async function connectStream() {
  const secret = runnerStore.secret;
  streamAbort?.abort();
  const controller = new AbortController();
  streamAbort = controller;
  streamSecret = secret;

  let res: Response;
  try {
    res = await fetch("/__runner/stream", { headers: runnerHeaders(), signal: controller.signal });
  } catch {
    return;
  }
  if (!res.ok || !res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";
      for (const part of parts) {
        let event = "message";
        const dataLines: string[] = [];
        for (const line of part.split("\n")) {
          if (line.startsWith("event:")) event = line.slice(6).trim();
          else if (line.startsWith("data:")) dataLines.push(line.slice(5).replace(/^ /, ""));
        }
        const data = dataLines.join("\n");
        handleStreamEvent(event, data);
      }
    }
  } catch {
    // Connection dropped (e.g. dev server restarted) — a future checkStatus()
    // call (fires on every Terminal.vue mount) will reconnect.
  }
}

function handleStreamEvent(event: string, data: string) {
  if (event === "cmd") {
    const { script } = JSON.parse(data);
    pushLine({ kind: "cmd", text: `$ ${script}` });
  } else if (event === "data") {
    pushLine({ kind: "data", text: data });
  } else if (event === "err") {
    pushLine({ kind: "err", text: data });
  } else if (event === "cmd-end") {
    const { code } = JSON.parse(data);
    pushLine({ kind: code === 0 ? "exit-ok" : "exit-fail", text: `[exit ${code}]` });
  }
}

export async function checkStatus() {
  try {
    const res = await fetch("/__runner/status", { headers: runnerHeaders() });
    if (!res.ok) {
      runnerStore.status = { enabled: false };
      return;
    }
    runnerStore.status = await res.json();
    if (runnerStore.status?.enabled && streamSecret !== runnerStore.secret) {
      connectStream();
    }
  } catch {
    runnerStore.status = { enabled: false };
  }
}

export async function checkCwd() {
  runnerStore.checking = true;
  runnerStore.checkError = "";
  try {
    const res = await fetch("/__runner/check", {
      method: "POST",
      headers: runnerHeaders(),
      body: JSON.stringify({ cwd: runnerStore.cwd }),
    });
    const json = await res.json();
    if (!res.ok) {
      runnerStore.checkResult = false;
      runnerStore.checkError = json.error || res.statusText;
    } else {
      runnerStore.checkResult = !!json.ok;
      runnerStore.checkError = json.error || "";
    }
  } catch {
    runnerStore.checkResult = false;
    runnerStore.checkError = "Request failed.";
  } finally {
    runnerStore.checking = false;
  }
}

export function b64ToUtf8(b64: string): string {
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Queues a command on the shared terminal session. Output/exit code arrive via the stream, not this call. */
export async function enqueue(script: string) {
  if (!runnerStore.cwd) {
    pushLine({ kind: "err", text: "Set a working directory on the config slide first." });
    return;
  }
  try {
    const res = await fetch("/__runner/exec", {
      method: "POST",
      headers: runnerHeaders(),
      body: JSON.stringify({ cwd: runnerStore.cwd, script }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      pushLine({ kind: "err", text: `Not queued: ${json.error || res.statusText}` });
    }
  } catch {
    pushLine({ kind: "err", text: "Not queued: request failed." });
  }
}
