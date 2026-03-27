# Feature 032 — Verify/UAT as Pipeline Stage

## Summary
Add user acceptance testing (UAT) as a dedicated step between /tyrex-do and /tyrex-review.
The system extracts testable deliverables, walks through them with the user one by one,
and creates fix tasks automatically if something fails. Pipeline becomes:
new → plan → do → verify → review → accept.

## Source
Backlog item BL-020 (EP-006 — Execution Engine, Phase 7)
Inspired by GSD framework's /gsd:verify-work.

## Acceptance Criteria
- New /tyrex-verify command (plan mode — diagnose only, no code)
- Extracts testable deliverables from specs and completed tasks
- Walk-through with user: one deliverable at a time, pass/fail
- On fail: automatic diagnosis + fix task creation (prefix 'fix-')
- Fix tasks executable immediately via /tyrex-do
- Re-verify after fixes
- /tyrex-quick includes verify between do and review
- Result persists in .tyrex/state/features/NNN-verify.md

## Out of Scope
- Automated testing (this is MANUAL user verification)
- Changes to bin/tyrex.js

## Files Affected
- templates/commands/unified/tyrex-verify.md (new)
- templates/commands/unified/tyrex-quick.md
- templates/commands/unified/tyrex-do.md (next action suggestion)
- .tyrex/TYREX.md
- docs/CHANGELOG.md
