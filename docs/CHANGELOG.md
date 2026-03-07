# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-03-07

First release of the Tyrex Framework — human-driven, AI-accelerated pair programming.

### Core Framework
- CLI installer (`bin/tyrex.js`) with interactive setup for 4 AI agents: Claude Code, OpenCode, Cursor, Codex
- `.tyrex/` project structure: state management, feature specs, templates, skills, context, codebase mapping
- `docs/` structure: CHANGELOG, ADRs, RFCs, wiki, diagrams, specs, SRS, PRD
- Core files: `TYREX.md` (living project context), `constitution.md` (inviolable guardrails), `cursor.yml` (session recovery)
- Configuration via `tyrex.yml`: commit mode, branch mode, doc level, quality strategy, parallelization
- Protection against accidental overwrite of evolved core files on re-install (`--force` flag to override)

### Commands (18 total)
- `/tyrex-init` — Initialize project with codebase analysis, security audit, and config. Greenfield support with structured flow
- `/tyrex-new` — Start new feature with roadmap check, context ingestion, skill suggestion, doc generation (SPEC/SRS/PRD/ADR/RFC)
- `/tyrex-plan` — Plan tasks with dependencies, parallelism, skill assignments, quality strategy, and SPEC generation per task
- `/tyrex-do` — Execute tasks with TDD, skill-aware context, SPEC loading, parallel sub-agents
- `/tyrex-review` — Review implementation against acceptance criteria, finalize docs, evolve TYREX.md
- `/tyrex-quick` — Quick task without full ceremony (bug fixes, tweaks)
- `/tyrex-handoff` — Deterministic autopilot chaining new→plan→do→review
- `/tyrex-status` — Comprehensive dashboard: features, roadmap, health diagnostics, documentation coverage, skills, context
- `/tyrex-resume` — Fast session recovery from cursor.yml
- `/tyrex-settings` — View/modify Tyrex configuration
- `/tyrex-evolve` — Update TYREX.md with new patterns, hurdles, decisions
- `/tyrex-discuss` — Interactive project exploration and technical discussion (codebase, greenfield, hybrid modes)
- `/tyrex-skills` — Manage reusable skill personas (create, list, sync)
- `/tyrex-context` — Ingest and manage project context (free text, files, URLs)
- `/tyrex-readme` — Generate or update project README.md
- `/tyrex-openapi` — Generate OpenAPI documentation from code (read-only)
- `/tyrex-wiki` — Generate or update project wiki pages
- `/tyrex-help` — Command reference with workflow diagram and contextual suggestions

### Documentation System
- SPEC template — mandatory per-task technical specification
- SRS template — per-demand software requirements specification
- PRD template — per-demand product requirements document
- ADR template — architecture decision records
- RFC template — technical proposals
- Context ingestion at project and demand levels (`.tyrex/context/`, `.tyrex/features/NNN-context.md`)

### Skills System (ADR-002)
- Skill personas as markdown files in `.tyrex/skills/` (Role, Expertise, Guidelines, Patterns, Review Criteria)
- Auto-suggestion during `/tyrex-new` based on demand analysis
- Skill-aware task assignment during `/tyrex-plan`
- Skill loading during `/tyrex-do` task execution

### Project Roadmap
- `.tyrex/roadmap.yml` for tracking planned, in-progress, and completed features
- `/tyrex-new` checks roadmap for planned features and updates on create
- `/tyrex-review` marks features as done in roadmap
- `/tyrex-status` displays roadmap with forward-looking visibility

### Architecture Decisions
- ADR-001: Documentation Layers (SPEC, SRS, PRD) & Context Ingestion
- ADR-002: Skills System — Reusable AI Agent Personas
