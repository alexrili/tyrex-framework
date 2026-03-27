# Feature 036 — Seeds: ideias com trigger conditions

## Summary
Add a seed system for forward-looking ideas with trigger conditions.
Seeds surface automatically when their trigger condition matches the current context
during /tyrex-new and /tyrex-plan.

## Source
Backlog item BL-024 (EP-006 — Execution Engine, Phase 8)

## Acceptance Criteria
- New subcommand /tyrex-backlog seed "idea" --trigger "condition"
- Seeds stored in .tyrex/backlog/seeds/SEED-NNN.yml
- Format: id, idea, trigger_condition, created, status (active/promoted/dismissed)
- /tyrex-new and /tyrex-plan check active seeds against current context
- Trigger match presents seed to user with options (promote/dismiss/skip)
- Promote converts seed to backlog item with origin "seed SEED-NNN"
- /tyrex-backlog view shows seeds in separate section
- Seeds don't expire automatically

## Out of Scope
- Changes to bin/tyrex.js
- Automatic trigger evaluation (AI-based matching is acceptable)

## Files Affected
- templates/commands/unified/tyrex-backlog.md
- templates/commands/unified/tyrex-new.md
- templates/commands/unified/tyrex-plan.md
- docs/CHANGELOG.md
- package.json
