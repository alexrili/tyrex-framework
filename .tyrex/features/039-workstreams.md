# Feature 039 — Workstreams: parallel namespaced work

## Summary
Add workstreams for parallel namespaced work within a project.
Each workstream has its own cursor, features, and branch prefix.

## Source
Backlog item BL-027 (EP-006 — Execution Engine, Phase 9)

## Acceptance Criteria
- New command /tyrex-workstream (create, list, switch, complete)
- Workstreams in .tyrex/workstreams/WS-<name>/
- Each workstream has its own cursor, features, and backlog scope
- /tyrex-new scopes features to active workstream
- /tyrex-status shows active workstream
- Git branch strategy per workstream

## Out of Scope
- Changes to bin/tyrex.js
- Workstream nesting

## Files Affected
- templates/commands/unified/tyrex-workstream.md (new)
- templates/commands/unified/tyrex-status.md
- docs/CHANGELOG.md
- package.json
