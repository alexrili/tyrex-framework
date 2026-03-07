# ADR-001: Add SPEC, SRS, PRD Documentation Layers and Context Ingestion

## Status
Accepted

## Date
2026-03-07

## Context

Tyrex currently supports ADR and RFC as optional documentation, and CHANGELOG as mandatory. However, these don't cover two critical needs:

1. **Technical specification per task** — There is no standard place to document *why* a specific technical approach was chosen for a given implementation. ADRs cover high-level architecture decisions, but developers need task-level technical rationale that persists as living documentation of the software.

2. **Requirements documentation** — Functional and non-functional requirements are captured informally in feature specs but not in a structured, referenceable format (SRS). Product requirements (PRD) are often in the user's head or in external tools, with no standard way to bring them into the workflow.

3. **Context ingestion** — When working on complex projects (e.g., microservices with legacy system dependencies), broad contextual knowledge critically affects implementation decisions. There is no workflow step to capture this context, leading to AI agents making decisions without crucial background information.

## Decision

Add four new documentation/workflow elements:

1. **SPEC (Technical Specification)** — Mandatory per task during `/tyrex-plan`. Lives in `docs/specs/`. Describes the technical approach, rationale, constraints, and trade-offs for each task. Refined during `/tyrex-do`.

2. **SRS (Software Requirements Specification)** — Per demand, generated during `/tyrex-new`. Documents functional and non-functional requirements. Lives in `docs/srs/`.

3. **PRD (Product Requirements Document)** — Per demand, can be user-provided or auto-generated during `/tyrex-new`. Lives in `docs/prd/`.

4. **Context Ingestion (`/tyrex-context`)** — A new command and workflow step that accepts multi-format context (free text, files, URLs). Available at three touchpoints:
   - Post `/tyrex-init` — complement automatic mapping with human knowledge
   - During `/tyrex-new` — demand-specific context
   - Anytime via `/tyrex-context` — ad-hoc context injection
   
   Context is stored in `.tyrex/context/` (project-level) and `.tyrex/features/NNN-context.md` (demand-level).

## Consequences

**Easier:**
- Future developers understand *why* technical decisions were made (SPEC)
- Requirements are traceable and structured (SRS/PRD)
- AI agents have richer context for better decisions
- Context survives session boundaries and team member changes

**Harder:**
- More documents to maintain per demand (mitigated: SPEC is mandatory but concise; SRS/PRD are suggested)
- Workflow has additional steps (mitigated: context ingestion is prompted, not forced)
- Command count increases by 1 (`/tyrex-context`)

## Alternatives Considered

1. **Expand existing feature spec to include all this** — Rejected: feature specs would become bloated and mix concerns (product vs technical vs requirements)
2. **Make everything optional** — Rejected: SPEC must be mandatory to ensure technical rationale is always documented; SRS/PRD can remain suggested
3. **Context as part of TYREX.md only** — Rejected: TYREX.md is project-level; demand-specific context needs its own scoped storage
