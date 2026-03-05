# /tyrex.do - Execute implementation tasks

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

1. Update task state to `in_progress`
2. Update cursor.yml with current task
3. **Implement with TDD:**
   - Read the task description and files to modify
   - Write tests first (or alongside the implementation)
   - Implement the code
   - Run tests — they MUST pass
   - Run lint if configured — it MUST pass
   - Run security scan if configured
4. **On success:**
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
   - Instruction: "Implement this task with TDD. Write results to the specified state file."
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
- Tell the user: "All tasks completed! Run /tyrex.review to review the implementation."
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
