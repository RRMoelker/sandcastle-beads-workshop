---
layout: section
---

# Demo time



---

## 1, Setup 

* Start docker engine
* `git init`
* `npm init`
* *git commit*
* `npm install --save-dev @ai-hero/sandcastle`
* `npx @ai-hero/sandcastle init` with
  * claude
  * template of choice
* git commit
    
<!--
show repo after empty template init and show main code with github copilot.
show repo prompts with sequential reviewer and show main code.
-->



---

## 2, Config LLM: Claude

* `cp .sandcastle/.env{.example,}`
* Get token using `claude setup-token`
* edit `.sandcastle/.env`: `CLAUDE_CODE_OAUTH_TOKEN=<token>`



---

## 3, Ticket system, GH issues

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

## 4, run sandcastle

package.json
```
...
"scripts": {
  "sandcastle": "npx tsx .sandcastle/main.mts",
  ...
},
...
```
* `npm run sandcastle`



---

## 5, monitor

* `docker ps`
* `.sandcastle/logs/`
* `.sandcastle/worktrees/`
* `bd list` or look at Github issues on github.com



---

## Sandcastle & beads review

<v-clicks>

* Out of the box
  * No/limited control `npm run sandcastle`
  * interruptable after every iteration
* Up to dev to code flow
  * Non blocking flows (now waiting on planner and merge)
  * Put human back in the loop
    * clarification tickets?
    * Tickets labels for sandcastle vs human
* From dev time constraint -> Token & runtime constraint
  * Docker overhead and tokens/s blockers

</v-clicks>



---
layout: quote
hideInToc: true
---

# "The average person only uses 10% their budget. Here at Dignitas, we use the full budget!"

<div class="mt-8 text-lg opacity-60">

— me, just now

</div>

<img src="/demo-large/i-2-out-of-tokens.png" class="mt-8 w-2/3 rounded shadow" />

