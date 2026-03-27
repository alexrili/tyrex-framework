# TYREX - tyrex-framework

> This is a living document. Update it as the project evolves.
> Every pattern discovered, every hurdle solved, every decision made should be documented here.
> AI agents read this before every interaction — invest in it, it pays back exponentially.

## Project Overview

Tyrex Framework is a human-driven, AI-accelerated pair programming workflow orchestrator distributed as an npm CLI tool. It scaffolds configuration files and markdown-based slash commands into projects, enabling structured AI-assisted development across multiple AI coding agents. The framework is agent-agnostic — it works with any CLI-based or chat-based AI coding agent. It enforces TDD, changelogs, small atomic commits, and documentation-first practices.

## Tech Stack

- **Language:** JavaScript (Node.js, vanilla — no TypeScript)
- **Runtime:** Node.js >= 18.0.0
- **Module System:** CommonJS
- **Package Manager:** npm
- **Dependencies:** Zero runtime dependencies (Node.js built-ins only: `fs`, `path`, `readline`, `os`)
- **Framework:** None — pure Node.js stdlib
- **Database:** None (filesystem-based state via YAML)
- **Deploy:** npm registry (`tyrex-framework` package)
- **CI:** Not yet configured

## Architecture

```
CLI Scaffolding Tool + Prompt Engineering Framework

User runs `tyrex` (global install, once)
  → Installs slash commands to ~/.<agent>/commands/ (or rules/skills)
  → Installs templates to ~/.tyrex/templates/
  → Stores config templates in ~/.tyrex/config-templates/

User runs `tyrex init` (per project)
  → Creates .tyrex/ directory (state, config — project-specific)
  → Symlinks .tyrex/templates/ → ~/.tyrex/templates/
  → Symlinks agent command dirs for Cursor/Codex → global dirs
  → Copies rules files (CLAUDE.md, AGENTS.md) for per-project customization

bin/tyrex.js (~427 lines, single-file CLI)
  ├── main()                  Entry point, interactive flow
  ├── installCommands()       Copy .md commands to agent dirs
  ├── installTyrexStructure() Scaffold .tyrex/ and docs/
  ├── copyTemplate()          {{PLACEHOLDER}} interpolation
  ├── handleUninstall()       Remove agent commands
  └── ask/choose/confirm()    Readline helpers
```

**Supported Agents:**
Tyrex auto-detects installed agents by scanning for their config directories. Commands and skills are synced to each detected agent's directory. New agents can be added by creating their config directory — no framework changes needed.

| Agent Type  | Config Dir     | Commands Dir             | Instructions     |
|-------------|----------------|--------------------------|------------------|
| CLI-based   | `.claude/`     | `.claude/commands/`      | `CLAUDE.md`      |
| CLI-based   | `.opencode/`   | `.opencode/commands/`    | `AGENTS.md`      |
| Chat-based  | `.cursor/`     | `.cursor/rules/tyrex/`   | `CLAUDE.md`      |
| Chat-based  | `.codex/`      | `.codex/skills/tyrex/`   | `CLAUDE.md`      |

## Project Patterns

- **Global-only installation:** `tyrex` installs globally to `~/`, `tyrex init` sets up each project with symlinks to global templates/commands. No duplication across projects. (ADR-005)
- **Symlink-first architecture:** All framework-owned files (commands, templates, skills) are symlinks to `~/.tyrex/`. Projects auto-update on `npm install -g`. Only project-specific files (config, state, features, context) are local. Skills dir starts as symlink; preserved as local dir on first customization.
- **Single-file CLI:** All runtime logic in `bin/tyrex.js`
- **Template-driven output:** All scaffolded files use `{{PLACEHOLDER}}` interpolation via `copyTemplate()`
- **Two template modes:** Core files (tyrex.yml, TYREX.md, etc.) are interpolated at install time; user templates (spec.md, adr.md, etc.) are copied as-is with placeholders intact for AI agents to fill at generation time
- **Agent-agnostic commands:** One set of command definitions in `templates/commands/unified/` is copied to all agent directories
- **Self-hosted:** Tyrex uses itself (`.tyrex/` exists in the repo)
- **Naming:** files=lowercase-hyphenated, JS constants=UPPER_SNAKE_CASE, JS functions=camelCase
- **Documentation layers:** SPEC (mandatory per task), SRS, PRD, ADR, RFC (suggested per feature), D2 diagrams (always offered), context ingestion at project and feature levels. Custom doc types supported via `tyrex.yml docs.custom` array.
- **D2 diagrams:** Diagrams use D2 language (d2lang.com) with 4 template types: architecture, sequence, data-flow, ER. Templates in `templates/diagrams/`. Always offered during `/tyrex-new`. (ADR-004)
- **Custom doc layers:** Users can add custom documentation types via `/tyrex-settings`. Each custom doc type has: name, template path, scope (feature/task), mandatory flag. Templates stored in `.tyrex/templates/`.
- **Skills as personas:** Skills in `.tyrex/skills/` are markdown persona files (Role, Expertise, Guidelines, Patterns, Review Criteria). Auto-suggested during `/tyrex-new`, assigned to tasks during `/tyrex-plan`, loaded as context during `/tyrex-do`
- **Built-in DevSec skill:** `templates/skills/devsec.md` is a built-in security skill template. Auto-suggested when security-sensitive areas are detected during `/tyrex-new` and `/tyrex-plan`. Copied to `.tyrex/skills/devsec.md` on creation.
- **Built-in Copywriter skill:** `templates/skills/copywriter.md` is a UX writing skill template. Used for text review and tone consistency enforcement. Voice: professional and direct (Stripe/Vercel style).
- **Terminology standard:** User-facing text uses "feature" (never "demand"), "choices" (never "quiz"). Professional tone, active voice, actionable errors, no exclamation marks.
- **Skill evolution via review:** `/tyrex-review` Step 5b extracts patterns from review findings and evolves skills. CRITICAL/HIGH findings always become pattern candidates. Findings appearing 2+ times become candidates. Skills have a 150-line limit with summarization. User approval required (auto-approved with `--do-all`). New skills suggested when findings match no existing skill. (ADR-006)
- **Sync after every command update:** When updating commands in `templates/commands/unified/`, ALWAYS re-sync to all 4 agent directories as the LAST step — updates made after sync will be missed
- **Multi-demand support:** Multiple features can be open simultaneously on different branches. Commands resolve feature context via: (1) `--feature NNN` flag, (2) branch name detection (`feat/NNN-*`), (3) fallback to `last_active_feature` in cursor.yml. Per-feature state in `.tyrex/state/features/NNN.yml`. Global cursor.yml retains only agent_mode and session metadata. Lock-free by convention — conflicts resolved by git merge. (ADR-011)
- **Feature Context Resolution:** Shared algorithm defined in `templates/commands/shared/feature-context-resolution.md`. Every command that operates on a feature MUST resolve context before proceeding. Resolution order: flag → branch → fallback → prompt user.
- **Agent mode (plan/build):** Every command declares its mode (`plan` or `build`) in an `## Agent Mode` section and sets `agent_mode` in `cursor.yml` as its first action. Plan mode = no source code writes. Build mode = full implementation with TDD. Enforced via triple layer: cursor.yml state + constitution rules + per-command instructions.
- **Adaptive decision format:** ALL user decisions across ALL commands use structured choices adapted to the agent's interface. CLI-based agents: numbered choices. Chat-based agents: numbered list or direct question. Never open-ended questions when structured choices are possible. (ADR-003)
- **One question at a time:** Commands present ONE structured choice per message, then STOP and wait for the user's response. Never batch multiple choice blocks. Exception: configuration review blocks (docs bundle + git config) may be presented together as a single confirm action. Enforced in constitution.md + per-command ADF section. (ADR-008)
- **Security-first planning:** `/tyrex-plan` performs a security assessment BEFORE proposing tasks. Security-sensitive tasks get `security` attribute, quality: `required`, and devsec skill auto-assigned. Every feature with security implications gets a dedicated security hardening task.
- **Granularity-first planning:** No artificial task count limit. Task count scales with feature complexity. Tasks touching >3 files or spanning multiple concerns MUST be split. Large estimate tasks MUST be broken down. Escalation at 30+ tasks suggests multiple features (suggestion, not limit).
- **6-lens senior review:** `/tyrex-review` evaluates through 6 lenses: Pattern Compliance, Code Quality & DRY, Business & Technical Compliance, Security First, Test Coverage, Documentation Consistency. Uses senior engineer persona for the project's tech stack.
- **Review → Fix loop:** `/tyrex-review` with `--do-all` or `--do-critical` flags auto-creates requested-change tasks (prefixed `rc-`) within the same feature and enters plan/do loop. Includes mini re-review after fixes.
- **Command flags:** Commands support flags: `/tyrex-do --auto-approve`, `/tyrex-review --do-all|--do-critical|full`, `/tyrex-quick --auto-approve`
- **TYREX.md auto-update:** When macro docs (ADR, PRD, SRS) are generated or updated, commands auto-update TYREX.md with summaries in appropriate sections (Architecture Decisions, Business Rules, Requirements Summary)
- **Quick = orchestrator, not compressed pipeline:** `/tyrex-quick` delegates to the full logic of `/tyrex-new`, `/tyrex-plan`, `/tyrex-do`. `--auto` means auto-approve confirmations, NOT skip stages. All docs, SPECs, planning, TDD, and quality checks run in full. Clarification questions for genuine ambiguities still asked. Uses `tyrex.yml` defaults for doc config. (ADR-014)
- **Doc Impact Analysis:** Shared algorithm in `templates/commands/shared/doc-impact-analysis.md` detects documentation drift by scanning README, wiki, OpenAPI, diagrams, config files against code changes. Integrated into `/tyrex-plan` (predictive — adds doc update task), `/tyrex-do` (post-implementation — auto-creates fix tasks), `/tyrex-review` (Lens 6 — reports as findings). Three scan categories: project docs, framework docs, config files. Matches: ports, routes, env vars, CLI commands, config values. (ADR-014)
- **Handoff deprecated:** `/tyrex-handoff` replaced by `/tyrex-quick --auto-approve`
- **Security review command:** `/tyrex-security-review` provides comprehensive security scanning (secrets, logical vulns, OWASP Top 10, unprotected endpoints). Session reports in `.tyrex/security/SECURITY-NNN.md`, consolidated audit in `.tyrex/security/audit.md` with `[ ]`/`[x]` tracking. Integrated into `/tyrex-new` (pending findings check), `/tyrex-plan` (cross-reference audit), `/tyrex-do` (mark resolved), `/tyrex-status` (summary), `/tyrex-init` (initial scan + migration). Plan mode, read-only — never fixes code. (ADR-009)
- **Security registry:** `.tyrex/security/` stores scan reports and consolidated audit. Replaces old `.tyrex/map/security-audit.md`. One session file per scan (SECURITY-NNN.md). Findings have severity + status (pending/resolved). Consumed by 5 commands.
- **Review scopes:** `/tyrex-review` supports `pr` (default, branch diff only) and `full` (codebase-wide re-scan) scopes
- **OpenCode plugin for mechanical enforcement:** `.opencode/plugin.ts` uses OpenCode's native hooks (`command.execute.before`, `permission.ask`) to mechanically enforce plan/build mode switching. `opencode.json` defines two agents (`plan` with `edit: "deny"`, `build` with `edit: "allow"`). The plugin reads/writes `cursor.yml` and injects `AgentPart` to switch agents on command execution. This is a triple-layer enforcement: cursor.yml state + constitution rules + native permission system.
- **Research command:** `/tyrex-research` enables structured technical research (codebase + web) with or without an active feature. Results are saved on demand — feature-scoped to `.tyrex/features/NNN-research-TOPIC.md`, standalone to `.tyrex/research/TOPIC.md`. Plan mode, read-only.
- **Debug command:** `/tyrex-debug` provides structured, AI-assisted debugging. Two modes: user-directed (describe symptom) or automatic analysis (broad scan). Manages infrastructure (docker, services) with user permission. Flexible diagnostic depth (quick/standard/deep). Generates session-based bug reports in `.tyrex/bugs/DEBUG-NNN.md` with severity classification (critical/high/medium/low). Integrates with `/tyrex-new` (shows open bugs before new features) and `/tyrex-status` (bug summary). Ships with built-in debugger skill template. Plan mode, diagnose-only — never fixes code.
- **Built-in Debugger skill:** `templates/skills/debugger.md` is a debug engineer skill template. Auto-suggested when `/tyrex-debug` is invoked. Systematic diagnosis, log analysis, container debugging, hypothesis testing.
- **Bug registry:** `.tyrex/bugs/` stores debug session reports. One file per session (DEBUG-NNN.md) with multiple bug findings. Bugs have severity + status (open/resolved). Consumed by `/tyrex-new` (fix bugs first?) and `/tyrex-status` (summary).
- **Automatic versioning:** `/tyrex-do` enforces version bump when CHANGELOG/ADR changes. Detects package manager (package.json, composer.json, pyproject.toml, etc.), suggests semver bump based on change type (feat=minor, fix=patch, BREAKING=major), propagates version to all files, includes in same commit. Human confirms or overrides. `/tyrex-review` flags missing version bumps.
- **Test review command:** `/tyrex-test-review` scans for test coverage gaps with argued suggestions. Three-tier prioritization (critical/important/nice-to-have). Session reports in `.tyrex/tests/TEST-REVIEW-NNN.md`, consolidated view in `.tyrex/tests/coverage-gaps.md`. Integrated into `/tyrex-new` (show gaps), `/tyrex-plan` (test-aware decomposition), `/tyrex-do` (run tests before commit), `/tyrex-review` (Lens 5: Test Coverage), `/tyrex-init` (detect test infrastructure). Plan mode, read-only — never writes tests. (ADR-010)
- **Test registry:** `.tyrex/tests/` stores test review reports and consolidated coverage gaps. One session file per scan (TEST-REVIEW-NNN.md). Gaps have tier + status (pending/resolved). Consumed by 5 commands.
- **Tests as first-class citizen:** Core principle: the framework never lets an implementation pass without at least asking about tests. `/tyrex-do` runs test suite before every commit. `/tyrex-review` has Lens 5 (Test Coverage) checking for corresponding test files. `/tyrex-plan` includes test-awareness rules in task decomposition.
- **Postinstall auto-upgrade:** `package.json` has a `postinstall` script (`bin/postinstall.js`) that detects existing installations (`~/.tyrex/` exists) and runs `tyrex --upgrade` to silently re-sync commands/templates for all configured agents. First-time installs show a setup message instead. The `--upgrade` flag is non-interactive (no readline, no banner, no prompts).
- **No scripts in package.json:** No `start`, `test`, `lint`, or `build` scripts defined yet (only `postinstall` and `postpublish`)
- **External tracker integration:** Bidirectional sync with Jira/Linear/GitHub Issues via MCP. MCP-only (zero dependencies — agent delegates all tracker calls). Shared sync algorithm in `templates/commands/shared/external-tracker-sync.md`. Config in `tyrex.yml` `integrations.tracker` (provider, project, user). Two modes: read-only (context only) and build (assign + sync). Forward-only status push — max is `review`, never `done` (lifecycle boundary: dev done ≠ delivery done). Comment trail on every update. Woven into 6 existing commands + `tyrex init` — no new commands. (ADR-012)
- **Forensic crash recovery:** `/tyrex-recover` replaces `/tyrex-resume`. Evidence-based state reconstruction from git diff + `.tyrex/` state instead of trusting cursor.yml alone. Three crash signals: dirty_tree_stale_cursor, task_state_mismatch, timestamp_drift. Two modes: crash recovery (forensics → diagnostic → user choices → auto-fix) and normal resume (fast-path when no crash detected). Shared crash detection in `templates/commands/shared/crash-detection.md`. (ADR-013)
- **Pre-flight crash detection:** All 11 feature-operating commands include a lightweight crash detection pre-flight check (< 2s) before `## Behavior`. Detects inconsistent state proactively. Skips silently when clean. Commands with `--auto` flags log warning and continue. Standalone commands (init, help, debug, research, security-review, test-review, readme, openapi, wiki) are excluded.
- **Session recovery hierarchy:** Three layers: (1) per-feature state file is primary recovery point, (2) cursor.yml is secondary (global pointer), (3) task state files are tertiary (individual status). If all state is lost, git log + branch name + feature spec can reconstruct enough to resume.
- **Backlog system:** `.tyrex/backlog/` stores structured backlog items (items/BL-NNN.yml), epics (epics/EP-NNN.yml), and ROADMAP.md. Items have lifecycle: draft→ready→in-progress→done|discarded. Ready requires explicit human confirmation. Items become features when picked for execution. Single command `/tyrex-backlog` with subcomandos: add, edit, remove, view, plan, pick.
- **Discuss ↔ Backlog integration:** `/tyrex-discuss` creates backlog items from conclusions, enriches existing items (`--backlog BL-NNN`), reorganizes roadmap. Bidirectional — backlog can initiate focused discuss.
- **5 core commands:** User-facing flow simplified to discuss, backlog, quick, status, recover. Other commands (new, plan, do, review) are internal — activated by the framework automatically.
- **Git as audit trail:** Discuss, backlog, and plan commands generate semantic commits (.tyrex/ only): `backlog: add BL-007`, `discuss: enrich BL-005`, `plan: roadmap v2`. Complete decision history via git log.
- **Quick pipeline with visual roadmap:** `/tyrex-quick` shows visual roadmap (tasks + BL-items) before executing. Presents consolidated final report. Without `--auto`: commits but waits for accept/reject. Rejection triggers safe revert via git.
- **Safe revert via git:** Safe-points (branch, tags, checkpoints) enable full rollback of rejected executions. No data lost — commits preserved in reflog or branch.
- **Prompt structuring:** Framework never loses an idea — always offers to save actionable ideas to backlog during discuss.
- **Discuss ↔ backlog integration:** `/tyrex-discuss --backlog BL-NNN` focuses discussion on a specific item with enrichment flow (update description, acceptance criteria). Proactive mid-conversation offer detects actionable ideas and offers to save — non-intrusive, frequency-controlled (max once every 3-4 exchanges). Backlog detail view [4] Discuss hands off to focused discuss. Persistence step offers backlog as save target alongside context and TYREX.md.
- **Fresh context per task (context rot fix):** `/tyrex-do` executes each task in a sub-agent with a fresh context window (200K tokens). The orchestrator stays lightweight (<40% context: tyrex.yml, cursor, task list metadata, TYREX.md summary). Sub-agents receive targeted context only: task SPEC + relevant_files + constitution + skill + feature summary. Eliminates context rot — quality stays consistent from task 1 to task N. Config in `tyrex.yml` `context_engineering` section. Execution modes: `fresh` (default, sub-agent per task) and `inline` (legacy, same session). Auto-fallback to inline if runtime doesn't support sub-agents. Inspired by GSD framework.
- **Relevant files field:** `/tyrex-plan` generates a `relevant_files` list per task — files the sub-agent needs to READ for context (interfaces, existing code, test patterns). Distinct from `Files` (write targets). Max 10 files per `size_limits.max_context_files`. Sub-agent reads additional files on demand if needed.
- **Wave execution with dependency graph:** `/tyrex-plan` Step 3a calculates wave assignments from dependency graph. Wave 1 = no dependencies, Wave N = max(dependency waves) + 1. File conflict check within waves. `/tyrex-do` executes waves sequentially, tasks within each wave in parallel (fresh sub-agents). Wave N+1 starts only after Wave N succeeds. Failure stops wave propagation. `/tyrex-quick` visual roadmap shows wave groupings. Fallback to sequential if waves absent (pre-v1.14 tasks). Inspired by GSD framework.
- **Context monitor:** Estimates context window usage during long sessions using heuristics (task progress ratio, files read, conversation turns). Configurable thresholds in `tyrex.yml` `context_engineering.monitoring` (info: 50%, warning: 70%, critical: 85%). Warnings injected after each task/wave completion without interrupting flow. Actions suggested per threshold: continue, switch to sub-agents, start fresh session. Integrated into `/tyrex-do` (per-task/wave check) and `/tyrex-status` (context health section). Works in any runtime — no agent-specific hooks required. Inspired by GSD context-monitor hook.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| (none)   | No env vars used currently | — |

## Known Hurdles

- No test framework set up yet — TDD is mandated by constitution but no testing infrastructure exists
- No CI/CD pipeline — "every commit passes CI" rule cannot be enforced yet
- No linting configured — code style is not automated
- No package-lock.json — dependency resolution not locked (irrelevant while zero-dep)
- `.env` not in `.gitignore` — preventive risk if env files are added later

## Architecture Decisions

| Date       | Decision                          | Rationale |
|------------|-----------------------------------|-----------|
| 2026-03-07 | Zero runtime dependencies         | Minimize supply-chain risk, keep CLI lightweight |
| 2026-03-07 | Single-file CLI                   | Simplicity — entire tool is one 417-line file |
| 2026-03-07 | Markdown commands (not executable) | Commands are AI prompts, not code — markdown is the natural format |
| 2026-03-07 | Agent-agnostic unified commands   | One source of truth, copied to 4 agent directories |
| 2026-03-07 | YAML for state                    | Human-readable, AI-parseable, no dependencies needed |
| 2026-03-07 | CommonJS (not ESM)                | Broader Node.js compatibility, simpler for a CLI tool |
| 2026-03-07 | SPEC mandatory, SRS/PRD suggested  | Technical rationale must always be documented; product/requirements docs are contextual |
| 2026-03-07 | Context stored in filesystem       | `.tyrex/context/` (project) + `.tyrex/features/NNN-context.md` (demand) — consistent with state-via-filesystem pattern |
| 2026-03-07 | Command count: 17 (was 16)        | Added `/tyrex-context` for context ingestion — keeps all workflow in slash commands |
| 2026-03-07 | Skills as markdown personas (ADR-002) | Flat files in `.tyrex/skills/`, not subdirectories. Persona format over tech-stack format for natural agent consumption |
| 2026-03-08 | Agent mode as first-class concept     | `agent_mode` field in cursor.yml (`plan`/`build`) enforced via triple layer (state + constitution + command instructions). Prevents agents from writing code during review/plan/discuss commands |
| 2026-03-08 | Security audit with tracking          | `security-audit.md` uses `Status` column (`[ ]`/`[x]`) for finding resolution tracking. Consumed by `/tyrex-status` and `/tyrex-review` |
| 2026-03-08 | Review scopes: PR vs Full             | `/tyrex-review` defaults to PR scope (branch diff only); `/tyrex-review full` re-scans entire codebase. PR scope is faster and focused; Full scope updates the audit file |
| 2026-03-08 | OpenCode plugin for mode enforcement   | Native plugin using OpenCode SDK hooks provides mechanical guardrails — plan agent literally cannot write files. Triple-layer: cursor.yml + constitution + native permissions |
| 2026-03-10 | Interactive quiz as UX standard          | Superseded by ADR-003 (Adaptive Decision Format) |
| 2026-03-12 | Adaptive decision format (ADR-003)         | Structured choices adapted to agent interface (CLI: numbered quiz, Chat: list/question). Replaces mandatory quiz format that didn't work in Cursor |
| 2026-03-10 | Security-first planning                  | `/tyrex-plan` performs security assessment before task decomposition. Security-sensitive tasks auto-get devsec skill and quality: required |
| 2026-03-10 | 4-lens senior code review                | `/tyrex-review` evaluates Pattern Compliance, Code Quality, Business Compliance, and Security. Senior engineer persona per tech stack |
| 2026-03-10 | Review → Fix loop                        | `/tyrex-review --do-all/--do-critical` auto-creates `rc-` prefixed tasks within same feature and enters plan/do loop |
| 2026-03-10 | Command flags (--auto-approve, etc.)     | Commands support flags for automation: `--auto` (skip all checkpoints), `--do-all`/`--do-critical` (auto-fix review findings) |
| 2026-03-10 | TYREX.md as living knowledge index       | Auto-updated when macro docs (ADR, PRD, SRS) are generated. Sections: Architecture Decisions, Business Rules, Requirements Summary, Patterns |
| 2026-03-10 | Quick = unified new+plan+do              | `/tyrex-quick` redesigned as fast-track pipeline. Same quality, fewer steps. `--auto` for full autopilot |
| 2026-03-10 | Handoff deprecated                       | Replaced by `/tyrex-quick --auto-approve`. One command for same behavior, cleaner mental model |
| 2026-03-10 | Built-in DevSec skill template           | `templates/skills/devsec.md` ships with framework. Auto-suggested when security areas detected. OWASP/SANS coverage |
| 2026-03-12 | D2 diagrams replace Mermaid (ADR-004)     | D2 language for all diagrams. 4 template types (architecture, sequence, data-flow, ER). Always offered during `/tyrex-new` |
| 2026-03-12 | Custom documentation layers (ADR-004)    | `tyrex.yml docs.custom` array for user-defined doc types. Managed via `/tyrex-settings`. Templates in `.tyrex/templates/` |
| 2026-03-12 | Production-ready doc templates (ADR-004) | All built-in templates (SPEC, SRS, PRD, ADR, RFC) rewritten with complete sections, guidance, and examples |
| 2026-03-12 | Global-only installation (ADR-005)       | `tyrex` installs globally, `tyrex init` sets up projects with symlinks. Eliminates duplication, enables auto-updates |
| 2026-03-12 | UX writing standard: "feature" not "demand" | Standardized on "feature" everywhere. "Demand" was jargon. 68 replacements across 12 files |
| 2026-03-12 | UX writing standard: "choices" not "quiz" | "Quiz" implies testing the user. Replaced with "choices"/"structured choices". 38 replacements |
| 2026-03-12 | Built-in Copywriter skill template       | `templates/skills/copywriter.md` for UX writing review. Professional and direct tone (Stripe/Vercel style) |
| 2026-03-13 | Skill evolution via review (ADR-006)     | `/tyrex-review` Step 5b extracts patterns from findings, evolves skills, suggests new skills. Closes the learning loop between review and skills systems |
| 2026-03-13 | /tyrex-research command                  | AI-powered research (codebase + web). Feature-scoped or standalone. Saves on demand. Command count: 19 (was 18) |
| 2026-03-19 | Interactive debug command (ADR-007)       | `/tyrex-debug` for structured diagnosis with infrastructure management, persistent bug registry in `.tyrex/bugs/`, and `/tyrex-new` integration. Command count: 20 (was 19) |
| 2026-03-19 | One question at a time (ADR-008)           | All commands must present ONE structured choice per message, then wait for response. Enforced in constitution + per-command Adaptive Decision Format. Exceptions: config review blocks and non-interactive output |
| 2026-03-20 | Dedicated security review command (ADR-009)  | `/tyrex-security-review` for comprehensive scans. Reports in `.tyrex/security/`. Integrated into 5 commands. Command count: 21 (was 20) |
| 2026-03-20 | Automatic versioning as framework directive | Version bump mandatory when CHANGELOG/ADR changes. Detect manifest, suggest bump, propagate, include in commit. Human decides final version. |
| 2026-03-20 | Automated tests as first-class citizen (ADR-010) | `/tyrex-test-review` for gap scanning + test awareness in 5 commands. Core principle: never pass without asking about tests. Command count: 22 (was 21) |
| 2026-03-22 | Multi-demand branch-based context (ADR-011) | Branch detection (`feat/NNN-*`) + `--feature NNN` flag override. Per-feature state files. Concurrent features on different branches. Lock-free by convention. |
| 2026-03-23 | External tracker integration via MCP (ADR-012) | Bidirectional sync with Jira/Linear/GitHub Issues via MCP-only. No new commands — woven into 6 existing commands. Forward-only status (max push: `review`, never `done`). Provider-agnostic. Zero dependencies. |
| 2026-03-24 | Forensic crash recovery replacing resume (ADR-013) | `/tyrex-recover` replaces `/tyrex-resume`. Evidence-based state reconstruction from git diff + `.tyrex/` state. Pre-flight crash detection in all commands. Auto-fix with user confirmation. Three crash signals: dirty tree + stale cursor, task state mismatch, timestamp drift. |
| 2026-03-24 | Quick as orchestrator + Doc Impact Analysis (ADR-014) | `/tyrex-quick` rewritten as orchestrator delegating to full `new→plan→do` (auto-approve only, no stages skipped). Doc Impact Analysis shared algorithm scans README, wiki, OpenAPI, diagrams, config files for drift. Integrated into plan (predictive), do (post-implementation), review (Lens 6). Auto-creates fix tasks on inconsistency. |
| 2026-03-26 | Backlog system with structured items and roadmap | `.tyrex/backlog/` with items (BL-NNN.yml), epics (EP-NNN.yml), ROADMAP.md. Lifecycle: draft→ready→in-progress→done. Ready = human confirmation only. Single `/tyrex-backlog` command with subcommands. Bidirectional discuss↔backlog integration. |
| 2026-03-26 | 5 core commands UX simplification | User flow: discuss, backlog, quick, status, recover. Internal commands (new, plan, do, review) activated by framework. Reduces cognitive load. |
| 2026-03-26 | Git as project audit trail | Semantic commits for decisions/discussions/planning (.tyrex/ only). Git tags for milestones. Git log as complementary recovery source. Tyrex + Git + LLM = quality development triad. |
| 2026-03-26 | Quick visual roadmap + accept/reject | Quick shows visual roadmap before executing. Final consolidated report. Accept/reject flow with safe git revert on rejection. |
| 2026-03-26 | Command resilience + backlog system (ADR-015) | Guardrails inline (~120 tokens), checkpoint reminders every N tasks, next-action suggestions on all commands. `/tyrex-backlog` command with CRUD, epics, roadmap. Command count: 23 (was 22). |
| 2026-03-26 | Discuss ↔ backlog bidirectional integration | `/tyrex-discuss --backlog BL-NNN` focuses on specific item with enrichment flow. Proactive mid-conversation offer detects actionable ideas (non-intrusive, frequency-controlled). Backlog detail view [4] Discuss hands off to focused discuss. BL-012 absorbed into BL-008. |
| 2026-03-27 | Fresh context per task — context rot fix (ADR-016) | `/tyrex-do` redesigned: each task runs in sub-agent with fresh 200K context. Orchestrator stays <40% context (metadata only). Sub-agent receives targeted context: SPEC + relevant_files + constitution + skill. Two modes: fresh (default) and inline (fallback). Auto-detect runtime capability. Config in `tyrex.yml` `context_engineering`. Inspired by GSD framework. |
| 2026-03-27 | Wave execution with dependency graph (ADR-017) | `/tyrex-plan` Step 3a calculates wave assignments from dependency graph (Wave 1 = no deps, Wave N = max dep waves + 1). File conflict check, circular dependency detection. `/tyrex-do` executes waves sequentially, parallel within each. Wave failure stops propagation. `/tyrex-quick` visual roadmap shows waves. Builds on fresh context (ADR-016). Inspired by GSD. |
| 2026-03-27 | Context monitor (ADR-018) | Heuristic-based context window monitoring. Thresholds: info 50%, warning 70%, critical 85%. Warnings after task/wave completion. Integrated into `/tyrex-do` and `/tyrex-status`. Shared algorithm in `templates/commands/shared/context-monitor.md`. No runtime hooks — pure prompt engineering. Inspired by GSD context-monitor. |

## CI/CD

Not yet configured. Recommended pipeline:
1. `npm test` (once test framework is set up)
2. `npm run lint` (once ESLint is configured)
3. Security scan (no vulnerable deps to scan currently)
4. npm publish (manual for now)

## Post-Implementation Checklist

- [ ] Tests passing
- [ ] Lint clean
- [ ] Security scan clean
- [ ] CHANGELOG updated
- [ ] Documentation updated (if applicable)
- [ ] TYREX.md updated (if new patterns emerged)
