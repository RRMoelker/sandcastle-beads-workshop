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