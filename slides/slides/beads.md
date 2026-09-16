---
layout: section
---

# Beads

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

## Phase 1

The agent works through it. ✅ Done.

<br/>

Confidence is high. The plan is holding up.

<!--
TODO
-->

---

## Phase 2

Also done. ✅

<br/>

Then... several **compactions / restarts** happen, which resets the agent's memory.

<!--
TODO
-->

---

## Phase 3

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

## What Beads provides

Started by **Steve Yegge**. [Intro in podcast](https://youtu.be/s96O9oWI_tI?si=aTmutpF9yzc4m_dG&t=1800)

<v-clicks>

- Go
- Can be used in your agent apart from Sandcastle
- Everything an AI needs
  - Queried
  - Audit trail
  - Provendence
  - Parent, children, dependencies, epics
  - Priority
- "File and forget"
- Dynamic context
  - Wrt. static context from agent.md, coding standards, etc
- Beads working on now
  - Session to session memories
    - "Prevent 50 first dates"
  - Not for future work
  - Git is used for past work
- Temporal not good enough 
- Replaces the TODO list with **Beads issues**
- Issues written into **JSONL** lines
- Multi-agent **parallel support** (Dolt backend)
- Beads are the grapes on a vine — or beads on a chain 📿
- `bd` cli also stands for "**b**ug **d**atabase"
- Born out of large vibe-coding projects
- Work that gets too complex gets flagged **"rewrite only"**
- Agents drift into "**executive mode**" near the end of the context window and take shortcuts to a solution
- `beads-ui` to see what is happening.

</v-clicks>

<!--
TODO: find images — beads logo? generic AI images? something specific to the site's case
-->
---

## Testimonials

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



---

## Beads &lt;&gt; Sandcastle: the intended way

**One task graph, many workers.**

<v-clicks>

- The orchestrator owns the beads database — it is the shared memory
- Sandcastle fans out: each agent gets its own **git worktree in its own sandbox**
- Workers pull their assignment from the *same* graph: `bd ready --claim --json`
- `--claim` is **atomic** — first worker wins, no two agents take the same bead
- Work discovered mid-task goes straight back in as a `discovered-from` bead
- Fan-in: the orchestrator sees progress live, no merge step

</v-clicks>

<!--
The claim is the key bit. Everything else you could fake with files; an atomic
claim across parallel workers you cannot.
-->



---

## ...except the sandbox is a detached copy

<v-clicks>

- Normally every git worktree **shares one `.beads/`**, found by walking up to `.git`
- A sandbox gets a *copy* of the worktree — no main repo, no `.git`, no `.beads`
- So the worker's very first `bd` call dies:

```
Error: no beads database found
...set BEADS_DIR to point to your .beads directory
```

- Open sandcastle issue [#588](https://github.com/mattpocock/sandcastle/issues/588) — still unsolved, labeled *Documentation*

</v-clicks>

<!--
This is the honest state of play as of the training: it does not work out of
the box. Worth showing the error verbatim so people recognise it.
-->



---

## The tempting fix that makes it worse

Copy `.beads/issues.jsonl` into the sandbox, copy it back out. 🚫

<v-clicks>

- JSONL is a **passive export**, never the database — the beads docs call this an anti-pattern
- Import is **upsert-only**: it cannot express a delete, a prune, or a close-by-absence
- Dolt history, branches and the audit trail don't survive the round trip
- And offline copies can't claim atomically → two workers take the same bead, and no merge can undo that

</v-clicks>

<!--
The failure mode is silent: everything looks fine, you just quietly lose
deletions and get duplicated work.
-->



---

## What actually works

<v-clicks>

1. **Shared Dolt server** (recommended) — `dolt sql-server` on the host, workers connect over a bind-mounted unix socket or `host.docker.internal`. Give the worker a minimal server-mode `.beads/` so discovery succeeds. Run workers `--readonly` when they only read, `--sandbox` so they never push.
2. **Real Dolt sync** — `bd bootstrap` from the Dolt remote at sandbox start, `bd dolt push` at the end. Needs `dolt` in the image and a reachable remote. Right choice for off-machine or untrusted sandboxes.
3. **Orchestrator writes only** — workers never touch `bd`; sandcastle's structured output goes back to the host, which updates the graph. Least machinery, zero holes in the sandbox.

</v-clicks>

<!--
Trade-off in one line: a shared server buys you atomic claims and a live graph
at the cost of a hole in the isolation; copying buys you isolation at the cost
of a class of coordination bugs merging cannot fix.
For the demo we use (3) / (1) — pick whichever you actually wired up.
-->
