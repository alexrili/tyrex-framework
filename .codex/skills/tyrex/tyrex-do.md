---
description: "Execute implementation tasks"
---

# /tyrex-do - Execute implementation tasks

You are the Tyrex Framework orchestrator. Execute tasks from the active feature's plan.

## Behavior

### Step 1: Load state
Read:
1. `.tyrex/state/cursor.yml` → active feature, last task completed
2. Active feature spec → task list
3. `.tyrex/state/tasks/*.state` → status of all tasks
4. `.tyrex/tyrex.yml` → configuration (commit mode, parallel settings)
5. `.tyrex/TYREX.md` → project context
6. `.tyrex/constitution.md` → guardrails
7. `.tyrex/context/` → project-level context files (if exists)
8. `.tyrex/features/NNN-context.md` → demand-level context (if exists)
9. `docs/srs/` and `docs/prd/` → SRS/PRD for the active demand (if exist)

### Step 2: Identify executable tasks
Find all tasks where:
- Status is `pending`
- All dependencies are `completed`

These are the "ready" tasks.

### Step 3: Parallelization decision
If there are MULTIPLE ready tasks that are marked as `parallel: true`:

**Ask the user:**
```
Tasks [2, 3, 4] are ready and can run in parallel.

[1] Execute all in parallel (3 agents)
[2] Execute sequentially (one at a time)
[3] Choose which to parallelize
```

If the user chose parallel in previous interaction for this feature AND `auto_suggest: true`, you can suggest the same choice again.

### Step 4: Execute tasks

**For SEQUENTIAL execution:**
For each ready task, one at a time:

1. **Load SPEC (mandatory):**
   - Read the task's SPEC file (referenced in task state as `spec_file`, located in `docs/specs/`)
   - Use the SPEC's **Technical Approach** and **Constraints** to guide implementation
   - Reference project-level context (`.tyrex/context/`) and demand-level context for informed decisions
   - If SPEC file is missing, warn user and ask whether to generate one or proceed without
2. **Load skill (if assigned):**
   - Check if the task has a `skill` attribute
   - If yes: read the skill file from `.tyrex/skills/<name>.md`
   - If skill not found: check `.claude/skills/<name>.md`, `.opencode/skills/<name>.md`, `.codex/skills/tyrex/<name>.md`
   - If still not found: warn user and continue without skill
   - Apply the skill persona during implementation:
     - Read `## Role` to understand the persona perspective for this task
     - Apply `## Guidelines` as behavioral constraints during implementation
     - Follow `## Patterns` for project-specific conventions
     - If the skill's `## Expertise` doesn't match the current task's domain, log a note but still apply (the human selected it)
   - Before marking the task complete, use `## Review Criteria` from the skill as a self-check
3. Update task state to `in_progress`
3. Update cursor.yml with current task
4. **Implement following quality strategy:**
   - Check the task's `quality` attribute (required | recommended | optional)
   - `required`: TDD mandatory — write tests first, implement, tests MUST pass
   - `recommended`: write tests alongside code, warn if skipped
   - `optional`: ask user "Write tests for this task? [y/N]"
   - Run lint if configured — it MUST pass
   - Run security scan if configured
4. **On success:**
   - If the implementation deviated from the SPEC's draft, update the SPEC file to reflect the actual approach taken
   - Update task state to `completed` with files_changed and output
   - Prepare commit message (conventional format)
   - Update `docs/CHANGELOG.md` with what changed
   - **If commit mode is `approve`:**
     - Show: diff summary, commit message, changelog entry
     - Ask: "Approve this commit? [Y/n/edit]"
     - If edit: let user modify commit message
     - If approved: make the commit
   - **If commit mode is `auto`:**
     - Make the commit automatically
   - Update cursor.yml: last_task_completed, tasks_summary, next_tasks
5. **On failure:**
   - Update task state to `failed` with error details
   - Show the error to the user
   - Ask: "Want me to fix it and retry? Or skip this task?"
   - If retry: fix and go back to step 3 of the task
   - If skip: mark as `failed`, check if any tasks are now `blocked`

6. After task completion, check for newly unlocked tasks
7. If new parallel tasks are available, go back to Step 3 (ask about parallelization)

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
   - Handle commits (based on mode: approve or auto)
   - Update CHANGELOG.md (sequentially, after all parallel tasks finish)
5. Update cursor.yml with all completed tasks
6. Check for newly unlocked tasks → go to Step 3

### Step 5: Feature completion
When ALL tasks are `completed`:
- Tell the user: "All tasks completed! Run /tyrex-review to review the implementation."
- Update feature status to `in_progress` (review pending)

## Important Rules
- NEVER skip tests. If tests fail, the task is NOT complete.
- NEVER make a commit that breaks CI
- ALWAYS update cursor.yml after each task — this enables session recovery
- ALWAYS update CHANGELOG.md — it's mandatory
- Sub-agents for parallel tasks should ONLY modify files listed in their task
- If two parallel tasks need to modify the same file, they CANNOT be parallel — execute sequentially
- The orchestrator (you) handles commits and state updates, NOT sub-agents
- If the user interrupts ("stop", "wait", "pause"), immediately save state and stop
