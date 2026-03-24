---
description: "Fast-track workflow — unified new/plan/do from a single prompt"
---

# /tyrex-quick - Fast-Track Workflow

You are the Tyrex Framework orchestrator. The user wants to go from prompt to implementation in one command. This is a **unified new → plan → do** pipeline that collapses the ceremony while preserving all quality guardrails.

## Agent Mode

This command transitions between modes as it progresses:
- **Capture & Planning (Steps 1-4):** set `agent_mode: "plan"` — no source code writing
- **Execution (Step 5):** set `agent_mode: "build"` — source code writing allowed
Update `agent_mode` in `cursor.yml` at each transition.

## Parameters

- **`/tyrex-quick`** (default) — Interactive fast-track with choice checkpoints for key decisions
- **`/tyrex-quick --auto`** — Full autopilot: captures the prompt, makes smart defaults for all decisions, and executes everything. Only stops on failures after 3 retries.
- `--auto-approve` is accepted as an alias for `--auto` (deprecated, will be removed in v2)

## Feature Context Resolution

**This command creates a new feature context.** After creation, set `last_active_feature` in cursor.yml and create the per-feature state file `.tyrex/state/features/NNN.yml`. Other commands will resolve this feature via branch detection or the `--feature` flag.

## Adaptive Decision Format

**ALL decisions in this command MUST use structured choices** adapted to the agent's interface. CLI-based agents: numbered choices where the user types a number. Chat-based agents: numbered list or direct question where the user responds naturally. Never ask open-ended questions when structured choices are possible. This is the standard for every interaction point.

**One question at a time.** Present a single structured choice, then STOP and wait for the user's response before proceeding to the next question. Never combine multiple choice blocks in one message. Each step that contains a decision point ends at that choice — the next step begins only after the user responds. Exception: configuration review blocks may be presented together as a single "review and confirm" action.

## Pre-flight: Crash Detection

Before proceeding, check for crash signals per `templates/commands/shared/crash-detection.md`. Quick exit if: no `.tyrex/`, not on `feat/*` branch, or clean working tree. If crash signals detected: present "Inconsistent state detected. Run /tyrex-recover or continue anyway?" If `--auto-approve`: log warning and continue.

## Behavior

### Step 1: Capture the Feature

Ask: "What do you need done?"

Listen to the user's description.

**Clarification phase:** If the description is ambiguous or missing critical details, ask clarification questions **using structured choices** where possible. Examples:
```
What's the scope of this change?
  [ ] Single file fix
  [ ] Multiple files, same module
  [ ] Cross-module change
  [ ] New module/feature
```

```
Is there a specific requirement driving this?
  [ ] Bug report / user complaint
  [ ] New feature request
  [ ] Tech debt / refactoring
  [ ] Security concern
  [ ] Performance issue
```

Maximum 3 question rounds.

**If `--auto`:** Ask no clarification questions unless the prompt is critically ambiguous (e.g., no clear action or target). Use the prompt as-is and make reasonable inferences.

**Present Step 1 choices and wait for user response before continuing to Step 2.**

### Step 2: Quick Configuration (via structured choices)

**If `--auto`:** Skip this step. Use smart defaults:
- Branch: create `feat/quick-[slug]` from prompt
- Docs: CHANGELOG + SPEC only (mandatory minimums)
- Commits: auto mode
- Skills: auto-detect and assign

**Otherwise, present quick config choices:**
```
Quick setup:

Branch:
  [ ] Create new branch: feat/quick-[slug] (Recommended)
  [ ] Work on current branch
  [ ] Custom branch name

Documentation:
  [ ] Minimal — CHANGELOG + SPEC only (Recommended)
  [ ] Standard — add SRS
  [ ] Full — add SRS + PRD + ADR

Commit mode:
  [ ] Auto-commit (Recommended for quick tasks)
  [ ] Approve each commit
```

### Step 3: Skill Analysis & Security Check

1. **Auto-detect relevant skills** from the feature description by scanning `.tyrex/skills/`
2. **Security-first check:** If the feature touches security-sensitive areas (auth, data, APIs, user input), check for `devsec.md` skill:
   - If exists: auto-assign to relevant tasks
   - If doesn't exist: present choices:
     ```
     This task touches security-sensitive code but no DevSec skill is installed.
       [ ] Create DevSec skill now (Recommended)
       [ ] Continue without DevSec skill
     ```
   - **If `--auto`:** auto-create the DevSec skill from built-in template if it doesn't exist
3. Generate feature spec (compact format, max 30 lines)
4. Create branch (based on Step 2 config)

**Present each choice in Steps 2-3 individually. Wait for user response before continuing.**

### Step 4: Quick Planning

1. **Planning checklist** (same rigor as `/tyrex-plan`, fewer steps):
   - **Security-first analysis** — identify security-sensitive areas. If detected and no `devsec.md` exists, create it. Cross-reference `.tyrex/security/audit.md` pending findings with feature scope.
   - **Cross-reference coverage gaps** — if `.tyrex/tests/coverage-gaps.md` exists, note overlaps with proposed tasks.
   - Each task completable in ONE commit. Same-file tasks CANNOT be parallel. Security tasks execute first.
   - Quality strategy: `required` for API/workers/data/security. `recommended` for frontend. `optional` for infra/docs.
   - Security tasks are mandatory and never skippable.
2. Analyze the feature and propose tasks
3. Each task gets:
   - Dependency ordering
   - Parallelism markers
   - Skill assignment
   - Quality strategy (security areas = `required`, others follow project defaults)
   - SPEC draft (compact — objective + approach + files + testing)
4. **Security-first in planning:** For every task, evaluate if it has security implications:
   - Data handling → input validation task
   - API endpoints → auth/authz verification task
   - User input → sanitization task
   - If security concerns detected, ensure they're addressed in the task or add a security sub-task

5. Display compact execution plan:
   ```
   TYREX Quick Plan: [feature summary]
════════════════════════════════════════
   
   [1] Setup data model          (sequential, required)
   [2] Implement business logic   (sequential, required)
   [3] Add API endpoint          (sequential, required, skill: backend)
   [4] Security hardening        (sequential, required, skill: devsec)
   
   Estimated: [N] tasks, [N] commits
   ```

6. **If `--auto`:** skip approval, start executing immediately.
   **Otherwise, present choices:**
   ```
   Approve this plan?
     [ ] Approve and start
     [ ] Add/modify tasks
     [ ] Cancel — switch to full /tyrex-new workflow
   ```

### Step 5: Execute

For EACH task, execute this sequence:

1. **Load SPEC** — read the task's SPEC file from `docs/specs/`. Use Technical Approach to guide implementation.
2. **Load skill** — if the task has a `skill` attribute, read `.tyrex/skills/<name>.md`. Apply its Role, Guidelines, and Patterns during implementation. Use its Review Criteria as a self-check before marking complete.
3. **Checkpoint: task start** — update the per-feature state file: set `current_task_in_progress`, `in_progress_since`, `in_progress_files_touched: []`.
4. **Implement following quality strategy:**
   - `required`: TDD — write tests first, implement, tests MUST pass
   - `recommended`: write tests alongside code, warn if skipped
   - `optional`: default to writing tests in `--auto` mode
5. **Checkpoint: files touched** — after each file write, append path to `in_progress_files_touched`.
6. **On success — pre-commit sequence:**
   a. Update task state to `completed` with `files_changed` and output
   b. **Resolve audit findings** — if task has `security` attribute: read `.tyrex/security/audit.md`, match `files_changed` to pending findings, flip `[ ]` to `[x]` with date
   c. Prepare commit message (conventional format)
   d. **Update CHANGELOG** — mandatory for every task
   e. **Version bump check** — if CHANGELOG or ADR changed: detect package manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, etc.), read current version, suggest semver bump (feat→minor, fix→patch, BREAKING→major), auto-accept in `--auto` mode, validate semver format, propagate version to all referencing files, stage alongside task changes
   f. **Run tests before commit** — detect test runner stack-agnostically (scan for package.json scripts.test, pyproject.toml pytest, Makefile test target, Cargo.toml, go.mod, mix.exs, build.gradle, pom.xml, Gemfile, composer.json, deno.json, bun.lockb). If tests fail + `--auto`: retry once, then mark `failed`. If no test runner: skip with note.
   g. **Commit** — auto in `--auto` mode, present diff+message for approval otherwise
   h. **Checkpoint: task complete** — clear recovery fields from per-feature state. Update `last_task_completed`, `tasks_summary`.
   i. **Auto-update TYREX.md** — if ADR/PRD/SRS generated, add summary to appropriate section
7. **On failure:** clear checkpoint fields, mark task `failed`. In `--auto`: retry up to 3 times. Interactive: present fix/skip/stop choices.

**If `--auto`:** all checkpoints and approvals are automatic.

After all tasks complete:
- Update cursor.yml
- Present completion summary:
  ```
  TYREX Quick Complete
   ════════════════════════════════════════
  
  Tasks: [N]/[N] completed
  Commits: [N]
  Files changed: [N]
  Tests: [N] passing
  
  Run /tyrex-review to review.
  ```

### Step 6: Auto-update TYREX.md

If any macro documentation was generated or updated (ADR, PRD, SRS), automatically update TYREX.md with:
- New patterns → `## Project Patterns`
- New decisions → `## Architecture Decisions`
- Business rules → `## Business Rules`
- Requirements → `## Requirements Summary`

## Escalation Rule

At ANY point during Steps 1-4, if the feature appears too complex for quick-track:
- More than 8 tasks would be needed
- Multiple modules/services affected
- Significant architecture decisions required
- Cross-team coordination needed

Present choices:
```
This task exceeds quick-track scope.
  [ ] Continue with quick-track anyway
  [ ] Switch to full workflow (/tyrex-new → /tyrex-plan → /tyrex-do)
```

## Important Rules
- All quality guardrails apply.
- TDD is still mandatory (per quality strategy)
- CHANGELOG is still mandatory
- SPEC is still mandatory (per task, even if compact)
- Security checks are still mandatory
- ALWAYS create a separate branch (never work on main/master)
- ALWAYS use structured choices for ALL decisions — adapt format to agent interface
- `--auto` is full autopilot: prompt → implementation with zero human interaction (except on failures)
- If the task grows beyond quick-track scope, suggest escalating to the full workflow
- This replaces the old "quick = no docs" approach. Quick now means "same quality, fewer steps"
