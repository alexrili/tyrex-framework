# SPEC: tyrex-plan — Subtask Creation in Tracker

## Task
Feature 019, Task 4

## Objective
After task decomposition in `/tyrex-plan`, offer to create subtasks in the external tracker when the feature has `external_ref` in build mode.

## Technical Approach
1. **New Step 6b** (after Step 6: Save the plan) — Check if feature has `external_ref` with `mode: "build"`.
2. **Offer sync** — Structured choice: `[1] Create subtasks in {tracker} for each task` / `[2] Skip`.
3. **Create subtasks** — For each task, instruct agent to call `createSubtask` MCP tool with parent issue ID, task title, and task description from SPEC.
4. **Store refs** — Write `external_task_ref` (id, url) to each task state file.
5. **Comment** — Add comment to parent issue listing all created subtasks.

Reference `external-tracker-sync.md` for MCP tool mapping.

## Constraints
- Only in build mode — read-only features skip this entirely
- One confirmation question, then batch creation (no per-subtask approval)

## Files Affected
- `templates/commands/unified/tyrex-plan.md`

## Edge Cases
- Some subtasks fail to create → warn, continue with remaining, note which failed
- Feature has no external_ref → skip silently

## Testing Strategy
Quality: optional. Manual test with Jira MCP server.
