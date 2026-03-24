# SPEC: tyrex-recover Command

## Task
Feature 020, Task 2 — tyrex-recover command (replaces tyrex-resume)

## Date
2026-03-24

## Objective
Create the `/tyrex-recover` command that replaces `/tyrex-resume`. It provides forensic crash recovery when a session ended abruptly, and normal resume as a fast-path when no crash is detected.

## Technical Approach
Create `templates/commands/unified/tyrex-recover.md` with two modes:

**Fast-path (no crash):** Same behavior as current tyrex-resume — read cursor, display status, offer to continue. Lightweight, minimal reads.

**Recovery mode (crash detected):**
1. **Forensic analysis** (FR-004):
   - Read `cursor.yml` for last known state
   - Identify active branch → map to feature via Feature Context Resolution
   - Run `git diff` to list all uncommitted changes
   - Read per-feature state file and task state files
   - Cross-reference to determine which task was interrupted
2. **Change classification** (FR-005):
   - Map modified file paths to task descriptions from feature spec
   - Group changes by task they likely belong to
3. **Diagnostic summary** (FR-009):
   - Feature name, interrupted task, files changed/staged
   - Test status (if infra exists), estimated completion %
4. **User choices** (FR-006):
   - Keep and continue → validate changes, run tests, offer next steps
   - Stash for later → `git stash` with descriptive message
   - Discard → `git checkout .` after user confirmation
5. **Auto-fix** (FR-008):
   - When changes are coherent (single task), tests pass, spec is clear
   - Offer to complete the interrupted task automatically
   - Requires explicit user confirmation
6. **State recovery** (FR-010):
   - Update `cursor.yml` with recovered state
   - Set correct `agent_mode` based on recovered context

**Agent Mode:** Inherits mode from recovered context. If resuming into `/tyrex-do`, set `build`. Otherwise, `plan`.

**Feature Context Resolution:** Use shared algorithm (flag → branch → fallback → prompt).

## Constraints & Trade-offs
- Must subsume ALL tyrex-resume functionality (no regression)
- Auto-fix is best-effort — user always has final say
- Cannot recover LLM conversation context (provider responsibility)
- Forensics depend on git — if user ran `git checkout .` before recover, changes are lost

## Dependencies
- Task 1 (crash-detection.md — references the shared detection algorithm)

## Files Affected
- `templates/commands/unified/tyrex-recover.md` (create)

## Edge Cases
- No active feature: show status, suggest `/tyrex-new`
- Multiple features with uncommitted changes: ask user which to recover (FR-013)
- Per-feature state file corrupted/missing: reconstruct from task files
- Tasks were `in_progress` when session ended: mark as `pending` for restart
- Empty diff but stale cursor: treat as normal resume, not crash
- Partial auto-fix (some files coherent, some broken): present diagnostic, don't auto-fix

## Testing Strategy
Quality: optional (markdown command, no executable code)
