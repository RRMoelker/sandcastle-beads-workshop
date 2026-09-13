---
theme: "@dignitas/slidev-theme"
title: SandcastleAI
info: |
  SandcastleAI training — general layout, then content.
hideInToc: true
---

::title::
SandcastleAI

::subtitle::
18 september 2026
Ruurd Moelker

---
hideInToc: true
---

# Agenda

<Toc />

---
layout: section
---

# Why SandcastleAI

---
layout: section
---

# Sandcastle intro

---

<!-- TODO: info from https://github.com/mattpocock/sandcastle -->
<!-- See "Beads" section below for what to pull from there. -->

---
layout: section
level: 2
---

# Beads

---
hideInToc: true
---

## Beads: the story

> "Coding agents *always* start off strong. Give an agent a modestly meaty task, and it will declare:
>
> 'Oh wow, this is a big project, I'm going to break it into **six phases** and create a markdown plan.'"

<v-clicks>

1. Phase 1
2. Phase 2
3. Phase 3
4. Phase 4
5. Phase 5
6. Phase 6

</v-clicks>

<!--
Source: https://steve-yegge.medium.com/introducing-beads-a-coding-agent-memory-system-637d7d92514a
-->

---
hideInToc: true
---

# Phase 1

The agent works through it. ✅ Done.

<br/>

Confidence is high. The plan is holding up.

<!--
TODO
-->

---
hideInToc: true
---

# Phase 2

Also done. ✅

<br/>

Then... several **compactions / restarts** happen, which resets the agent's memory.

<!--
TODO
-->

---
hideInToc: true
---

# Phase 3

The agent wakes up. It has mostly **forgotten where it came from**.

It plops in your video cassette, reads about "phase 3", and declares:

> "Oh wow, this is a big project, I'm going to break it into **five phases** and create a markdown plan."

<br/>

...and the fractal collapse repeats, nested sub-phases deep, until:

> "Congratulations, the system is DONE! 🎉 Let's start manual testing! 🚀"

— completely unaware the original outer phases are still unfinished. Hundreds of half-built markdown plans pile up in the repo.

<!--
TODO
-->

---
hideInToc: true
---

# What Beads provides

Started by **Steve Yegge**.

<v-clicks>

- Go
- 
- Temporal not good enough 
- Replaces the TODO list with **Beads issues**
- Issues written into **JSONL** lines
- Multi-agent **parallel support** (Dolt backend)
- Beads are the grapes on a vine — or beads on a chain 📿
- `bd` cli also stands for "**b**ug **d**atabase"
- Born out of large vibe-coding projects
- Work that gets too complex gets flagged **"rewrite only"**
- Agents drift into "**executive mode**" near the end of the context window and take shortcuts to a solution
- 

</v-clicks>

<!--
TODO: find images — beads logo? generic AI images? something specific to the site's case
-->

---
hideInToc: true
---

# Testimonials

<div class="text-sm">

> I've worked with Beads for less than a week, but the difference from markdown-based TODO tracking is **profound**…
>
> Markdown plans are **write-only memory for agents**… dependencies exist only in prose… I can't query for ready work, I have to *interpret* text…
>
> **Dependencies are first-class, not prose.** I run `bd ready --json` and get a definitive list of unblocked work… I'm not interpreting text, I'm *querying structured data*…
>
> Beads isn't "issue tracking for agents" — it's **external memory for agents**…
>
> Going back to markdown TODOs feels like trying to remember a phone number without writing it down… Sure, I can do it for a little while, but why would I?
>
> **— Sonnet 4.5**

</div>

<!--
Full text: see .local/slide_input.md, Appendix A
-->

## Sandcastle templates

There a couple of defaults to choose from:

* blank (Bare scaffold — write your own prompt and orchestration)

[//]: # (TODO: AI)
TODO: AI, split these options over multiple slide. Start with this slide create a nice flow diagram for the following templates, look in the repo how these templates actually work: https://github.com/mattpocock/sandcastle 

* simple-loop (Picks issues one by one and closes them)
* sequential-reviewer (Implements issues one by one, with a code review step after each)
* parallel-planner (Plans parallelizable issues, executes on separate branches, merges)
* parallel-planner-with-review (Plans parallelizable issues, executes with per-branch review, merges)
[//]: # (End TODO: AI)

---
hideInToc: true
---

# Resources

- Beads introduction: https://steve-yegge.medium.com/introducing-beads-a-coding-agent-memory-system-637d7d92514a

---
layout: section
---

# Demo time

---
hideInToc: true
---

## 1, Setup 

* `git init`
* `npm install --save-dev @ai-hero/sandcastle`
* `npx @ai-hero/sandcastle init` with
  * github copilot
  * empty template
* Reset
* `npx @ai-hero/sandcastle init` with
  * claude
  * sequential-reviewer
    
<!--
show repo after empty template init and show main code with github copilot.
show repo prompts with sequential reviewer and show main code.
-->

---

## 2, Config

* `cp .sandcastle/.env{.example,}`
* Get token using `claude setup-token`
* edit .env: `CLAUDE_CODE_OAUTH_TOKEN=<token>`

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

### 3b. Install ticket system; package manager

* https://beads.gascity.com/
* e.g.: `brew install beads`

---

### 4. Init tickets system

* `bd init`
  * "Hooks installed to: .beads/hooks/ "
  * "Created AGENTS.md with agent instructions"
  * "Created new CLAUDE.md with beads integration"
  * "Codex native hooks installed"
  * ...

![](../../../../../../Users/r/Desktop/beads-install-note.png)

![](../../../../../../Users/r/Desktop/beads-install-success.png)

## 5. Add starting ticket

* Agent swarm will use `bd ready --json`
* Provide source work with:
  * `npm i beads-ui -g`


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

# Thank you
