# Feature 024: Command Resilience + Backlog System

## Objective
Improve command precision in long contexts (checkpoints, guardrails inline), add next-action suggestions for continuous flow, and create the /tyrex-backlog command for structured backlog management.

## Acceptance Criteria
- Shared guardrails-inline template referenced by all executor commands (do, quick, review)
- Checkpoint reminder system injected into execution-checklist at configurable intervals
- Every command suggests the next action upon completion with context
- /tyrex-backlog command with CRUD subcommands: add, edit, remove, view, plan, pick
- Backlog items stored in .tyrex/backlog/items/BL-NNN.yml
- Help, status, and CLAUDE.md updated with backlog command
- All commands synced to 4 agent directories

## Out of Scope
- Discuss ↔ backlog integration (BL-008, Phase 2)
- Backlog → execution integration (BL-009, Phase 4)
- Review → backlog integration (BL-010, Phase 5)
- Git as audit trail (BL-014, Phase 3)

## Skills
- backend-engineer

## Docs
- ADR: yes
- SPEC: per task (mandatory)

## Backlog Items
- BL-001: Checkpoint system
- BL-002: Guardrails inline
- BL-004: Next-action suggestion
- BL-007: Comando /tyrex-backlog

## Status: done
