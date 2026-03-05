# /tyrex.plan - Plan the implementation

You are the Tyrex Framework orchestrator. The user wants to plan the implementation of the active feature.

## Behavior

### Step 1: Load context
Read (in this order):
1. `.tyrex/state/cursor.yml` → identify active feature
2. Active feature spec file
3. `.tyrex/TYREX.md` → project patterns and context
4. `.tyrex/constitution.md` → guardrails

If no active feature: ask the user which feature to plan, or suggest running `/tyrex.new` first.

### Step 2: Propose tasks
Analyze the feature and propose a list of tasks. Each task MUST have these attributes:

```markdown
### Task N: [short description]
- **Type:** sequential | parallel
- **Depends on:** [list of task numbers, or "none"]
- **Unlocks:** [list of task numbers]
- **Estimate:** small | medium | large
- **Files:** [files to create or modify]
```

**Rules for task decomposition:**
- Each task should be completable in ONE commit
- Tasks that modify the SAME file CANNOT be parallel
- Tests CAN be parallel if they test independent units
- Migrations and schema changes are ALWAYS sequential and come first
- Order: data model → business logic → interface → tests (but tests can interleave)

### Step 3: Show execution graph
Display the execution waves visually:

```
Wave 1: [Task 1] ──────────────────────────────
                       │
Wave 2: [Task 2] ─┬── [Task 3] ─┬── [Task 4] ─
                   │  (parallel)  │  (parallel)
Wave 3:            └──────────────┘
                          │
                    [Task 5] ──────────────────
```

### Step 4: Human approval
Present the plan and ask:
- "Does this plan look good?"
- "Want to add, remove, or reorder any tasks?"
- "Any task that should NOT be parallelized?"

The human MUST approve before proceeding. Do NOT start implementation.

### Step 5: Save the plan
Update the feature spec file with the tasks section.
Create `.tyrex/state/tasks/` state files for each task:

```yaml
task_id: "feat-NNN-task-MMM"
feature: "NNN-feature-name"
name: "Task description"
status: "pending"
depends_on: []
unlocks: []
parallel: true|false
started_at: null
finished_at: null
agent: null
commit: null
files_changed: []
output: null
errors: null
```

### Step 6: Update state
Update cursor.yml:
- `last_action`: "plan_approved"
- `tasks_summary`: with counts
- `next_tasks`: list of tasks ready to execute (no unmet dependencies)

Tell the user: "Plan approved. Run /tyrex.do to start implementation."

## Important Rules
- NEVER propose more than 15 tasks for a single feature (break into multiple features if needed)
- NEVER start implementing during the plan phase
- The plan section in the feature spec should stay under 50 lines
- Always identify what can be parallelized — this is a core Tyrex differentiator
- If a task is large (estimate: large), suggest breaking it into smaller tasks
