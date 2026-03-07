# Documentation Layers

Tyrex produces and manages several types of documentation throughout the development workflow. Each serves a distinct purpose and is generated at a specific point in the lifecycle.

## Document Types

### Mandatory (always generated)

| Document | Scope | When Generated | Location |
|----------|-------|----------------|----------|
| **CHANGELOG** | Project | Every commit | `docs/CHANGELOG.md` |
| **SPEC** (Technical Specification) | Per task | `/tyrex-plan` (draft), refined during `/tyrex-do` | `docs/specs/` |

### Suggested (configurable per demand)

| Document | Scope | When Generated | Location |
|----------|-------|----------------|----------|
| **SRS** (Software Requirements Specification) | Per demand | `/tyrex-new` | `docs/srs/` |
| **PRD** (Product Requirements Document) | Per demand | `/tyrex-new` (provided or generated) | `docs/prd/` |
| **ADR** (Architecture Decision Record) | Per decision | `/tyrex-new` | `docs/adrs/` |
| **RFC** (Request for Comments) | Per proposal | `/tyrex-new` | `docs/rfcs/` |
| **Wiki** pages | Per topic | `/tyrex-wiki` or per demand | `docs/wiki/` |
| **Diagrams** | Per feature | `/tyrex-new` | `docs/diagrams/` |

## What Each Document Contains

### SPEC — Technical Specification
Written per task. Answers: *How are we implementing this, and why this approach?*

- Objective (what the task achieves technically)
- Technical Approach (implementation strategy)
- Constraints & Trade-offs
- Dependencies (libraries, services, other tasks)
- Files Affected
- Edge Cases
- Testing Strategy

### SRS — Software Requirements Specification
Written per demand. Answers: *What must the system do, and under what conditions?*

- Functional Requirements (numbered)
- Non-Functional Requirements (performance, security, scalability)
- User Stories
- Constraints and Assumptions

### PRD — Product Requirements Document
Written per demand. Answers: *What problem are we solving, and for whom?*

- Problem Statement
- Goals & Success Metrics
- User Personas
- Must-Have and Nice-to-Have requirements
- Out of Scope

## Context Ingestion

Beyond formal documents, Tyrex supports **context ingestion** — broad project knowledge that doesn't fit neatly into a template but critically affects decisions.

### What is context?
- Legacy system constraints ("patient data is synced between microservice and legacy DB")
- Business rules ("all prices must include tax in Brazil")
- External integrations ("we depend on Partner X's API which has a 100 req/min limit")
- Architectural history ("this service was extracted from the monolith in 2024")

### How to provide context
Use `/tyrex-context add` at any time. Accepts:
- **Free text** — describe the context in your own words
- **File paths** — point to existing documents or code
- **URLs** — reference external documentation

### Where context is stored
- **Project-level:** `.tyrex/context/` — applies to all demands
- **Demand-level:** `.tyrex/features/NNN-context.md` — scoped to one feature

### When context is used
- `/tyrex-plan` reads context to inform task breakdown and SPEC generation
- `/tyrex-do` reads context to guide implementation decisions

## Workflow Integration

```
/tyrex-init
  └─→ [Context Ingestion: project-level]

/tyrex-new
  ├─→ [Context Ingestion: demand-level]
  ├─→ PRD (if configured)
  ├─→ SRS (if configured)
  ├─→ ADR (if configured)
  └─→ Feature Spec

/tyrex-plan
  ├─→ Reads context, SRS, PRD
  └─→ Generates SPEC per task (mandatory)

/tyrex-do
  ├─→ Loads SPEC before each task
  ├─→ References context during implementation
  └─→ Refines SPEC after task completion

/tyrex-review
  └─→ Verifies all docs are complete and accurate
```

## Configuration

In `tyrex.yml`, under `docs:`:

```yaml
docs:
  spec: true          # LOCKED — always true
  srs: true           # Suggested per demand
  prd: true           # Suggested per demand
  adr: true           # Suggested for architecture decisions
  rfc: false          # For complex proposals
  wiki: true          # For team documentation
  diagrams: true      # Flow and architecture diagrams
  changelog: true     # LOCKED — always true
```

Each demand can override these defaults during `/tyrex-new`.

## File Structure

```
docs/
├── CHANGELOG.md           # Mandatory, updated every commit
├── specs/                 # Per-task technical specifications
│   ├── 001-task-001-*.md
│   ├── 001-task-002-*.md
│   └── ...
├── srs/                   # Per-demand requirements specs
│   └── 001-feature-name.md
├── prd/                   # Per-demand product requirements
│   └── 001-feature-name.md
├── adrs/                  # Architecture Decision Records
├── rfcs/                  # Requests for Comments
├── wiki/                  # Wiki pages (this file)
└── diagrams/              # Flow and architecture diagrams

.tyrex/
├── context/               # Project-level context files
│   └── YYYY-MM-DD-slug.md
└── features/
    ├── NNN-feature-name.md
    └── NNN-context.md     # Demand-level context
```
