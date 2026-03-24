# SRS: Quick Rewrite & Doc Impact Analysis

## Feature
Feature 021 — Quick Rewrite & Doc Impact Analysis

## Date
2026-03-24

## Project
tyrex-framework

## 1. System Context

This feature modifies 4 existing commands and creates 1 new shared algorithm:

Components involved:
- `templates/commands/unified/tyrex-quick.md` — full rewrite as orchestrator
- `templates/commands/shared/doc-impact-analysis.md` — new shared algorithm
- `templates/commands/unified/tyrex-plan.md` — add doc impact step
- `templates/commands/unified/tyrex-do.md` — add post-implementation doc scan
- `templates/commands/unified/tyrex-review.md` — add Lens 6: Documentation Consistency
- All 4 agent directories (claude, cursor, codex, opencode) — sync after changes

## 2. Functional Requirements

### FR-1: `/tyrex-quick` Rewrite

**FR-1.1:** `/tyrex-quick` MUST execute internally as `new(--auto) → plan(--auto) → do(--auto)` — delegating to the full logic of each command, not reimplementing them in abbreviated form.

**FR-1.2:** `--auto` in each stage means: use `tyrex.yml` defaults for all configuration choices, skip approval checkpoints, auto-accept generated docs. It does NOT mean: skip stages, skip doc generation, skip SPECs, skip planning.

**FR-1.3:** Clarification questions for genuinely ambiguous descriptions MUST still be asked, even in `--auto` mode. Only confirmation/approval prompts are skipped.

**FR-1.4:** The quick command MUST produce the same artifacts as running `new → plan → do` manually: feature spec, branch, docs (per tyrex.yml), SPECs per task, CHANGELOG entries, version bump, commits.

**FR-1.5:** The `--auto` flag is inherited by all internal stages. Without `--auto`, quick runs each stage interactively but in a single session (no need to invoke separate commands).

### FR-2: Doc Impact Analysis — Shared Algorithm

**FR-2.1:** The algorithm MUST scan the following document categories:
- Project docs: README.md, docs/wiki/*, OpenAPI/Swagger specs
- Framework docs: .tyrex/TYREX.md, .tyrex/constitution.md, command files
- Config files: docker-compose*, .env.example, Dockerfile, nginx.conf, and any file referenced in README setup instructions

**FR-2.2:** The scan MUST match against:
- Ports (e.g., `3000`, `8080`)
- URLs and routes (e.g., `/api/v1/users`, `localhost:3000`)
- Environment variables (e.g., `DATABASE_URL`, `PORT`)
- CLI commands and arguments (e.g., `tyrex init`, `npm start`)
- Function/class names that appear in docs
- Configuration values that changed in the implementation

**FR-2.3:** The algorithm receives as input: `files_changed` (list of modified files with their diffs) and outputs: list of `{doc_file, line, old_value, category}` entries that may need update.

**FR-2.4:** When inconsistencies are found, the algorithm MUST create tasks automatically and execute them before closing the feature.

### FR-3: Integration Points

**FR-3.1 — `/tyrex-plan`:** After task decomposition, run doc impact analysis against the planned changes. If docs will be affected, add a "Documentation consistency update" task as the LAST task in the plan.

**FR-3.2 — `/tyrex-do`:** After all implementation tasks complete (before final summary), run doc impact analysis against actual `files_changed`. If inconsistencies found, create and execute fix task(s) automatically.

**FR-3.3 — `/tyrex-review`:** Add Lens 6: Documentation Consistency. Scan all docs against branch diff. Report inconsistencies as findings. If `--do-all` or `--do-critical`, auto-create rc- tasks for doc fixes.

## 3. Non-Functional Requirements

**NFR-1:** Doc scan MUST complete in under 5 seconds for typical projects (< 1000 files).
**NFR-2:** Scan MUST NOT produce false positives on common patterns (e.g., port 80 in HTTP URLs).
**NFR-3:** The shared algorithm file MUST be under 100 lines (concise, like crash-detection.md).

## 4. Acceptance Criteria

1. Running `/tyrex-quick "add health endpoint"` produces: feature spec, branch, PRD/SRS/ADR (per tyrex.yml), task SPECs, CHANGELOG, version bump, commits — identical to manual `new → plan → do`.
2. Running `/tyrex-quick` with an ambiguous prompt still asks clarification questions.
3. Changing a port in code triggers doc impact analysis that flags README and docker-compose.
4. `/tyrex-do` cannot finish with known doc inconsistencies — fix tasks are auto-created.
5. `/tyrex-review` Lens 6 reports doc drift as findings with file:line references.
6. All 4 agent directories are synced after command updates.
