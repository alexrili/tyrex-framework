# SPEC: Task 001 — Rewrite Core Doc Templates

## Feature
Feature 004: Documentation System

## Objective
Rewrite SPEC, SRS, PRD, ADR, and RFC templates to be complete, production-ready, and self-documenting.

## Technical Approach
For each template:
1. Keep `{{PLACEHOLDER}}` interpolation for project/date fields (used by `copyTemplate()`)
2. Add complete section structure with guidance comments explaining what each section should contain
3. Add inline examples where helpful (commented out)
4. Ensure each template is usable standalone — an AI agent reading it should know exactly what to produce
5. Follow the naming pattern already established: lowercase-hyphenated filenames

Templates to rewrite:
- `templates/spec.md` — Add: acceptance criteria checklist, rollback plan, dependencies matrix
- `templates/srs.md` — Add: system context, data requirements, interface requirements, acceptance testing
- `templates/prd.md` — Add: competitive landscape, risks, dependencies, launch criteria
- `templates/adr.md` — Add: participants, related ADRs, review date
- `templates/rfc.md` — Add: implementation plan, rollout strategy, metrics

## Files Affected
- `templates/spec.md`
- `templates/srs.md`
- `templates/prd.md`
- `templates/adr.md`
- `templates/rfc.md`

## Testing Strategy
Quality: optional — manual review of markdown templates.
