# Feature 021: Quick Rewrite & Doc Impact Analysis

## Objective
Rewrite `/tyrex-quick` as an orchestrator that delegates to full `new → plan → do` (auto-approving confirmations, not skipping stages) and create a Doc Impact Analysis shared algorithm that mechanically detects documentation drift across plan, do, and review.

## Acceptance Criteria
- `/tyrex-quick` produces identical artifacts to manual `new → plan → do`
- Ambiguous prompts still trigger clarification questions in quick mode
- Doc Impact Analysis scans README, wiki, OpenAPI, diagrams, TYREX.md, config files
- Inconsistencies auto-create fix tasks in `/tyrex-do` before closing
- `/tyrex-review` includes Lens 6: Documentation Consistency
- `/tyrex-plan` adds doc update task when changes affect documented values
- All 4 agent directories synced after command updates

## Out of Scope
- Automated OpenAPI/README generation (existing commands)
- External doc systems (Confluence, Notion)
- Fuzzy text matching (scan uses specific patterns only)

## Skills
- product-manager
- backend-engineer

## Documentation
- PRD: docs/prd/021-quick-rewrite-doc-impact.md
- SRS: docs/srs/021-quick-rewrite-doc-impact.md
- ADR: docs/adrs/014-quick-rewrite-doc-impact.md
- Diagram: docs/diagrams/021-quick-rewrite-doc-impact-architecture.d2

## Status
done
