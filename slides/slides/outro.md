## Why not sub agents

### Custom orchestration
* **Parallel workers**
* **Control merge process**
* Sandbox
* External TODO list / tickets
* More control

::right::

### Sub agents
* Simpler
* Lot less work
* Orchestration as prompt



---

## Take aways

<v-clicks>

* Sandcastle good for sandboxing
* Worktrees great for parallel work
* Beads good for short term work planning
* Out of the box, Sandcastle not great for every day work.

</v-clicks>



---

## My suggestion
* Normal work: Claude/OpenCode with Beads Todos. And baby sit.
* Project work: Vibe with Sandcastle



---
hideInToc: true
---

# Thank you



---
hideInToc: true
---

# Resources

- Beads introduction: https://steve-yegge.medium.com/introducing-beads-a-coding-agent-memory-system-637d7d92514a



---

## Enabling the demo runner

The run buttons on the Demo time slides are **off by default**. To enable them, set both before starting `npm run dev`:

* `SLIDEV_RUNNER_PARENT_PATH` — the directory demo commands are allowed to run in (and any subdirectory of it)
* `SLIDEV_RUNNER_SECRET` — a random secret, pasted into the "Demo config" slide to authorize requests

**Option A — exported env vars:**

```bash
export SLIDEV_RUNNER_PARENT_PATH=/path/to/allowed/parent
export SLIDEV_RUNNER_SECRET=$(openssl rand -hex 24)
npm run dev
```

**Option B — `.env` file** at the project root (already gitignored):

```
SLIDEV_RUNNER_PARENT_PATH=/path/to/allowed/parent
SLIDEV_RUNNER_SECRET=<random-secret>
```

Then paste the same `SLIDEV_RUNNER_SECRET` value into the secret box on the Demo config slide — commands will only run inside `SLIDEV_RUNNER_PARENT_PATH`, and only when both checks pass.

<!--
Neither var set -> the vite-plugins.ts runner middleware doesn't even register; /__runner/* just 404s
like any other route, so sharing this deck without these vars set is safe by default.
-->