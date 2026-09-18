---
layout: section
---

AI issue tracking
# Beads

---

## Why beads?

* Build for agent use
* Keep context small
* Handle compaction
* Allow for TODO dependencies to spawn during work

---

## What Beads provides

<v-clicks>

- Go
- Can be used in your agent apart from Sandcastle
- "Everything an AI needs"
  - Audit trail
  - Parent, child, blocks, supersedes, discovered-from and more 
  - Epics
  - Priority
- Fast
  
</v-clicks>

---
layout: image-right
image: /demo-large/m-beads-ready.png
backgroundSize: contain
---

## Use case 

<v-clicks>

- Replaces the TODO list with **Beads issues**
  - "Temporal not good enough" (Steve Yegge)
- Add dynamic context to each query
  - `bd ready`
- Beads ticket time scope
  - Session to session memories
    - "Prevent 50 first dates"
  - Not for far long term planning
  - Git is used for past work

- Issues written into **JSONL** lines

</v-clicks>



---

## Beads misc

<v-clicks>

- Started by **Steve Yegge**. [Intro in podcast](https://youtu.be/s96O9oWI_tI?si=aTmutpF9yzc4m_dG&t=1800)
- Multi-agent **parallel support** (Dolt backend)
- Beads are the grapes on a vine — or beads on a chain
- `beads-ui` to see what is happening

</v-clicks>

<!--
TODO: find images — beads logo? generic AI images? something specific to the site's case
-->
---

## Testimonial :)

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

- In git: `.beads/issues.jsonl` 
- Sandcastle fans out: each agent gets its own **git worktree in its own sandbox**
- Workers pull their assignment from the *same* graph: `bd ready --claim --json`
- `--claim` is **atomic** — first worker wins, no two agents take the same bead
- Work discovered mid-task goes straight back in as a `discovered-from` bead

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

1. **Shared Dolt server** (recommended) — `dolt sql-server` on the host
   1. workers connect over a bind-mounted unix socket or `host.docker.internal`
   2. Give the worker a minimal server-mode `.beads/`

</v-clicks>

<!--
Trade-off in one line: a shared server buys you atomic claims and a live graph
at the cost of a hole in the isolation; copying buys you isolation at the cost
of a class of coordination bugs merging cannot fix.
For the demo we use (3) / (1) — pick whichever you actually wired up.
-->
