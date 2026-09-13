---
layout: section
---

# Demo time

---
hideInToc: true
---

## Demo config

<RunnerConfig />

---
hideInToc: true
runnable: true
layout: two-cols
---

## 1, Setup 

* `git init`
* `npm init`
* `npm install --save-dev @ai-hero/sandcastle`
* `npx @ai-hero/sandcastle init` with
  * claude
  * template of choice
    
<!--
show repo after empty template init and show main code with github copilot.
show repo prompts with sequential reviewer and show main code.
-->

---
runnable: true
layout: two-cols
---

## x, Ticket system, GH issues

1. Create fine-grained GitHub PAT: https://github.com/settings/personal-access-tokens/new
2. Repository access: select the target repo(s) individually — no name-pattern/wildcard scoping
3. Permissions:
   * Issues: Read and write
   * Metadata: Read-only (mandatory, auto-selected)
4. `GH_TOKEN=<token>` in `.sandcastle/.env`
5. Create Github repo and add origin
   1. `git remote add origin <github_repo>`
   2. `git push --set-upstream origin main`

<!--
Sandcastle's github-issues tracker only shells out to `gh issue list/view/close` (see
InitService.ts) — it never pushes or opens PRs, so Issues + Metadata is enough. Contents
(read/write) is only needed if your own orchestration pushes branches/PRs to origin.
-->


---
runnable: true
layout: two-cols
---

## 2, Config LLM: Claude

* `cp .sandcastle/.env{.example,}`
* Get token using `claude setup-token`
* edit `.sandcastle/.env`: `CLAUDE_CODE_OAUTH_TOKEN=<token>`

---
runnable: true
layout: two-cols
---

### 3. Install ticket system; npm installer

* `npm install @beads/bd`
  * Wrapper around go package installer
```
npm warn install-scripts 1 package had install scripts blocked because they are not covered by allowScripts:
npm warn install-scripts   fsevents@2.3.3 (install: (install scripts present))
npm warn install-scripts
npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.
```

---
runnable: true
layout: two-cols
---

### 3b. Install ticket system; package manager

* https://beads.gascity.com/
* e.g.: `brew install beads`

---
runnable: true
layout: two-cols
---

### 4. Init tickets system

* `bd init`
  * "Hooks installed to: .beads/hooks/ "
  * "Created AGENTS.md with agent instructions"
  * "Created new CLAUDE.md with beads integration"
  * "Codex native hooks installed"
  * ...

![](../../../../../../../Users/r/Desktop/beads-install-note.png)

![](../../../../../../../Users/r/Desktop/beads-install-success.png)

---

## 5. Add starting ticket

* Agent swarm will use `bd ready --json`
* Provide source work with:
  * `npm i beads-ui -g`

---

## 6. Kick off Sandcastle

```
// const copyToWorktree = ["node_modules"];
const copyToWorktree = ["node_modules", ".beads"];
```

* `npm run sandcastle`
  * `npx tsx .sandcastle/main.mts`
* 

---
layout: section
---

# Try it out

---
hideInToc: true
---

# Goal

* Think of a small app, or
* An extension of your current project

Then

* Run through described setup steps
* Provide initial ticket(s)
* Run sandcastle loop `npx run sandcastle`
