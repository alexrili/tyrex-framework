# Feature 004: Documentation System

## Objective
Overhaul Tyrex's documentation system with complete templates, D2 diagrams, and customizable doc layers so each project/company can adapt the documentation workflow to their needs.

## Acceptance Criteria
- [ ] All doc templates are complete and production-ready (SPEC, SRS, PRD, ADR, RFC, CHANGELOG, README, diagram)
- [ ] Diagram template uses D2 language with multiple diagram types (architecture, sequence, data flow, ER)
- [ ] `/tyrex-new` always offers diagram generation for the demand
- [ ] Mermaid references replaced with D2 across all commands
- [ ] `/tyrex-settings` has a dedicated documentation configuration section
- [ ] Users can add custom doc types (template + config in tyrex.yml)
- [ ] tyrex.yml docs section supports custom doc layers
- [ ] ADR-004 recorded (done)
- [ ] CHANGELOG updated

## Out of Scope
- D2 CLI installation/rendering automation
- Automatic diagram generation from code analysis
- Migration tool for existing Mermaid diagrams

## Skills
None

## Configuration
- Docs: CHANGELOG, SPEC, ADR-004
- Branch: feat/documentation-system
- Commits: approve

## Status
done
