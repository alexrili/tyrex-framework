# Feature 025: Discuss ↔ Backlog Integration

## Objective
Integrate /tyrex-discuss with the backlog system bidirectionally: focus discussion on specific items, detect actionable ideas mid-conversation, and enable item enrichment through discussion.

## Acceptance Criteria
- Discuss accepts --backlog BL-NNN flag to focus on a specific item
- Discuss detects actionable ideas mid-conversation and offers to save to backlog
- Discuss can enrich existing items (update description + acceptance_criteria)
- Backlog detail view [4] Discuss initiates focused discuss on the item
- Proactive offer is non-intrusive — offers, never forces
- Generated items are structured (title, description, acceptance_criteria)

## Out of Scope
- Backlog → execution integration (BL-009)
- Review → backlog integration (BL-010)
- Roadmap reorganization via discuss (deferred)

## Skills
- backend-engineer

## Docs
- SPEC: per task (mandatory)

## Backlog Items
- BL-008 (consolidated with BL-012)

## Status: spec
