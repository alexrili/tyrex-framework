# Feature: External Tracker Integration (Bidirectional)

## Objective
Connect Tyrex features to external issue trackers (Jira, Linear, GitHub Issues) via MCP, enabling bidirectional status sync, subtask creation, and issue import — with zero new dependencies.

## Acceptance Criteria
- [ ] Import issue by ID from external tracker in `/tyrex-new`
- [ ] Two modes: read-only (context) and build (assign + sync)
- [ ] Create subtasks in tracker during `/tyrex-plan`
- [ ] Forward-only status sync during `/tyrex-do` and `/tyrex-review`
- [ ] Max status push is "review", never "done"
- [ ] Comment trail on every status update
- [ ] Config via `tyrex.yml` + `/tyrex-settings` + `tyrex init`
- [ ] Provider-agnostic (works with any MCP-enabled tracker)

## Out of Scope
- Attachments, bulk import, webhooks, sprint management
- CLI making HTTP calls (MCP-only)
- Setting "done" on remote (human/pipeline responsibility)

## Skills
- backend-engineer
- product-manager

## Tasks
1. Config foundation (tyrex.yml, feature-context-resolution, bin/tyrex.js) [backend-engineer]
2. Shared external tracker sync algorithm [product-manager]
3. tyrex-new — import from external tracker [product-manager]
4. tyrex-plan — subtask creation in tracker [product-manager]
5. tyrex-do — forward-only status sync [product-manager]
6. tyrex-review — push parent to review [product-manager]
7. tyrex-settings — tracker configuration [product-manager]
8. tyrex-status — sync state display [product-manager]
9. Sync commands to agent directories

Wave 1: [1] + [2] parallel | Wave 2: [3-8] parallel | Wave 3: [9] sequential

## Configuration
- Docs: changelog, spec, srs, prd, adr, wiki, diagrams
- Branch: feat/019-external-tracker-integration
- Commits: approve

## Status: done
