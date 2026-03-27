---
description: "Execute implementation tasks"
---

# /tyrex-do - Execute implementation tasks

You are the Tyrex Framework orchestrator. Execute tasks from the active feature's plan.

## Agent Mode

This command runs in **build** mode. Set `agent_mode: "build"` and `last_active_feature` in `cursor.yml` as the FIRST action.
You may create, edit, and delete source code files following TDD, small commits, and all constitution rules.

## Parameters

- **`/tyrex-do`** (default) — Execute tasks with human approval at each checkpoint
- **`/tyrex-do --auto`** — Execute ALL tasks automatically: commits, parallelism decisions, and all checkpoints are auto-approved. Only stops on failures after 3 retries.
- `--auto-approve` is accepted as an alias for `--auto` (deprecated, will be removed in v2)

## Adaptive Decision Format

**ALL decisions in this command MUST use structured choices** adapted to the agent's interface. CLI-based agents: numbered choices where the user types a number. Chat-based agents: numbered list or direct question where the user responds naturally. Never ask open-ended questions when structured choices are possible. This applies to: parallelization choices, failure handling, commit approval, and any other decision point.

**One question at a time.** Present a single structured choice, then STOP and wait for the user's response before proceeding to the next question. Never combine multiple choice blocks in one message.

## Feature Context Resolution

**This command operates on an existing feature.** Resolve the active feature using this order:
1. `--feature NNN` flag (if provided)
2. Branch name detection: `feat/NNN-*` or `feature/NNN-*` → extract NNN
3. Fallback: `last_active_feature` from `cursor.yml`
4. No feature found: prompt user to select or create one

Read the per-feature state file `.tyrex/state/features/NNN.yml` for task tracking, checkpoint fields, and progress.

## Pre-flight: Crash Detection

Before proceeding, check for crash signals per `templates/commands/shared/crash-detection.md`. Quick exit if: no `.tyrex/`, not on `feat/*` branch, or clean working tree. If crash signals detected: present "Inconsistent state detected. Run /tyrex-recover or continue anyway?" If `--auto-approve`: log warning and continue.

## Guardrails Inline

Before executing any task, read `templates/commands/shared/guardrails-inline.md` and apply its 10-rule compact constitution refresher. This ensures compliance even in long-context sessions where the full constitution may have scrolled out of the agent's effective attention window.

## Checkpoint Reminder

This command uses periodic directive checkpoints per `templates/commands/shared/checkpoint-reminder.md`. After every N completed tasks (default: 2, configurable via `tyrex.yml` `quality.checkpoint_interval`), inject the checkpoint reminder block before starting the next task.

## Behavior

### Step 1: Load orchestrator context (lightweight)

The orchestrator stays lean to preserve context budget. Load ONLY what's needed to coordinate:

1. Resolve active feature using Feature Context Resolution (above). Read `.tyrex/state/features/NNN.yml` for task progress and checkpoint data.
2. `.tyrex/tyrex.yml` → configuration (commit mode, parallel settings, **context_engineering**)
3. `.tyrex/state/features/NNN/tasks/*.yml` → task names, status, dependencies (metadata only)
4. `.tyrex/TYREX.md` → **first N lines only** (N = `context_engineering.size_limits.tyrex_md_summary_lines`, default 50). This gives the orchestrator project overview + stack + patterns without loading full history.
5. Active feature spec → **first 30 lines** (summary + acceptance criteria). Full spec is passed to sub-agents, not loaded by orchestrator.

**Do NOT load into orchestrator context:**
- Full source code files (sub-agents read these)
- Full TYREX.md (sub-agents get the summary they need)
- `.tyrex/context/` files (passed to sub-agents via relevant_files)
- `docs/srs/`, `docs/prd/` (passed to sub-agents if listed in relevant_files)
- `.tyrex/constitution.md` (passed to sub-agents directly, orchestrator already has guardrails inline)

### Step 2: Determine execution mode

Read `context_engineering.execution_mode` from `tyrex.yml`:

- **`fresh`** (default) → Sub-agent execution. Each task runs in a fresh sub-agent with targeted context. The orchestrator spawns, collects results, commits, updates state. This eliminates context rot.
- **`inline`** → Legacy execution. All tasks run in the current session (same behavior as pre-v1.13). Use when: runtime doesn't support sub-agents, single simple task, or user preference.

**Auto-detection fallback:** If the runtime does not support spawning sub-agents (e.g., no Agent tool available, no Task tool, single-threaded chat agent), silently fall back to `inline` mode regardless of config. Log: "Fresh context: unavailable in this runtime — falling back to inline execution."

### Step 3: Identify executable tasks + parallelization

Find all tasks where:
- Status is `pending`
- All dependencies are `completed`

These are the "ready" tasks.

If there are MULTIPLE ready tasks that are marked as `parallel: true`:

**If `--auto`:** automatically choose parallel execution for all eligible tasks.

**Otherwise, present structured choices:**
```
Tasks [2, 3, 4] are ready and can run in parallel.

  [1] Execute all in parallel (N agents, fresh context each)
  [2] Execute sequentially (one at a time, fresh context each)
  [3] Choose which to parallelize
```

### Step 4: Execute tasks

#### Fresh Context Execution (execution_mode: "fresh")

For each task (sequential or parallel), the orchestrator performs a 3-phase cycle: **Prepare → Spawn → Collect**.

**Phase A: Prepare sub-agent context**

For the current task, the orchestrator assembles a targeted context package:

1. **Task SPEC** (full content) — read from `docs/specs/` per task's `spec_file`
   - If SPEC missing: warn user and ask whether to generate one or proceed without
   - If SPEC exceeds `size_limits.max_spec_lines`: warn but include anyway
2. **Relevant files** (read-only context) — from the task's `relevant_files` field
   - Read each file listed in `relevant_files` (up to `size_limits.max_context_files`, default 10)
   - Skip files exceeding `size_limits.max_file_lines` (default 500) — add note: "File X skipped (too large) — read on demand during execution"
   - If `relevant_files` is empty or absent (pre-v1.13 task files): the sub-agent reads files on demand (no pre-loaded context)
3. **Constitution** — `.tyrex/constitution.md` (always included, non-negotiable)
4. **Skill** (if assigned) — full skill markdown from `.tyrex/skills/<name>.md`
   - If not found locally: check agent-specific dirs (`.claude/skills/`, `.opencode/skills/`, etc.)
   - If still not found: warn and proceed without
5. **Feature summary** — first 30 lines of the feature spec (goals + acceptance criteria)
6. **Quality strategy** — the task's `quality` attribute and what it means (TDD rules)

**Phase B: Spawn sub-agent**

Spawn a sub-agent (using Agent tool, Task tool, or equivalent) with a structured prompt:

```
You are a Tyrex task executor. Implement ONE task in a fresh context.

TASK: [task name]
SPEC: [full SPEC content]
CONSTITUTION: [constitution.md content]
SKILL: [skill content, if assigned]
FEATURE: [first 30 lines of feature spec]
QUALITY: [required|recommended|optional — with TDD rules]

RELEVANT FILES (pre-loaded for context):
[content of each relevant_file, with file path headers]

INSTRUCTIONS:
1. Read the SPEC carefully — it defines what to implement and how
2. Follow the quality strategy (required = TDD, recommended = tests alongside, optional = ask)
3. Follow the constitution rules (especially: tests, no secrets, path.join, etc.)
4. Apply the skill persona if assigned (guidelines, patterns, review criteria)
5. Implement the task. You may read additional files beyond relevant_files if needed.
6. Run tests if a test command exists
7. When done, report: files_changed, test_results, summary, any deviations from SPEC

DO NOT: commit (orchestrator handles commits), modify .tyrex/ state files,
modify CHANGELOG.md, modify other tasks' files, push to remote.
```

**For parallel tasks:** spawn multiple sub-agents simultaneously (up to `parallel.max_agents`). Each gets its own fresh context. File conflict check: tasks that share files in `Files` field CANNOT be parallel — if detected, force sequential.

**Phase C: Collect results and commit**

After sub-agent completes (or all parallel sub-agents complete):

1. **Collect sub-agent output:**
   - files_changed: list of files created/modified
   - test_results: pass/fail count
   - summary: what was implemented
   - deviations: any changes from SPEC
   - errors: if the sub-agent encountered issues

2. **Validate:**
   - Check that only expected files were modified (files listed in task's `Files` field + test files)
   - Run tests if the sub-agent didn't already (safety net)
   - Run lint if configured

3. **On success — orchestrator handles post-task work:**
   - If deviations reported: update the SPEC file to reflect actual approach
   - Update task state to `completed` with files_changed and output
   - **Resolve audit findings (if applicable):**
     - If the completed task has a `security` attribute (not `none`) or its `task_id` has an `rc-*` prefix:
       1. Check if `.tyrex/security/audit.md` exists; if not, skip silently
       2. Read `.tyrex/security/audit.md`
       3. Check if the task addresses a known finding (match via task metadata or file overlap)
       4. For each matched finding still marked `[ ]`, update to `[x]` with date
       5. **Validation:** only `[ ]` → `[x]`; never revert
   - **Sync subtask status to external tracker (if applicable):**
     - If task has `external_task_ref` AND feature's `external_ref.mode` is `build`:
       1. Pull current status, push forward to `done`, add comment
       2. Graceful degradation on MCP failure
   - Prepare commit message (conventional format)
   - Update `docs/CHANGELOG.md` with what changed
   - **Version bump check** (same logic as before):
     1. Detect if CHANGELOG or ADR was modified
     2. Detect package manifest, read current version
     3. Suggest bump (feat→minor, fix→patch, BREAKING→major)
     4. **If `--auto`:** auto-accept. **Otherwise:** present choices
     5. Update manifest, propagate version, stage alongside task changes
   - **Run tests before commit (mandatory):**
     1. Detect test command from manifest
     2. Run full suite (sub-agent may have run them, but orchestrator re-verifies)
     3. On failure: retry once if `--auto`, else present choices
     4. On pass: include count in output
     5. No test command: skip with note if `--auto`, else present choices
   - **Commit:**
     - **If `--auto`:** commit automatically
     - **Else if `approve`:** show diff, message, changelog entry → present choices
     - **Else if `auto`:** commit automatically
   - Update per-feature state file and cursor.yml
   - **Auto-update TYREX.md** if macro docs generated

4. **On failure:**
   - Update task state to `failed` with error details from sub-agent
   - **If `--auto`:** retry (spawn fresh sub-agent with error context) up to 3 times
   - **Otherwise, present choices:**
     ```
     Task failed: [error summary from sub-agent]
       [1] Fix and retry (fresh sub-agent with error context)
       [2] Fix inline (switch to inline mode for this task)
       [3] Skip this task
       [4] Stop execution
     ```
   - Option [2] is a useful escape hatch — sometimes debugging is easier in the current session

5. After task completion, check for newly unlocked tasks → go to Step 3

#### Inline Execution (execution_mode: "inline" or fallback)

When running inline, the orchestrator executes tasks directly in the current session. This is the legacy behavior and serves as the fallback when fresh context is unavailable.

**Additional context loading for inline mode:**
In addition to the orchestrator context from Step 1, load:
- `.tyrex/constitution.md` → guardrails
- `.tyrex/context/` → project-level context files (if exists)
- `.tyrex/features/NNN-context.md` → feature-level context (if exists)
- `docs/srs/` and `docs/prd/` → SRS/PRD for the active feature (if exist)

For each ready task, one at a time:

1. **Load SPEC (mandatory):**
   - Read the task's SPEC file from `docs/specs/`
   - Use SPEC's Technical Approach and Constraints to guide implementation
   - Reference project-level and feature-level context
   - If SPEC missing: warn user and ask whether to generate one or proceed without
2. **Load skill (if assigned):**
   - Read from `.tyrex/skills/<name>.md` or agent-specific dirs
   - Apply persona: Role, Guidelines, Patterns. Self-check via Review Criteria.
3. Update task state to `in_progress`
4. Update per-feature state file (current_task_in_progress, in_progress_since, in_progress_files_touched)
5. **Implement following quality strategy** (required/recommended/optional — same rules as fresh mode)
6. **On success:** same post-task work as fresh mode Phase C step 3 (audit, tracker sync, commit, changelog, version bump, tests, TYREX.md update)
7. **On failure:** same as fresh mode Phase C step 4 (retry/skip/stop)
8. After completion, check for newly unlocked tasks → go to Step 3

### Step 4b: Doc Impact Analysis (post-implementation)

After ALL implementation tasks are `completed` (before the completion summary), run the Doc Impact Analysis in **actual mode** per `templates/commands/shared/doc-impact-analysis.md`:

1. Collect `files_changed` from ALL completed tasks in this feature
2. For each changed file, extract the actual diff (old values → new values)
3. Scan all doc targets (README, wiki, OpenAPI, diagrams, TYREX.md, config files) for old values that still appear in docs
4. **If inconsistencies found:**
   - **If `--auto`:** auto-create fix task(s) and execute them immediately. Each fix task follows the same commit rules (CHANGELOG, version bump, tests).
   - **Otherwise, present structured choices:**
     ```
     Doc inconsistencies detected:
       - README.md:15 — references port 3000 (changed to 3008)
       - docker-compose.yml:8 — references PORT=3000

       [1] Fix now (create and execute fix tasks)
       [2] Skip (add to backlog)
     ```
   - Fix tasks run BEFORE the completion summary
5. **If no inconsistencies found:** add note to completion summary: "Doc consistency: OK"

### Step 5: Feature completion
When ALL tasks are `completed` (including any doc fix tasks from Step 4b):
- Update feature status to `in_progress` (review pending)
- **Next action** (per `templates/commands/shared/next-action-map.md`):
  ```
  All tasks completed. N/N tasks done, N commits, N files changed.

  Next step: /tyrex-review — review the implementation
    [1] Execute now
    [2] Different command
    [3] Done for now
  ```

## Git Auto-Tags

Version tags are created automatically per `templates/commands/shared/git-semantic-commits.md`. When a version bump is committed (execution-checklist step 6e/g2), a `tyrex-vX.Y.Z` tag is created if `tyrex.yml` `git.auto_tag` is `true`.

## Important Rules
- NEVER skip tests. If tests fail, the task is NOT complete.
- NEVER make a commit that breaks CI
- ALWAYS update the per-feature state file after each task — this enables session recovery. cursor.yml only tracks `agent_mode` and `last_active_feature`.
- ALWAYS update CHANGELOG.md — it's mandatory
- ALWAYS use structured choices for decisions — never open-ended questions when choices are possible
- Sub-agents ONLY modify files listed in their task's `Files` field (plus test files)
- Sub-agents do NOT commit, do NOT modify `.tyrex/` state, do NOT update CHANGELOG — the orchestrator does all of this
- If two tasks need to modify the same file, they CANNOT be parallel — execute sequentially
- The orchestrator (you) handles commits, state updates, CHANGELOG, and version bumps — NEVER delegate these to sub-agents
- If the user interrupts ("stop", "wait", "pause"), immediately save state and stop
- `--auto` is a trust accelerator — it skips ALL human checkpoints but still runs all quality checks (tests, lint, security)
- When macro docs (ADR, PRD, SRS) are created/updated, ALWAYS update TYREX.md with a summary
- **Fresh context is the default.** The orchestrator stays under 40% context usage. Each sub-agent gets a fresh 200K context window with only task-specific context.
- **Inline mode is the fallback**, not the primary path. Use when: sub-agents unavailable, single trivial task, or user preference.
- **Retry with error context:** When a sub-agent fails and is retried, include the error output in the new sub-agent's prompt so it can learn from the failure.
