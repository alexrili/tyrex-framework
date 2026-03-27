# Feature 030 — Wave Execution com Dependency Graph

## Summary
Evolve /tyrex-plan to generate explicit dependency graphs with wave assignments,
and /tyrex-do to execute tasks in parallel waves. Tasks without dependencies run
in the same wave (parallel sub-agents). Dependent tasks wait for prior waves.

## Source
Backlog item BL-018 (EP-006 — Execution Engine, Phase 6)
Inspired by GSD framework's wave execution model.
Builds on Feature 029 (fresh context per task).

## Acceptance Criteria
- /tyrex-plan generates 'depends_on' field per task (list of task IDs)
- /tyrex-plan generates 'wave' field calculated automatically from dependencies
- /tyrex-do groups tasks by wave and executes each wave in parallel (sub-agents)
- Tasks within the same wave cannot have file conflicts
- Wave N+1 only starts when wave N completes successfully
- If a task fails, wave stops and reports (does not execute dependents)
- Wave visualization in /tyrex-quick visual roadmap
- Fallback to sequential execution if parallelism not supported

## Out of Scope
- Context monitor (BL-019 — separate feature)
- Changes to bin/tyrex.js CLI code
- Runtime code changes (prompt engineering only)

## Technical Approach
1. tyrex-plan.md — add wave calculation algorithm after task decomposition
2. tyrex-do.md — add wave-based execution loop in fresh context mode
3. tyrex-quick.md — update visual roadmap to show waves
4. tyrex.yml — uses existing parallel.max_agents for wave batching (no new config needed)

## Files Affected
- templates/commands/unified/tyrex-plan.md
- templates/commands/unified/tyrex-do.md
- templates/commands/unified/tyrex-quick.md
- .tyrex/tyrex.yml + templates/tyrex.yml
- .tyrex/TYREX.md
- docs/CHANGELOG.md
