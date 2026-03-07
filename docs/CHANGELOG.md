# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Feature 002: Skills System — spec created, ADR-002 accepted
- ADR-002: Skills System — Reusable AI Agent Personas
- Wiki page: Documentation Layers (`docs/wiki/documentation-layers.md`)
- Synced 17 commands (including new `/tyrex-context`) to all 4 agent directories
- Updated self-hosted `.tyrex/tyrex.yml` with SPEC/SRS/PRD doc options
- `/tyrex-help` now registers `/tyrex-context` command and mentions SPEC/SRS/PRD doc types
- `/tyrex-settings` displays SPEC/SRS/PRD options (SPEC is locked as mandatory)
- `/tyrex-status` shows documentation coverage (SPECs, SRS, PRD) and context file counts
- `/tyrex-resume` loads context files and existing SPEC/SRS/PRD during session recovery
- `/tyrex-do` loads SPEC before each task, references context, and refines SPEC after execution
- CLI (`bin/tyrex.js`) now scaffolds `docs/specs/`, `docs/srs/`, `docs/prd/`, `.tyrex/context/` directories and copies SPEC/SRS/PRD templates
- `/tyrex-plan` now reads context/SRS/PRD, generates mandatory SPEC drafts per task, includes spec_file in task state
- `/tyrex-new` now includes context ingestion step, SRS/PRD in doc bundle, and ordered doc generation
- Config templates updated with SPEC, SRS, PRD doc options (`templates/tyrex.yml`, `templates/feature.md`)
- `/tyrex-init` now includes context ingestion step after codebase analysis
- SPEC template (`templates/spec.md`) — per-task technical specification
- SRS template (`templates/srs.md`) — per-demand software requirements specification
- PRD template (`templates/prd.md`) — per-demand product requirements document
- `/tyrex-context` command (`templates/commands/unified/tyrex-context.md`) — context ingestion and management
- Feature 001: Documentation Layers (SPEC, SRS, PRD) & Context Ingestion — spec created
- ADR-001: Decision to add SPEC/SRS/PRD documentation layers and context ingestion workflow
- Project initialized with Tyrex Framework v0.1.0
