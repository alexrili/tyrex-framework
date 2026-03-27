# Feature 029 — Fresh Context per Task

## Summary
Redesign /tyrex-do execution model so each task runs in a sub-agent with fresh context,
eliminating context rot. The orchestrator stays lightweight, spawning isolated sub-agents
that receive only task-specific context. Adds context engineering configuration to tyrex.yml.

## Source
Backlog item BL-017 (EP-006 — Execution Engine, Phase 6)
Inspired by GSD framework's fresh-context-per-task architecture.

## Acceptance Criteria
- /tyrex-do executes each task in sub-agent with fresh context
- Orchestrator loads only metadados (TYREX.md summary, cursor, task list)
- Sub-agent receives: task spec, relevant_files list, constitution, skill
- Size limits configurable in tyrex.yml (context_engineering section)
- Sub-agent result (success/fail + summary) returns to orchestrator
- Orchestrator updates task state and cursor after each sub-agent
- Fallback to inline execution if sub-agent not available in runtime

## Out of Scope
- Wave execution (BL-018 — separate feature)
- Context monitor hooks (BL-019 — separate feature)
- Changes to bin/tyrex.js CLI code
- Runtime code changes (this is prompt engineering only)

## Technical Approach
Modify markdown command templates to instruct AI agents on fresh-context execution:
1. tyrex-do.md — new execution model with sub-agent spawning per task
2. tyrex-plan.md — add relevant_files field to task structure
3. tyrex.yml — add context_engineering config section
4. constitution.md — add context freshness rules
5. TYREX.md — document the pattern

## Files Affected
- templates/commands/unified/tyrex-do.md
- templates/commands/unified/tyrex-plan.md
- .tyrex/tyrex.yml (template + local)
- .tyrex/constitution.md
- .tyrex/TYREX.md
- templates/tyrex.yml (default config template)
- docs/CHANGELOG.md
