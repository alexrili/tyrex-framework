# Feature 035 — Discuss Mode: Assumptions

## Summary
Add an `assumptions` mode to `/tyrex-discuss` where the system reads the code first,
proposes what it would do and why, and only asks the user where it's wrong.
Inverse of the current interview-first mode. Ideal for brownfield/codebase projects.

## Source
Backlog item BL-023 (EP-006 — Execution Engine, Phase 8)

## Acceptance Criteria
- /tyrex-discuss supports flag `--assumptions` or config in tyrex.yml
- In assumptions mode: system analyzes the code first
- Presents "Here's what I'd do and why" with bullet points
- User corrects only what's wrong (more efficient)
- Default mode remains 'discuss' (interview-first)
- Config in tyrex.yml: workflow.discuss_mode ('discuss' | 'assumptions')
- Works in codebase mode and hybrid mode (not in greenfield)

## Out of Scope
- Changes to bin/tyrex.js
- Changes to other commands beyond tyrex-discuss
- New skill files

## Files Affected
- templates/commands/unified/tyrex-discuss.md
- .tyrex/tyrex.yml + templates/tyrex.yml
- .tyrex/TYREX.md
- docs/CHANGELOG.md
