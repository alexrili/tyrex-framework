# ADR-004: Documentation System — D2 Diagrams, Complete Templates, and Customizable Doc Layers

## Status
Accepted

## Date
2026-03-12

## Context
Tyrex offers documentation generation (SRS, PRD, SPEC, diagrams, etc.) but the templates are incomplete and vague. The diagram feature exists in config and flow but has no concrete template or format defined. Additionally, every company has its own documentation workflow — Tyrex's fixed doc layers don't accommodate custom documentation needs.

## Decision

1. **D2 language for diagrams** — replace Mermaid references with D2 (d2lang.com). D2 produces cleaner, more readable diagrams with a simpler syntax. Diagrams are always offered during `/tyrex-new` as a way to visualize the proposed solution.

2. **Complete templates** — every doc type gets a well-structured, production-ready template:
   - SPEC (technical specification per task)
   - SRS (software requirements specification)
   - PRD (product requirements document)
   - ADR (architecture decision record)
   - RFC (technical proposal)
   - CHANGELOG
   - README
   - Diagram (D2-based, multiple types: architecture, sequence, data flow, ER)

3. **Customizable documentation layers** — users can configure which doc types they use and add custom doc types via `/tyrex-settings`. The framework ships with a standard set but doesn't force it. Custom doc types are defined as templates in `.tyrex/templates/`.

## Consequences
- **Easier:** Users get production-ready doc templates out of the box
- **Easier:** Companies can adapt Tyrex's doc workflow to their own standards
- **Easier:** Diagrams become concrete and useful (D2 is readable as code and renderable as images)
- **Harder:** D2 is less widely known than Mermaid — users may need to install `d2` CLI for rendering
- **Unchanged:** Core doc types (SPEC, CHANGELOG) remain mandatory

## Alternatives Considered
1. **Keep Mermaid** — more widely supported but less readable syntax and limited layout control
2. **PlantUML** — powerful but requires Java runtime, heavy for a zero-dep CLI
3. **D2 (chosen)** — clean syntax, standalone binary, excellent layout engine, readable as plain text
