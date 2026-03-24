# SPEC: Task 001 — Update tyrex-plan.md task granularity directives

## Feature
022 — Plan Granular Tasks

## Objective
Remove the artificial 15-task limit from `/tyrex-plan` and replace it with directives for proactive task splitting based on complexity.

## Technical Approach

**Remove:**
- Line: "NEVER propose more than 15 tasks for a single feature (break into multiple features if needed)"

**Replace with:**
- No artificial task count limit. Task count scales with feature complexity.
- Each task MUST be small enough to implement in ONE focused commit.
- If a task would touch more than 3 files or require more than ~100 lines of changes, split it into smaller tasks.
- If a task has the estimate `large`, it MUST be broken into 2+ smaller tasks before the plan is approved.

**Add task splitting directive to "Rules for task decomposition":**
- A task is too large if: it modifies >3 files, spans multiple concerns (e.g., data model + API + validation), or the SPEC's Technical Approach section exceeds 10 lines.
- When splitting: keep flat numbering (task-001, task-002, ...), add clear dependency chains.
- Prefer many small precise tasks over few large vague ones.

**Update escalation rule:**
- Instead of "max 15 tasks", the escalation trigger is: feature would need >30 tasks, or spans multiple services/domains that should be separate features.

**Also update constitution.md:**
- Remove "Generate specs or plans longer than 50 lines per feature" — this conflicts with larger plans.
- Replace with: "Generate feature specs longer than 50 lines" (plan size is uncapped, feature SPEC stays concise).

## Files Affected
- `templates/commands/unified/tyrex-plan.md`
- `.tyrex/constitution.md`

## Testing Strategy
Not applicable (markdown prompt files).
