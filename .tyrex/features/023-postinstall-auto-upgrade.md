# Feature 023 — Postinstall Auto-Upgrade

## Description
When users install a new version of tyrex-framework via `npm install -g`, automatically sync commands and templates for already-configured agents. First-time installs show a setup message instead.

## Tasks
1. Add `--upgrade` flag to `bin/tyrex.js` — silent, non-interactive re-install for all detected agents
2. Create `bin/postinstall.js` — detects existing install (`~/.tyrex/`) and routes to upgrade or message
3. Update `package.json` — add postinstall script, add `bin/postinstall.js` to files array

## Out of Scope
- Changing the interactive setup flow
- Adding new agent support
- Modifying `tyrex init` behavior
