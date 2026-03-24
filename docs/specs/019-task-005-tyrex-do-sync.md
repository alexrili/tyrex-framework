# SPEC: tyrex-do — Forward-Only Status Sync

## Task
Feature 019, Task 5

## Objective
On task completion in `/tyrex-do`, automatically sync subtask status to the external tracker using forward-only rule.

## Technical Approach
1. **On task success (Step 4.6)** — After commit, check if task has `external_task_ref`.
2. **Pull** — Instruct agent to call `getStatus` MCP tool for the subtask.
3. **Compare** — If remote is behind local (e.g., remote is "todo", local is "in_progress"), push forward.
4. **Push** — Instruct agent to call `setStatus` MCP tool. Max push for subtask completion is `in_progress` (subtask done locally means parent can review, but subtask itself transitions to done — wait, actually subtask completion should push subtask to done? No — per the lifecycle boundary discussion, Tyrex only pushes to "review" max for the PARENT. Subtasks are implementation details and can be marked as done by Tyrex since they represent dev work completion within the parent issue's scope).

Correction: Subtasks CAN be marked as `done` by Tyrex — the lifecycle boundary applies to the PARENT issue only. Subtask done = dev task complete. Parent review = all dev work complete, ready for pipeline.

5. **Comment** — Add comment: "Updated by {user} — powered by Tyrex Framework".
6. **Update synced_at** — Write timestamp to feature state.

Reference `external-tracker-sync.md` for full algorithm.

## Constraints
- Forward-only: never regress remote status
- Graceful degradation: if MCP fails, warn and continue (don't fail the commit)
- No extra user interaction — sync is automatic in build mode

## Files Affected
- `templates/commands/unified/tyrex-do.md`

## Edge Cases
- MCP server unavailable → warn, skip sync, note in task state
- Subtask already marked done remotely → skip push, no comment
- No external_task_ref → skip silently

## Testing Strategy
Quality: optional. Manual test.
