# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.0] - 2026-03-22

### Added
- **Skills Overhaul** — comprehensive rewrite of all skills with concrete patterns and expanded review criteria
- 3 new skills: `backend-engineer` (connection pooling, N+1, caching, graceful shutdown, idempotency), `frontend-engineer` (a11y, Core Web Vitals, state management, error boundaries), `product-manager` (INVEST user stories, MoSCoW, MVP, scope control)
- `qa-engineer` rewritten: AAA pattern, boundary testing, fixture factory, flaky test diagnosis (48→85 lines)
- `release-engineer` rewritten: breaking change detection, hotfix workflow, rollback procedures, deprecation lifecycle (42→82 lines)
- `devsec` improved: secure configuration, dependency audit, threat modeling, cryptographic key lifecycle patterns
- `debugger` improved: performance regression analysis, memory leak diagnosis, profiling patterns
- `copywriter` improved: confirmation dialog, progress indicator, table/list display patterns
- All 8 skills now have consistent structure: Role, Expertise, Guidelines, Patterns, Review Criteria

## [0.7.0] - 2026-03-20

### Added
- `/tyrex-security-review` — Comprehensive security scanning command: secrets, logical vulns, OWASP Top 10, unprotected endpoints
- Session reports in `.tyrex/security/SECURITY-NNN.md` with consolidated audit tracking in `.tyrex/security/audit.md`
- Automatic versioning in `/tyrex-do` — detects package manager, suggests semver bump, propagates version across files
- Version bump verification in `/tyrex-review` — flags when CHANGELOG changed but version didn't
- `/tyrex-test-review` — Scan for test coverage gaps with argued suggestions, persistent reports in `.tyrex/tests/`
- Test awareness integrated into 5 commands: `/tyrex-init` (detect infrastructure), `/tyrex-new` (show gaps), `/tyrex-plan` (test-aware tasks), `/tyrex-do` (run tests before commit), `/tyrex-review` (Lens 5: Test Coverage)
- QA Engineer skill template (`templates/skills/qa-engineer.md`) — ships with framework
- ADR-010: Automated tests as first-class citizen

### Fixed
- `/tyrex-review` Lens 4 — 4 stale references to `.tyrex/map/security-audit.md` updated to `.tyrex/security/audit.md`
- `/tyrex-do` — version propagation now validates semver format and scopes grep to known files (excludes node_modules, lock files)
- `/tyrex-do` — test command displayed for approval before execution in non-auto-approve mode
- `/tyrex-new` — consolidated 3 registry check blocks (bugs, security, tests) into DRY pattern
- `/tyrex-status` — added test coverage gaps section (consistent with security + bugs pattern)
- `/tyrex-security-review` — added symlink traversal rule to Security Rules
- `/tyrex-test-review` — added path safety rule to Important Rules
- `/tyrex-init` — added Adaptive Decision Format section (consistent with all interactive commands)
- `CLAUDE.md` + `AGENTS.md` — updated "4 lenses" to "5 lenses" for `/tyrex-review`

## [0.6.0] - 2026-03-19

### Added
- `/tyrex-debug` — Interactive debug command: diagnose problems, analyze logs/stack traces, manage Docker infrastructure, document bugs in `.tyrex/bugs/DEBUG-NNN.md`
- Two investigation modes: user-directed (describe symptom) and automatic analysis (AI-driven broad scan)
- Flexible diagnostic depth: quick, standard, deep
- Bug registry integration: `/tyrex-new` shows open bugs before starting features, `/tyrex-status` shows bug summary
- Debugger skill template (`templates/skills/debugger.md`) — ships with framework
- ADR-007: Interactive debug command design decisions
- "One question at a time" interaction rule — enforced in constitution.md and all 6 interactive commands
- ADR-008: One question at a time interaction pattern
- Copywriter skill template available (`templates/skills/copywriter.md`)
- `/tyrex-debug` command template: two investigation modes (user-directed + automatic), flexible diagnostic depth (quick/standard/deep), infrastructure management with user approval, session-based bug reports in `.tyrex/bugs/`
- Debugger skill template (`templates/skills/debugger.md`) — Senior Debug Engineer persona, ships with framework
- DevSec skill (`.tyrex/skills/devsec.md`) — Security-First Developer persona
- ADR-007: Interactive debug command design decisions
- PRD, SRS, Wiki, and D2 sequence diagram for debug command
- `/tyrex-new` Step 0b: checks bug registry for open bugs before starting a new feature
- `/tyrex-status` Bugs section: shows debug session count and open bugs by severity
- `/tyrex-help` updated with debug command reference and workflow diagram
- Security hardening: curl timeout, localhost-only restriction, explicit command denylist

## [0.5.4] - 2026-03-16

### Fixed
- `/tyrex-init` no longer blocks the user by requiring `tyrex init` CLI first — it now creates the project structure inline (Step 0) and proceeds with codebase mapping directly inside the LLM session

## [0.5.3] - 2026-03-15

### Changed
- Interactive agent selection: "All agents" is now the first option (recommended) instead of the last — encourages installing for all providers

## [0.5.2] - 2026-03-15

### Added
- "Updating" section in README with upgrade instructions
- `postpublish` script in package.json — automatically runs `npm deprecate` on all versions below the newly published one

## [0.5.1] - 2026-03-15

### Fixed
- CLI banner showed hardcoded version instead of reading from package.json — `VERSION` constant now uses `require("../package.json").version`

## [0.5.0] - 2026-03-13

### Added
- Copywriter skill template (`templates/skills/copywriter.md`) — UX writer persona for text review and consistency enforcement
- UX Writing Audit Report (`.tyrex/features/006-audit-report.md`)
- Skill evolution via `/tyrex-review` (ADR-006): new Step 5b extracts patterns from review findings and evolves existing skills
- `/tyrex-review` now suggests creating new skills when findings match no existing skill
- Review summary includes "Skills" section showing updated and suggested skill counts
- `/tyrex-research` command — AI-powered technical research (codebase + web), works with or without active feature, saves results on demand

### Changed
- Standardized terminology: "demand" → "feature" across all 18 command files (68 replacements)
- Standardized terminology: "quiz" → "choices" / "structured choices" across all command files (38 replacements)
- CLI text improvements: removed exclamation marks, added actionable error messages, fixed incorrect `/tyrex-status` → `/tyrex-help` reference
- Command files: fixed passive voice, filler words, verbose messages, informal language
- Dashboard formatting: standardized separator lengths (40 chars) and title format (`TYREX [Name]`)
- Converted open-ended questions to structured choices (tyrex-discuss save prompt)
- Standardized prompt response hints (`[Y/n]`, `[all/select]`, `[Y] Replace [n] Cancel [m] Merge`)
- Voice and tone: professional and direct, consistent across all touchpoints

## [0.4.0] - 2026-03-12

### Breaking Changes
- Installation is now **global-only** — removed `--local`/`-l` and `--global`/`-g` flags
- New workflow: `tyrex` (global install) → `tyrex init` (per-project setup)

### Added
- `tyrex init` subcommand: creates project `.tyrex/` structure with symlinks to global templates/commands
- Automatic symlinks for Cursor (`.cursor/rules/tyrex/`) and Codex (`.codex/skills/tyrex/`) pointing to global install
- `.tyrex/templates/` symlinked to `~/.tyrex/templates/` — projects auto-update when Tyrex is updated
- Auto-detection of globally installed agents during `tyrex init`
- Global templates directory (`~/.tyrex/templates/`) for shared document templates
- Global config-templates directory (`~/.tyrex/config-templates/`) for core file templates

### Changed
- `tyrex` (no subcommand) now installs globally to `~/` without asking local/global
- `/tyrex-init` slash command now checks for `tyrex init` CLI prerequisite
- `/tyrex-help` updated with new install flow guidance
- README updated with global-only installation instructions, symlink documentation

### Removed
- `--local`/`-l` flag
- `--global`/`-g` flag
- "Where to install?" interactive question

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
