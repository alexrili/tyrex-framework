# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.23.0] - 2026-03-27

### Added
- **Workstreams** — new `/tyrex-workstream` command for parallel namespaced work. Create isolated work contexts with their own cursor, features, and branch prefix. Switch between workstreams, complete when done. (BL-027)
- **Workstream in status** — `/tyrex-status` shows active workstream and feature progress

## [1.22.0] - 2026-03-27

### Added
- **Milestones** — new `/tyrex-milestone` command for grouping features into versioned releases. Create milestones with target version, features list, and definition of done. Audit checks readiness, complete creates git tag. (BL-026)
- **Milestone in new** — `/tyrex-new` offers to associate features with the active milestone
- **Milestone in status** — `/tyrex-status` shows active milestone progress

## [1.21.0] - 2026-03-27

### Added
- **Threads** — new `/tyrex-thread` command for persistent cross-session knowledge topics. Create, list, open, and append to named threads. Entries are append-only with timestamps. (BL-025)
- **Thread context in discuss** — `/tyrex-discuss --thread "name"` loads a thread as background context. Conclusions can be saved back to the thread.
- **Threads in status** — `/tyrex-status` shows 3 most recently updated threads

## [1.20.0] - 2026-03-27

### Added
- **Seeds system** — `/tyrex-backlog seed "idea" --trigger "condition"` plants forward-looking ideas that surface automatically when their trigger condition matches the current feature context. Seeds are checked in `/tyrex-new` (Step 0e) and `/tyrex-plan` (Step 2c). Can be promoted to backlog items, dismissed, or skipped. (BL-024)
- **Seeds management** — `/tyrex-backlog seeds` lists all seeds with status. Seeds stored in `.tyrex/backlog/seeds/SEED-NNN.yml`

## [1.19.0] - 2026-03-27

### Added
- **Discuss assumptions mode** — `/tyrex-discuss --assumptions` inverts the interview-first flow: system analyzes the codebase, proposes what it would do and why, user corrects what's wrong. Works in Codebase and Hybrid modes. Falls back to standard mode in Greenfield. (BL-023)
- **Discuss mode config** — `workflow.discuss_mode` in `tyrex.yml` sets the default discuss behavior (`"discuss"` or `"assumptions"`)

## [1.18.0] - 2026-03-27

### Added
- **Ship/PR command** — new `/tyrex-ship` creates pull requests from completed features. Auto-generates PR title (conventional commit) and body from feature spec, CHANGELOG, task summaries, verification report, and review findings. Supports `--draft` (draft PR) and `--squash` (squash commits). Uses `gh` CLI with manual fallback. Syncs to external tracker. (BL-022, ADR-021)
- **Ship suggestion in quick** — `/tyrex-quick` accept flow now suggests `/tyrex-ship` as next step

### Changed
- **Full pipeline** — complete workflow is now: new → plan → do → verify → review → accept → ship

## [1.17.0] - 2026-03-27

### Added
- **Research integrated in plan** — `/tyrex-plan` Step 2b spawns 4 parallel researcher sub-agents (stack, approach, pitfalls, architecture) before task decomposition. Results persist in `NNN-research.md` and feed the planner as context. Auto-skips if recent research exists. Inline fallback. (BL-021, ADR-020)
- **Workflow config section** — new `workflow` section in `tyrex.yml` with `research_before_plan` toggle (default: true)

## [1.16.0] - 2026-03-27

### Added
- **Verify/UAT command** — new `/tyrex-verify` for manual user acceptance testing. Extracts testable deliverables from specs, walks through one at a time (pass/fail/skip), auto-diagnoses failures, creates fix tasks with SPEC. Fix→re-verify loop (max 3 iterations). Results persist in NNN-verify.md. Plan mode. (BL-020, ADR-019)
- **Verify in quick pipeline** — `/tyrex-quick` now includes verify between do and review. Pipeline: new→plan→do→verify→review→accept. `--auto` mode auto-assesses deliverables by comparing code vs spec.

### Changed
- **tyrex-do next action** — now suggests `/tyrex-verify` as first option after task completion, before `/tyrex-review`

## [1.15.0] - 2026-03-27

### Added
- **Context monitor** — heuristic-based context window monitoring during long sessions. Estimates usage via task progress ratio, files read, and conversation turns. Configurable thresholds in `tyrex.yml` (info: 50%, warning: 70%, critical: 85%). Warnings injected naturally after task/wave completion. (BL-019, ADR-018)
- **Context monitoring config** — new `context_engineering.monitoring` section in `tyrex.yml` with `enabled`, `thresholds` (info/warning/critical), and `check_interval` (after_each_task/after_each_wave/manual)
- **Shared context-monitor.md** — estimation heuristics, warning format per threshold, action suggestions by execution mode (fresh vs inline)
- **Context health in /tyrex-status** — new section showing execution mode, estimated usage, threshold status, and recommendation

### Changed
- **tyrex-do monitoring integration** — context monitor checkpoint after each wave (fresh mode) or each task (inline mode). Critical threshold recommends fresh session.

## [1.14.0] - 2026-03-27

### Added
- **Wave execution with dependency graph** — `/tyrex-plan` Step 3a calculates wave assignments from task dependencies. Wave 1 = tasks with no dependencies (parallel). Wave N = max(dependency waves) + 1. File conflict check within waves. Circular dependency detection. (BL-018, ADR-017)
- **Wave-based execution loop** — `/tyrex-do` executes waves sequentially, tasks within each wave in parallel (fresh sub-agents). Wave N+1 starts only when Wave N completes successfully. Failure stops wave propagation with retry/skip/stop choices
- **Wave field in task state** — tasks now have a `wave` field auto-calculated during planning. Pre-v1.14 tasks without wave field fall back to sequential execution
- **Enhanced visual roadmap** — `/tyrex-quick` roadmap shows wave groupings, parallel/sequential indicators, dependency arrows, and execution mode choice (wave-parallel vs sequential)

### Changed
- **Execution plan presentation** — `/tyrex-do` Step 3 now presents wave execution plan instead of flat parallelization choice

## [1.13.0] - 2026-03-27

### Added
- **Fresh context per task** — `/tyrex-do` now executes each task in a sub-agent with a fresh context window, eliminating context rot. Orchestrator stays lightweight (<40% context budget). Sub-agents receive targeted context only: task SPEC, relevant_files, constitution, skill, feature summary. (BL-017, ADR-016)
- **Context engineering config** — new `context_engineering` section in `tyrex.yml` with `execution_mode` (fresh/inline), `orchestrator_context`, `subagent_context`, and `size_limits` (max_spec_lines, max_context_files, max_file_lines, tyrex_md_summary_lines)
- **Relevant files field** — `/tyrex-plan` task structure now includes `relevant_files` — files the sub-agent reads for context (interfaces, existing code, test patterns). Distinct from `Files` (write targets). Max 10 per size_limits
- **Inline execution fallback** — auto-detects when runtime doesn't support sub-agents and falls back to inline (legacy) execution silently
- **Constitution context engineering rules** — new "On Context Engineering" section in constitution.md defining fresh context boundaries and sub-agent responsibilities

### Changed
- **Execution model** — `/tyrex-do` Step 1 is now lightweight orchestrator-only loading. Full context loading moved to sub-agent preparation phase
- **Parallelization section** — constitution.md parallelization rules simplified to reference fresh context model

## [1.12.1] - 2026-03-26

### Changed
- **Quick now includes review** — `/tyrex-quick` lifecycle is now `new→plan→do→review→accept/reject`. Review runs 6 lenses on branch diff. With `--auto`: auto-accepts if 0 CRITICAL/HIGH findings, stops otherwise. Final report includes review summary.

## [1.12.0] - 2026-03-26

### Added
- **Compliance audit** — execution checklist runs post-completion audit verifying CHANGELOG, version bump, tests, SPECs, state, and settings compliance. Critical gaps block commit (BL-003)
- **Review → backlog integration** — `/tyrex-review` Step 7 offers "Save to backlog" option, creating draft items from findings with severity-based priority and review origin tracking (BL-010)
- **5 core commands UX** — `/tyrex-help` restructured to highlight 5 core commands (discuss, backlog, quick, status, recover). Advanced commands grouped separately. Workflow paths updated to reflect recommended flow (BL-011)

## [1.11.0] - 2026-03-26

### Added
- **Visual roadmap before execution** — `/tyrex-quick` shows task execution graph with BL-item source before starting. User confirms or modifies (BL-016)
- **Safe revert via git checkpoint** — `/tyrex-quick` creates `tyrex-checkpoint-NNN` tag before execution. Reject = `git reset --hard` to checkpoint. No partial state (BL-006)
- **Accept/reject flow** — `/tyrex-quick` final report with consolidated delivery summary. Without `--auto`: user must accept or reject. Rejection reverts everything (BL-005)
- **`--backlog` flag on `/tyrex-quick`** — executes all `ready` backlog items sequentially with full pipeline per item. Combined summary at end (BL-009)
- **Backlog source in `/tyrex-new` Step 0** — offers ready backlog items as feature source alongside roadmap and external tracker (BL-009)
- **Automatic backlog status updates** — ready→in-progress→done follows the pipeline automatically (BL-009)

## [1.10.0] - 2026-03-26

### Added
- **Git semantic commits** — plan-mode commands (discuss, backlog, plan) auto-commit `.tyrex/` changes with semantic prefixes (`backlog:`, `discuss:`, `plan:`, `feat:`, `evolve:`, `context:`). Configurable via `tyrex.yml` `git.auto_commit_state` (auto/batch/off) (BL-014)
- **Git auto-tags on milestones** — `tyrex-feature-NNN-done` on review approval, `tyrex-vX.Y.Z` on version bump, `tyrex-phase-N-done` on backlog phase completion. Configurable via `tyrex.yml` `git.auto_tag` (BL-014/BL-015)
- **Shared template `git-semantic-commits.md`** — canonical reference for commit prefixes, tag patterns, and configuration rules
- **Config: `git.auto_commit_state`** and **`git.auto_tag`** in `tyrex.yml`

## [1.9.0] - 2026-03-26

### Added
- **Discuss ↔ backlog integration** — `/tyrex-discuss --backlog BL-NNN` focuses discussion on a specific backlog item with enrichment flow (BL-008)
- **Proactive backlog offer** — discuss detects actionable ideas mid-conversation and offers to save to backlog (non-intrusive, frequency-controlled) (BL-008/BL-012)
- **Backlog as save target** — discuss persistence step now offers backlog alongside context and TYREX.md
- **Backlog detail Discuss action** — `[4] Discuss` in detail view hands off to focused discuss with `--backlog` flag

## [1.8.0] - 2026-03-26

### Added
- **Guardrails inline** — compact 10-rule constitution summary for long-context resilience. Executor commands (do, quick, review) reference it before each task (~120 tokens vs ~2000 for full re-read) (BL-002, ADR-015)
- **Checkpoint reminder system** — periodic directive refresh every N tasks (default: 2, configurable via `tyrex.yml quality.checkpoint_interval`). Checklist verifies compliance before proceeding (BL-001, ADR-015)
- **Next-action suggestions** — every command suggests the next logical step with session context upon completion. Structured choices: execute now, different command, or done. Command flow map in shared template (BL-004, ADR-015)
- **`/tyrex-backlog` command** — structured backlog management with subcommands: add, edit, remove, view, plan, pick. Items in `.tyrex/backlog/items/BL-NNN.yml` with lifecycle (draft→ready→in-progress→done). Epics, phases, ROADMAP.md generation. Ready requires explicit human confirmation (BL-007, ADR-015)
- **Backlog section in `/tyrex-status`** — shows item counts by status, epic summary
- **Backlog awareness in `/tyrex-help`** — backlog command in reference, contextual suggestions
- **Backlog in file structure** — `.tyrex/backlog/` added to CLAUDE.md file structure docs

## [1.7.0] - 2026-03-24

### Added
- **Postinstall auto-upgrade** — `npm install -g tyrex-framework` now automatically syncs commands and templates for already-configured agents (Feature 023)
  - Existing installs (`~/.tyrex/` present): runs `tyrex --upgrade` silently
  - First-time installs: shows setup message recommending `tyrex --all`
  - New `--upgrade` flag for silent, non-interactive re-sync of all detected agents

## [1.6.1] - 2026-03-24

### Changed
- **`/tyrex-plan` task granularity** — removed artificial 15-task limit (Feature 022)
  - Task count now scales with feature complexity (2 tasks for a bug fix, 30+ for complex features)
  - Tasks touching >3 files or spanning multiple concerns MUST be split
  - Tasks with estimate `large` MUST be broken into smaller tasks before plan approval
  - Escalation at 30+ tasks suggests splitting into multiple features (suggestion, not hard limit)
  - Constitution updated: plan size uncapped, only feature spec stays under 50 lines

## [1.6.0] - 2026-03-24

### Changed
- **`/tyrex-quick` rewritten as orchestrator** — delegates to full `/tyrex-new` → `/tyrex-plan` → `/tyrex-do` pipeline instead of reimplementing them in abbreviated form (Feature 021, ADR-014)
  - `--auto` now means auto-approve confirmations, NOT skip stages
  - All docs, SPECs, planning, TDD, and quality checks run in full
  - Clarification questions for genuine ambiguities still asked even with `--auto`
  - Uses `tyrex.yml` defaults for documentation config (not reduced to "minimal")
- **`/tyrex-review` expanded from 5 to 6 review lenses** — new Lens 6: Documentation Consistency

### Added
- **Doc Impact Analysis** — shared algorithm (`doc-impact-analysis.md`) for detecting documentation drift (Feature 021, ADR-014)
  - Scans 3 categories: project docs (README, wiki, OpenAPI), framework docs (TYREX.md), config files (docker-compose, .env.example, Dockerfile)
  - Matches against: ports, routes, env vars, CLI commands, config values, function names
  - `/tyrex-plan` Step 3d: predictive scan — auto-adds doc update task when drift is likely
  - `/tyrex-do` Step 4b: post-implementation scan — auto-creates fix tasks before feature close
  - `/tyrex-review` Lens 6: validation scan — reports inconsistencies as HIGH (config) or MEDIUM (docs) findings

## [1.5.0] - 2026-03-24

### Added
- **Tyrex Recover** — forensic crash recovery replacing `/tyrex-resume` (Feature 020)
  - New command: `/tyrex-recover` with forensic analysis, diagnostic summary, and auto-fix assessment
  - Shared crash detection algorithm: `crash-detection.md` (3 signals: dirty tree, task mismatch, timestamp drift)
  - Pre-flight crash detection added to 11 feature-operating commands
  - User choices for uncommitted changes: keep, stash, discard
  - Auto-fix when changes are coherent, tests pass, and SPEC exists
  - Normal resume as fast-path (no crash = read cursor + continue)
  - Removed `/tyrex-resume` — all references updated across codebase
  - ADR-013, PRD, SRS, architecture diagram (D2)

- **External tracker integration** — bidirectional sync with Jira, Linear, GitHub Issues via MCP (Feature 019)
  - `integrations.tracker` config section in `tyrex.yml`
  - Shared sync algorithm: `external-tracker-sync.md` (forward-only status, lifecycle boundary, comment trail)
  - `external_ref` and `external_task_ref` state fields in feature context resolution
  - Tracker config questions in `tyrex init` interactive flow
  - `/tyrex-new` Step 0e: import from external tracker (fetch issue, choose mode, assign, pre-populate)
  - `/tyrex-plan` Step 6b: create subtasks in tracker for each planned task
  - `/tyrex-do`: auto-sync subtask status on task completion (forward-only)
  - `/tyrex-review` Step 8b: push parent issue to "review" status (max, never "done")
  - `/tyrex-settings`: view/modify tracker integration config
  - `/tyrex-status`: show tracker sync state per feature

## [1.3.0] - 2026-03-23

### Fixed
- **Self-contained commands** — 8 cross-references where commands delegated behavior to other commands by name ("same rules as /tyrex-do") without including the actual rules inline. Agents could silently skip version bumps, test execution, audit resolution, and checkpoint updates.
- `/tyrex-quick` Step 4: inlined planning checklist (security-first analysis, coverage gaps, quality strategy)
- `/tyrex-quick` Step 5: inlined full execution sequence (SPEC, skill, checkpoints, version bump, tests, audit)
- `/tyrex-resume` Step 3: inlined execution procedure (was "continue as if /tyrex-do was called")
- `/tyrex-review` Step 8.5: inlined fix execution sequence (was "same rules as /tyrex-do")
- `/tyrex-init`: inlined resume behavior + context ingestion procedure
- `/tyrex-new`: inlined context ingestion procedure
- `/tyrex-debug`: inlined test runner detection table (was pointing to non-existent table in /tyrex-resume)

### Added
- Canonical shared reference blocks in `templates/commands/shared/`: execution-checklist.md, planning-checklist.md, context-add-inline.md

## [1.2.0] - 2026-03-22

### Changed
- `/tyrex-debug` rewritten — autonomous investigation, 45% smaller (346→189 lines, 10→5 steps)
- Removed mode selection (user-directed vs automatic) — always autonomous
- Removed depth selection (quick/standard/deep) — auto-detects available resources
- Batch command approval replaces per-command approval
- `--auto` flag for zero-pause investigation
- Evidence trail chaining: up to 10 follow-up actions without pausing
- Single report at the end instead of incremental documentation

## [1.1.0] - 2026-03-22

### Added
- **Symlink-first architecture** — all framework-owned files (commands, templates, skills) are symlinks to the global installation. Projects auto-update when `npm install -g tyrex-framework@latest` is run
- All 4 agents now use symlinks for command directories (was only Cursor/Codex)
- `.tyrex/skills/` starts as symlink to `~/.tyrex/skills/`; preserved as local dir if customized
- `~/.tyrex/skills/` created during global install for project symlinking
- `.tyrex/state/features/` directory created during `tyrex init` (multi-demand support)
- `--auto` flag as primary shorthand for `--auto-approve` (deprecated, kept as alias until v2)

### Changed
- `bin/tyrex.js` — all agents set `needsProjectSymlink: true` (was false for Claude Code and OpenCode)
- `tyrex init` — creates symlinks for all detected agent command dirs, not just Cursor/Codex

## [1.0.0] - 2026-03-22

### Added
- **Multi-demand support (ADR-011)** — multiple features open simultaneously on different branches. Branch-based context detection (`feat/NNN-*`) with `--feature NNN` flag override
- Per-feature state files in `.tyrex/state/features/NNN.yml` replace global cursor.yml task tracking
- Feature Context Resolution algorithm: flag → branch → fallback → prompt. Shared reference in `templates/commands/shared/`
- `/tyrex-help` now shows "Two ways to work" — full workflow (new→plan→do→review) vs fast lane (quick)
- `/tyrex-status` shows all open features in a multi-feature table with current branch marker

### Changed
- **Agent-agnostic** — removed hardcoded agent names (Claude Code, OpenCode, Cursor, Codex) from all 10 ADF sections. Now uses generic "CLI-based agents" / "Chat-based agents"
- Removed hardcoded skill lookup paths from `/tyrex-do` and skill sync paths from `/tyrex-review`
- All 22 commands now have consistent structure: frontmatter, title, intro, Agent Mode, Behavior, Important Rules
- 12 commands now include Feature Context Resolution section
- 8 commands: renamed `## Rules` to `## Important Rules` for consistency
- `cursor.yml` slimmed to global-only fields: `agent_mode`, `session_id`, `last_active_feature`

### Fixed
- `/tyrex-handoff` (deprecated) now has proper intro and Agent Mode section

## [0.9.0] - 2026-03-22

### Added
- **Skills Overhaul** — 5 rewrites + 3 new skills with concrete patterns and expanded review criteria
- New skills: `backend-engineer`, `frontend-engineer`, `product-manager`
- All 8 skills: consistent structure (Role, Expertise, Guidelines, Patterns, Review Criteria), stack-agnostic

## [0.8.0] - 2026-03-22

### Added
- **3-Layer Session Recovery** — robust recovery when sessions end abruptly mid-development
- Layer 1: Git-based inconsistency detection in `/tyrex-resume`
- Layer 2: Checkpoint eagerness in `/tyrex-do`
- Layer 3: Intelligent reconciliation with stack-agnostic test runner detection (13 manifest types)

### Fixed
- `/tyrex-do` — test runner detection uses comprehensive 13-manifest table
- `/tyrex-do` — checkpoint recovery fields cleared on failure path

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
