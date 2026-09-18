[//]: # (These slides are about getting sandcastle to work with beads)
[//]: # (Not used in latest version of slides)



---

## Demo config

<RunnerConfig />




## my demo,

* git clone ...
* cd example-beads
* Directly in terminal
  * `claude`
  * "Grill me on creating a death rally game, I want the result to be a single issue in beads"
* `npm run sandcastle`

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

