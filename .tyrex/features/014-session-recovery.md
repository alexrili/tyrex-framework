# Feature 014: 3-Layer Session Recovery

## Summary
Implement robust session recovery that detects and reconciles inconsistencies between cursor.yml state and actual git state when a session ends abruptly mid-development.

## Layers

### Layer 1 — Git-based inconsistency detection (/tyrex-resume)
- New Step 0 before trusting cursor.yml
- Compare `last_commit` in cursor vs `git log` actual HEAD
- Detect uncommitted changes via `git status`
- Show structured choices: reconcile / inspect / rollback

### Layer 2 — Checkpoint eagerness (/tyrex-do)
- Write `current_task_in_progress`, `in_progress_since`, `in_progress_files_touched` to cursor.yml
- Update at task start and after each file write
- Clear fields on task completion

### Layer 3 — Intelligent reconciliation (/tyrex-resume)
- Cross-reference `in_progress_files_touched` with `git diff`
- Stack-agnostic test runner detection (package.json, Makefile, pyproject.toml, Cargo.toml, go.mod, mix.exs, build.gradle, etc.)
- Auto-complete if files match AND tests pass
- Show context if tests fail
- Reset to pending if files don't match

## Files Changed
- `templates/commands/unified/tyrex-resume.md`
- `templates/commands/unified/tyrex-do.md`
- All 4 agent sync directories

## Out of Scope
- Modifying bin/tyrex.js
- Adding new commands
- Changes to constitution.md
