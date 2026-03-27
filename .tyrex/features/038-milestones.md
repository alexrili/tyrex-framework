# Feature 038 — Milestones: agrupar features em releases

## Summary
Add milestones as release targets that group features together with
a definition of done. Lifecycle: planned → active → completed.

## Source
Backlog item BL-026 (EP-006 — Execution Engine, Phase 9)

## Acceptance Criteria
- New command /tyrex-milestone (create, view, audit, complete)
- Milestones stored in .tyrex/milestones/MILESTONE-<version>.yml
- /tyrex-new offers to associate feature with active milestone
- /tyrex-status shows active milestone progress
- Audit checks features + DoD criteria
- Complete creates git tag + updates CHANGELOG

## Out of Scope
- Changes to bin/tyrex.js
- Automatic milestone creation

## Files Affected
- templates/commands/unified/tyrex-milestone.md (new)
- templates/commands/unified/tyrex-new.md
- templates/commands/unified/tyrex-status.md
- docs/CHANGELOG.md
- package.json
