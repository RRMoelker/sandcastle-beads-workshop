## Sandcastle templates

There are a couple of defaults to choose from, each `npx @ai-hero/sandcastle init .` scaffolds a `.sandcastle/main.mts` orchestration script plus prompt files.

<!--
Source: https://github.com/mattpocock/sandcastle/tree/main/src/templates
-->




---

## blank

```mermaid
flowchart LR
  A(["main.ts"]) --> B["agent"]
  IP[/"prompt.md"/] -.-> B
  B --> C(["done"])

  subgraph SB["sandbox"]
    B
  end
```

* Prompt is empty boilerplate.

<!--
Bare scaffold — write your own prompt and orchestration.
Single run, maxIterations: 1 by default, no branch/merge logic — you own everything.
-->



---

## simple-loop

```mermaid
flowchart LR
  A(["main.ts"]) --> B["agent"]
  IP[/"prompt.md"/] -.-> B
  B --> C{"issues left?"}
  C -- yes --> B
  C -- no --> D(["done"])

  subgraph SB["sandbox"]
    B
  end
```

* Prompt reads the next issue via `bd ready --json`.

<!--
Picks issues one by one and closes them.
maxIterations: 3+, branchStrategy: merge-to-head — each iteration works one issue and merges straight back to HEAD.
-->



---

## sequential-reviewer

```mermaid
flowchart LR
  A(["main.ts"]) --> B["implementer"]
  IP[/"implement-prompt.md"/] -.-> B
  B --> C{"commits made?"}
  C -- no --> D(["stop"])
  C -- yes --> E["reviewer"]
  RP[/"review-prompt.md"/] -.-> E
  E -- "next issue" --> B

  subgraph SB["sandbox"]
    B
    E
  end
```

* Each phase is still a **new Claude session** — implementer and reviewer don't share conversation context, only the branch's files/commits.

<!--
Implements issues one by one, with a code review step after each.
Loop stops early once an implement phase produces no commits (backlog empty).
-->



---

## parallel-planner

```mermaid
flowchart LR
  M0(["main.ts"]) --> P["planner"]
  P --> E1["implementer"]
  P --> EN["implementer"]
  E1 --> MG["merger"]
  EN --> MG
  MG --> P

  subgraph SP["sandbox"]
    P
  end
  subgraph S1["sandbox"]
    E1
  end
  subgraph S2["sandbox"]
    EN
  end
  subgraph SM["sandbox"]
    MG
  end
```

<!--
Plans parallelizable issues, executes on separate branches, merges.
Planner outputs a <plan> JSON (issue id, title, target branch) validated with Zod.
Implementers run concurrently via Promise.allSettled — one failing agent doesn't cancel the others.
Only branches with commits are passed to the merger; loop repeats to pick up newly unblocked issues.
-->



---

## parallel-planner-with-review

```mermaid
flowchart LR
  M0(["main.ts"]) --> P["planner"]
  P --> B1["implementer"]
  B1 --> R1["reviewer"]
  P --> B2["implementer"]
  B2 --> R2["reviewer"]
  R1 --> MG["merger"]
  R2 --> MG
  MG --> P

  subgraph SP["sandbox"]
    P
  end
  subgraph S1["sandbox"]
    B1
    R1
  end
  subgraph S2["sandbox"]
    B2
    R2
  end
  subgraph SM["sandbox"]
    MG
  end
```

<!--
Plans parallelizable issues, executes with per-branch review, merges.
Each issue gets its own sandbox — implementer runs first, reviewer only runs if commits were made, same branch.
Combines the review gate of sequential-reviewer with the concurrency of parallel-planner.
-->
