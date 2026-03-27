# Feature 037 — Threads: cross-session persistent context

## Summary
Add persistent cross-session threads — named topics that accumulate knowledge
across multiple sessions. Lighter than context files, designed for ongoing
discussions, investigations, or decisions.

## Source
Backlog item BL-025 (EP-006 — Execution Engine, Phase 8)

## Acceptance Criteria
- New command /tyrex-thread for create/list/open/append
- Threads stored in .tyrex/threads/THREAD-<name>.md
- /tyrex-discuss supports --thread flag to load thread as context
- /tyrex-status shows recent threads
- Append-only entries with timestamps
- No lifecycle — threads are living knowledge base

## Out of Scope
- Changes to bin/tyrex.js
- Thread archiving or cleanup

## Files Affected
- templates/commands/unified/tyrex-thread.md (new)
- templates/commands/unified/tyrex-discuss.md
- templates/commands/unified/tyrex-status.md
- docs/CHANGELOG.md
- package.json
