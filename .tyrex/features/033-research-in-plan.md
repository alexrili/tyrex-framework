# Feature 033 — Research Integrated in Plan Pipeline

## Summary
Integrate research as an automatic step in /tyrex-plan before task decomposition.
Spawn parallel researcher sub-agents that investigate stack, approaches, pitfalls,
and libraries. Results feed the planner with domain knowledge.

## Source
Backlog item BL-021 (EP-006 — Execution Engine, Phase 7)
Inspired by GSD framework's research phase.

## Acceptance Criteria
- /tyrex-plan includes research step before creating tasks
- Research spawns parallel sub-agents (stack, features, architecture, pitfalls)
- Result persists in .tyrex/features/NNN-research.md
- Planner receives research as context when creating tasks
- Configurable in tyrex.yml: workflow.research_before_plan (true/false, default true)
- Auto-skip if recent research already exists for the feature
- /tyrex-research standalone continues working independently
- /tyrex-quick respects the config

## Out of Scope
- Changes to /tyrex-research command itself
- Changes to bin/tyrex.js

## Files Affected
- templates/commands/unified/tyrex-plan.md
- .tyrex/tyrex.yml + templates/tyrex.yml
- .tyrex/TYREX.md
- docs/CHANGELOG.md
