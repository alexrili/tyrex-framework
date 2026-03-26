# Feature 026: Git as Backbone — Semantic Commits + Auto Tags

## Objective
Make git the audit trail for all project decisions. Plan-mode commands auto-commit .tyrex/ changes with semantic prefixes. Milestones auto-create tags for visibility.

## Acceptance Criteria
- Plan-mode commands (discuss, backlog, plan) auto-commit .tyrex/ changes
- Commit prefixes: backlog:, discuss:, plan:
- Configurable via tyrex.yml git.auto_commit_state (auto/batch/off)
- Tags created on: feature approved, phase completed, version bump
- Tag patterns: tyrex-feature-NNN-done, tyrex-phase-N-done, tyrex-vX.Y.Z
- git tag --list 'tyrex-*' shows complete progress

## Out of Scope
- Recovery via git log (BL-015b, deferred to Phase 5)
- Backlog → execution integration (BL-009)

## Skills
- backend-engineer

## Docs
- SPEC: per task (mandatory)

## Backlog Items
- BL-014 (consolidated with BL-015)

## Status: done
