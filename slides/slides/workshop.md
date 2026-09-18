---
layout: two-cols
---

## Try it yourselves, GH issues

Sandcastle

* `git init`
* `npm init`
* `npm install --save-dev @ai-hero/sandcastle`
* `npx @ai-hero/sandcastle init`
  * `cp .sandcastle/.env{.example,}`
* Get token using `claude setup-token`
* edit `.sandcastle/.env`: `CLAUDE_CODE_OAUTH_TOKEN=<token>`

::right::

Github

* Create Github repo and add origin
    1. `git remote add origin <github_repo>`
    2. `git push --set-upstream origin main`
* Create fine-grained GitHub PAT: https://github.com/settings/personal-access-tokens/new
  * Permissions: Issues: Read and write, Metadata: Read-only (mandatory, auto-selected)
* `GH_TOKEN=<token>` in `.sandcastle/.env`
* Create initial ticket (Grill me!)




