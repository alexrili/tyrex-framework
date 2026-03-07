# Feature: Documentation Layers (SPEC, SRS, PRD) & Context Ingestion

## Objective
Add SPEC (mandatory per-task technical specification), SRS and PRD (per-demand requirements documents), and a context ingestion workflow (/tyrex-context command + integration into /tyrex-init and /tyrex-new) to enrich the Tyrex documentation pipeline and improve AI decision-making with richer project context.

## Acceptance Criteria
- [ ] SPEC template exists in `templates/` and is generated per task during `/tyrex-plan`
- [ ] SRS template exists and is generated per demand during `/tyrex-new` (suggested)
- [ ] PRD template exists and can be user-provided or auto-generated during `/tyrex-new` (suggested)
- [ ] `/tyrex-context` command exists — accepts free text, file paths, URLs; stores context
- [ ] Project-level context stored in `.tyrex/context/`; demand-level in feature context file
- [ ] `/tyrex-init` prompts for context ingestion after automatic mapping
- [ ] `/tyrex-new` includes a context ingestion step before doc generation
- [ ] `/tyrex-plan` reads context and generates SPEC drafts per task
- [ ] `tyrex.yml` updated with new doc options (spec, srs, prd)
- [ ] `bin/tyrex.js` scaffolds new templates and directories
- [ ] All 4 agent command files updated for modified commands
- [ ] Docs: ADR written, wiki page created, CHANGELOG updated

## Out of Scope
- Automatic context extraction from external tools (Jira, Confluence, etc.)
- AI-powered context summarization or deduplication
- Versioning of context documents
- Changes to `/tyrex-review` or `/tyrex-handoff` (will be adapted later)

## Tasks
- T1: Create SPEC, SRS, PRD templates [parallel w/ T2]
- T2: Create /tyrex-context command definition [parallel w/ T1]
- T3: Update tyrex.yml + feature template [depends: T1]
- T4: Update /tyrex-init — context ingestion [depends: T2, parallel w/ T3]
- T5: Update /tyrex-new — SRS, PRD, context [depends: T1,T2,T3]
- T6: Update /tyrex-plan — SPEC per task, context [depends: T1,T2,T5]
- T7: Update bin/tyrex.js — scaffold dirs + templates [depends: T1,T2,T3]
- T8: Update /tyrex-help — register new command [depends: T7, parallel w/ T9]
- T9: Update settings/status/resume/do commands [depends: T7, parallel w/ T8]
- T10: Sync commands to all 4 agent dirs [depends: T8,T9]
- T11: Wiki page — documentation workflow [depends: T10]

## Configuration
- Commits: approve
- Branch: `feat/doc-layers-spec-srs-prd-context`
- Docs: CHANGELOG, ADR, Wiki

## Status: done
