# Feature: Tyrex Recover (Crash Recovery & Session Resumption)

## Objective
Replace `/tyrex-resume` with `/tyrex-recover` — a forensic recovery command that reconstructs session state from git and Tyrex evidence after abrupt disconnections, with auto-detection in all commands.

## Acceptance Criteria
- [ ] Detect crash signals: dirty tree + stale cursor, task state mismatch, timestamp drift
- [ ] Forensic analysis: map branch → feature, diff → task, classify changes
- [ ] Diagnostic summary: feature, task, files, test status, completion %
- [ ] User choices for uncommitted changes: keep, stash, discard
- [ ] Auto-fix: when changes are coherent and tests pass, offer to complete task
- [ ] Pre-flight crash detection in all /tyrex-* commands (shared, <2s)
- [ ] Normal resume as fast-path (no crash = read cursor + continue)
- [ ] Replace /tyrex-resume completely (remove old command)
- [ ] Update cursor.yml to reflect recovered state

## Out of Scope
- Recovering LLM conversation context (provider responsibility)
- Remote state sync between machines
- Recovery from git corruption (use git reflog)
- Non-Tyrex work (no .tyrex/ state to cross-reference)

## Skills
- backend-engineer
- debugger

## Tasks
1. Shared crash detection algorithm [backend-engineer] — shared pre-flight procedure
2. tyrex-recover command [debugger] — full command replacing tyrex-resume
3. Remove tyrex-resume + update references [backend-engineer]
4. Add crash detection pre-flight to all commands [backend-engineer]
5. Update project metadata [backend-engineer] — TYREX.md patterns, CHANGELOG
6. Sync commands to agent directories [backend-engineer]

Wave 1: [1] + [2] parallel | Wave 2: [3] sequential | Wave 3: [4] sequential | Wave 4: [5] sequential | Wave 5: [6] sequential

## Configuration
- Docs: changelog, spec, srs, prd, adr, wiki, diagrams
- Branch: feat/020-tyrex-recover
- Commits: approve

## Status: planned
