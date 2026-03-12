# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-03-12

### Added
- D2 diagram templates: architecture, sequence, data-flow, ER (templates/diagrams/)
- Diagram markdown wrapper template (templates/diagram.md)

### Changed
- SPEC template: added acceptance criteria, rollback plan, improved guidance
- SRS template: added system context, data requirements, interface requirements, acceptance testing
- PRD template: added competitive landscape, risks, launch criteria, timeline
- ADR template: added participants, related ADRs, positive/negative consequences
- RFC template: added implementation plan, rollout strategy, security considerations, metrics
- `/tyrex-new`: diagrams always offered (not just when pre-configured), uses D2 with type selection
- `/tyrex-readme`: replaced Mermaid with D2 diagrams
- `/tyrex-wiki`: replaced Mermaid with D2 diagrams
- `/tyrex-review`: diagram check specifies D2 format
- `tyrex.yml`: added `docs.custom` array for user-defined documentation layers
- `/tyrex-settings`: dedicated documentation management section with add/remove custom doc types
- README: added D2 diagrams, customizable documentation, and updated documentation layers table

## [0.2.1] - 2026-03-12

### Changed
- Constitution: replaced mandatory quiz format with adaptive decision format (ADR-003)
- TYREX.md: updated pattern and architecture decisions table
- All command templates: replaced "Interactive Quiz Rule" with "Adaptive Decision Format"
- AGENTS.md and README.md: updated references to structured choices
- Decisions now adapt to agent interface — CLI: numbered quiz, Chat: numbered list or direct question

## [0.2.0] - 2026-03-12

### Framework Simplification & Quality Upgrade

#### Interactive Quiz UX
- All user decisions across all commands now use interactive quiz format (multiple-choice selection)
- Consistent UX pattern — no open-ended questions when a quiz can be used

#### Security-First Planning
- `/tyrex-plan` performs a security assessment BEFORE proposing tasks
- Security-sensitive tasks auto-get `devsec` skill and `quality: required`
- Features with security implications get a dedicated security hardening task

#### 4-Lens Senior Code Review
- `/tyrex-review` evaluates through 4 lenses: Pattern Compliance, Code Quality & DRY, Business & Technical Compliance, Security First
- Uses senior engineer persona matched to the project's tech stack

#### Review → Fix Loop
- `/tyrex-review --do-all` auto-creates fix tasks (`rc-` prefixed) for all review findings
- `/tyrex-review --do-critical` auto-creates fix tasks for critical findings only
- Includes mini re-review after fixes are applied

#### Command Flags
- `/tyrex-do --auto-approve` — skip all human checkpoints during task execution
- `/tyrex-review --do-all|--do-critical` — auto-create fix tasks from review findings
- `/tyrex-review full` — codebase-wide re-scan (default remains PR scope)
- `/tyrex-quick --auto-approve` — full autopilot mode

#### Quick Task Redesign
- `/tyrex-quick` redesigned as fast-track unified `new → plan → do` pipeline
- Same quality guarantees, fewer steps
- With `--auto-approve`, replaces the old `/tyrex-handoff` workflow

#### Deprecations
- `/tyrex-handoff` deprecated — replaced by `/tyrex-quick --auto-approve`

#### Built-in DevSec Skill
- `templates/skills/devsec.md` ships with the framework
- Auto-suggested when security-sensitive areas are detected during `/tyrex-new` and `/tyrex-plan`
- Covers OWASP/SANS security guidelines

#### TYREX.md Auto-Update
- When macro docs (ADR, PRD, SRS) are generated or updated, commands auto-update TYREX.md with summaries in appropriate sections

## [0.1.1] - 2026-03-08

### Agent Mode Enforcement
- Added `agent_mode` field (`plan`/`build`) to `cursor.yml` — each command sets this as its first action
- Added "On Agent Mode" section to `constitution.md` — inviolable rules preventing code writes in plan mode
- All 18 commands now declare their mode in an `## Agent Mode` section
- 16 commands run in `plan` mode, 2 in `build` mode (`/tyrex-do`, `/tyrex-quick`), `/tyrex-resume` inherits, `/tyrex-handoff` transitions dynamically
- Updated `CLAUDE.md` and `AGENTS.md` with step 3: "Check mode" before any action

### Security Tracking
- `/tyrex-status` now reads `.tyrex/map/security-audit.md` and displays pending security findings
- `/tyrex-review` includes a dedicated Security Review step (Step 3) that cross-references changed files against findings
- `/tyrex-init` documents required `Status` column format (`[ ]`/`[x]`) for security-audit.md
- Security findings use checkbox tracking — resolved findings change from `[ ]` to `[x]`, never deleted

### Review Scopes
- `/tyrex-review` (default) = PR review — only reviews branch diff against base
- `/tyrex-review full` = codebase-wide re-scan with security audit file update
- Review is 100% plan mode — all suggestions are recommendations, never direct code writes

### OpenCode Plugin Integration
- Created `opencode.json` with plan/build agent definitions and native permission enforcement
- Created `.opencode/plugin.ts` — Tyrex plugin using `command.execute.before` and `permission.ask` hooks
- Plan agent has `edit: "deny"` — mechanical prevention of file writes, not just prompt-based
- Plugin auto-switches agents when `/tyrex-*` commands are executed

### Documentation
- README install instructions now include direct git-based npm install for scenarios without a published package

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
