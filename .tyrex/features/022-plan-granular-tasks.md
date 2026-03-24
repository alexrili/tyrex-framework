# Feature 022: Plan Granular Tasks

## Objective
Remove the artificial 15-task limit from `/tyrex-plan` and add directives for breaking large tasks into smaller, more precise ones. Each task should be small enough to implement in one focused commit with high quality.

## Acceptance Criteria
- No hardcoded task limit in `/tyrex-plan`
- Large tasks are proactively broken into smaller ones
- Task granularity scales with feature complexity
- Escalation rule: suggest splitting into multiple features when truly massive (not a task count limit)
- `/tyrex-quick` inherits the same behavior (delegates to plan)
- All 4 agent directories synced after command update

## Out of Scope
- Sub-task hierarchy (task-001a, task-001b) — keep flat numbering
- Changes to task state file format
- Changes to parallelism rules

## Skills
- product-manager

## Documentation
- CHANGELOG + SPEC only

## Status
done
