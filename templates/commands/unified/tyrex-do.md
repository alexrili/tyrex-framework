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
- **`/tyrex-do --auto-approve`** — Execute ALL tasks automatically: commits, parallelism decisions, and all checkpoints are auto-approved. Only stops on failures after 3 retries.

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

## Behavior

### Step 1: Load state
Read:
1. Resolve active feature using Feature Context Resolution (above). Read `.tyrex/state/features/NNN.yml` for task progress and checkpoint data.
2. Active feature spec → task list
3. `.tyrex/state/features/NNN/tasks/*.yml` → status of all tasks for this feature
4. `.tyrex/tyrex.yml` → configuration (commit mode, parallel settings)
5. `.tyrex/TYREX.md` → project context
6. `.tyrex/constitution.md` → guardrails
7. `.tyrex/context/` → project-level context files (if exists)
8. `.tyrex/features/NNN-context.md` → feature-level context (if exists)
9. `docs/srs/` and `docs/prd/` → SRS/PRD for the active feature (if exist)

### Step 2: Identify executable tasks
Find all tasks where:
- Status is `pending`
- All dependencies are `completed`

These are the "ready" tasks.

### Step 3: Parallelization decision
If there are MULTIPLE ready tasks that are marked as `parallel: true`:

**If `--auto-approve`:** automatically choose parallel execution for all eligible tasks.

**Otherwise, present structured choices:**
```
Tasks [2, 3, 4] are ready and can run in parallel.

  [ ] Execute all in parallel (3 agents)
  [ ] Execute sequentially (one at a time)
  [ ] Choose which to parallelize
```

### Step 4: Execute tasks

**For SEQUENTIAL execution:**
For each ready task, one at a time:

1. **Load SPEC (mandatory):**
   - Read the task's SPEC file (referenced in task state as `spec_file`, located in `docs/specs/`)
   - Use the SPEC's **Technical Approach** and **Constraints** to guide implementation
   - Reference project-level context (`.tyrex/context/`) and feature-level context for informed decisions
   - If SPEC file is missing, warn user and ask whether to generate one or proceed without
2. **Load skill (if assigned):**
   - Check if the task has a `skill` attribute
   - If yes: read the skill file from `.tyrex/skills/<name>.md`
   - If skill not found: check agent-specific skill directories (e.g., `.claude/skills/`, `.opencode/skills/`, `.cursor/rules/tyrex/`, `.codex/skills/tyrex/` — based on the agent executing the command). The agent knows its own directory structure.
   - If still not found: warn user and continue without skill
   - Apply the skill persona during implementation:
     - Read `## Role` to understand the persona perspective for this task
     - Apply `## Guidelines` as behavioral constraints during implementation
     - Follow `## Patterns` for project-specific conventions
     - If the skill's `## Expertise` doesn't match the current task's domain, log a note but still apply (the human selected it)
   - Before marking the task complete, use `## Review Criteria` from the skill as a self-check
3. Update task state to `in_progress`
4. Update the per-feature state file with current task (set `current_task_in_progress`, `in_progress_since`, `in_progress_files_touched`)
5. **Implement following quality strategy:**
   - Check the task's `quality` attribute (required | recommended | optional)
   - `required`: TDD mandatory — write tests first, implement, tests MUST pass
   - `recommended`: write tests alongside code, warn if skipped
   - `optional`: present choices: `[ ] Write tests for this task` / `[ ] Skip tests`
   - **If `--auto-approve`:** for `optional` quality, default to writing tests
   - Run lint if configured — it MUST pass
   - Run security scan if configured
6. **On success:**
   - If the implementation deviated from the SPEC's draft, update the SPEC file to reflect the actual approach taken
   - Update task state to `completed` with files_changed and output
   - **Resolve audit findings (if applicable):**
     - If the completed task has a `security` attribute (not `none`) or its `task_id` has an `rc-*` prefix:
       1. Check if `.tyrex/security/audit.md` exists; if not, skip silently
       2. Read `.tyrex/security/audit.md`
       3. Check if the task addresses a known finding (match via task metadata notes like "Addresses SECURITY-NNN" or overlap between `files_changed` and the finding's `files_affected`)
       4. For each matched finding still marked `[ ]`, update it to `[x]` and append the resolution date (today's date in YYYY-MM-DD format)
       5. Write the updated audit.md
       6. **Validation:** only transition `[ ]` to `[x]`; never revert a finding that is already `[x]`
   - Prepare commit message (conventional format)
   - Update `docs/CHANGELOG.md` with what changed
   - **Version bump check (if CHANGELOG or ADR changed):**
     1. Detect if `docs/CHANGELOG.md` or any `docs/adrs/*.md` was modified in this task
     2. If yes, detect the project's package manager manifest:
        - Scan for: `package.json`, `composer.json`, `pyproject.toml`, `Cargo.toml`, `mix.exs`, `go.mod`
        - If no manifest found: skip versioning silently
     3. Read the current version from the manifest
     4. Suggest semver bump based on change type:
        - `feat:` commit → minor bump
        - `fix:` commit → patch bump
        - `BREAKING CHANGE` or `!:` in commit → major bump
        - `chore:`, `docs:`, `refactor:`, `test:` → patch bump
     5. **If `--auto-approve`:** auto-accept the suggested bump
        **Otherwise, present structured choices:**
        ```
        Version bump detected. Current: X.Y.Z
          [1] Accept suggested: [type] → X.Y.Z+1
          [2] Override: major
          [3] Override: minor
          [4] Override: patch
          [5] Skip version bump
        ```
     6. Validate the resulting version string matches semver format (`MAJOR.MINOR.PATCH`, all numeric). If invalid, warn and ask for correction.
     7. Update the version in the manifest file
     8. Propagate version: grep for the old version string in known referencing files: README*, package manifest, TYREX.md, badge URLs, and documentation files. Exclude: `node_modules/`, lock files (`package-lock.json`, `yarn.lock`, `composer.lock`, `Cargo.lock`), vendor directories, and `.git/`.
     9. Stage the version changes alongside the task changes (same atomic commit)
   - **Run tests before commit (mandatory for every task):**
     1. Detect test framework and test command from the project's package manifest scripts (e.g., `test` script in `package.json`, `pytest` in `pyproject.toml`, etc.)
     2. The test command is read from the project's own manifest and trusted as project-owned. In non-`--auto-approve` mode, display the exact command before running. Example: `Run: npm test [1] Approve [2] Skip`
     3. If a test command exists: run the full test suite
     4. If tests **fail**:
        - **If `--auto-approve`:** automatically retry once; if still failing, mark the task as `failed`
        - **Otherwise, present structured choices:**
          ```
          Tests failed: N failures
            [1] Fix and retry
            [2] Skip tests (add note to commit)
            [3] Abort task
          ```
     5. If tests **pass**: include the pass count in the task output: "Tests: N passed, 0 failed"
     6. If **no test framework/command is detected**:
        - **If `--auto-approve`:** skip with a note in the task output: "No test command detected — skipped"
        - **Otherwise, present structured choices:**
          ```
          No test command detected.
            [1] Continue without tests
            [2] Specify test command
          ```
     - This step runs for EVERY task, not just security tasks — core principle: **never let an implementation pass without at least asking about tests**
   - **If `--auto-approve`:**
     - Make the commit automatically (overrides `approve` mode from tyrex.yml)
   - **Else if commit mode is `approve`:**
     - Show: diff summary, commit message, changelog entry
     - Present choices: `[ ] Approve commit` / `[ ] Edit commit message` / `[ ] Reject and redo`
   - **Else if commit mode is `auto`:**
     - Make the commit automatically
   - Update the per-feature state file: last_task_completed, tasks_summary, next_tasks. Update cursor.yml only: `last_active_feature` and `agent_mode`.
   - **Auto-update TYREX.md:** If this task generated or updated any ADR, PRD, SRS, or other macro documentation, automatically update TYREX.md:
     - Add a summary entry in the appropriate section (Architecture Decisions for ADR, Business Rules for PRD, Requirements for SRS)
     - Add any new patterns discovered to the Patterns section
     - This keeps TYREX.md as the living index of all project knowledge
7. **On failure:**
   - Update task state to `failed` with error details
   - Show the error to the user
   - **If `--auto-approve`:** automatically retry up to 3 times, then mark as `failed` and continue to next task
   - **Otherwise, present choices:**
     ```
     [ ] Fix and retry
     [ ] Skip this task
     [ ] Stop execution
     ```
   - If retry: fix and go back to step 3 of the task
   - If skip: mark as `failed`, check if any tasks are now `blocked`

8. After task completion, check for newly unlocked tasks
9. If new parallel tasks are available, go back to Step 3 (ask about parallelization)

**For PARALLEL execution:**
1. For each parallel task, spawn a sub-agent (Task tool) with:
   - The specific task description and files
   - TYREX.md content (read-only context)
   - constitution.md content (read-only guardrails)
   - Skill content (if assigned) — the full skill markdown file
   - Instruction: "Implement this task following the skill guidelines. Write results to the specified state file."
   - The sub-agent should: implement, test, and report results

2. Wait for all sub-agents to complete
3. Collect results from task state files
4. For each completed sub-task:
   - Validate the implementation (tests pass, lint clean)
   - Handle commits (based on mode: approve, auto, or `--auto-approve`)
   - Update CHANGELOG.md (sequentially, after all parallel tasks finish)
5. Update the per-feature state file with all completed tasks. Update cursor.yml only: `last_active_feature` and `agent_mode`.
6. Check for newly unlocked tasks → go to Step 3

### Step 5: Feature completion
When ALL tasks are `completed`:
- Tell the user: "All tasks completed. Run /tyrex-review to review the implementation."
- Update feature status to `in_progress` (review pending)

## Important Rules
- NEVER skip tests. If tests fail, the task is NOT complete.
- NEVER make a commit that breaks CI
- ALWAYS update the per-feature state file after each task — this enables session recovery. cursor.yml only tracks `agent_mode` and `last_active_feature`.
- ALWAYS update CHANGELOG.md — it's mandatory
- ALWAYS use structured choices for decisions — never open-ended questions when choices are possible
- Sub-agents for parallel tasks should ONLY modify files listed in their task
- If two parallel tasks need to modify the same file, they CANNOT be parallel — execute sequentially
- The orchestrator (you) handles commits and state updates, NOT sub-agents
- If the user interrupts ("stop", "wait", "pause"), immediately save state and stop
- `--auto-approve` is a trust accelerator — it skips ALL human checkpoints but still runs all quality checks (tests, lint, security)
- When macro docs (ADR, PRD, SRS) are created/updated, ALWAYS update TYREX.md with a summary
