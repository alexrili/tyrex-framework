# SPEC: Shared Crash Detection Algorithm

## Task
Feature 020, Task 1 — Shared crash detection algorithm

## Date
2026-03-24

## Objective
Create a shared markdown procedure that any `/tyrex-*` command can include as a pre-flight check. It detects crash signals by comparing git working tree state against `.tyrex/` state, and suggests `/tyrex-recover` when inconsistencies are found.

## Technical Approach
Create `templates/commands/shared/crash-detection.md` following the same pattern as existing shared procedures (`feature-context-resolution.md`, `external-tracker-sync.md`, `execution-checklist.md`).

The procedure defines:
1. **Three crash signals:**
   - `dirty_tree_stale_cursor` — uncommitted changes on `feat/*` branch but cursor shows no `in_progress` task
   - `task_state_mismatch` — task state file says `in_progress` but cursor says `completed` or points to different task
   - `timestamp_drift` — working tree files newer than `cursor.last_updated` with no matching commit
2. **Detection steps** (must complete < 2s):
   - Read `cursor.yml` (already loaded by most commands)
   - Check `git status --porcelain` for uncommitted changes
   - If dirty tree: compare against per-feature state file task statuses
   - If mismatch found: signal crash
3. **Response format:**
   - If no crash: proceed silently (zero overhead for clean sessions)
   - If crash detected: present "Inconsistent state detected. Run /tyrex-recover or continue anyway?"

## Constraints & Trade-offs
- Must be lightweight — commands already load cursor.yml, avoid redundant reads
- Git status is the most expensive operation — cap at porcelain output
- False positives possible when user manually edits files outside Tyrex — accept this trade-off, user can choose "continue anyway"

## Dependencies
- None (new file)

## Files Affected
- `templates/commands/shared/crash-detection.md` (create)

## Edge Cases
- No `.tyrex/` directory: skip detection (not a Tyrex project)
- Not on a `feat/*` branch: skip detection (not in a feature context)
- Clean working tree: no crash possible, skip
- Multiple features dirty (checked out different branch than dirty files belong to): flag as crash

## Testing Strategy
Quality: optional (markdown procedure, no executable code)
