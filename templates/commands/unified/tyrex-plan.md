---
description: "Plan the implementation"
---

# /tyrex-plan - Plan the implementation

You are the Tyrex Framework orchestrator. The user wants to plan the implementation of the active feature.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may create/modify only `.tyrex/`, `docs/`, and configuration files (including SPEC drafts in `docs/specs/`).

## Behavior

### Step 1: Load context
Read (in this order):
1. `.tyrex/state/cursor.yml` → identify active feature
2. Active feature spec file
3. `.tyrex/TYREX.md` → project patterns and context
4. `.tyrex/constitution.md` → guardrails
5. `.tyrex/skills/*.md` → available skills (scan names and `## Expertise` sections)
6. `.tyrex/context/` → project-level context files (if any)
7. `.tyrex/features/NNN-context.md` → demand-level context (if any)
8. `docs/srs/NNN-*.md` → SRS for this demand (if generated during /tyrex-new)
9. `docs/prd/NNN-*.md` → PRD for this demand (if generated during /tyrex-new)

If no active feature: ask the user which feature to plan, or suggest running `/tyrex-new` first.

### Step 2: Propose tasks
Analyze the feature — including all loaded context, SRS, and PRD — and propose a list of tasks. Each task MUST have these attributes:

```markdown
### Task N: [short description]
- **Type:** sequential | parallel
- **Depends on:** [list of task numbers, or "none"]
- **Unlocks:** [list of task numbers]
- **Estimate:** small | medium | large
- **Files:** [files to create or modify]
- **Skill:** [skill filename from .tyrex/skills/, e.g., "backend-engineer.md", or "none"]
- **Quality:** required | recommended | optional
```

**Skill assignment:**
1. **Check the feature spec first** for skills pre-selected during `/tyrex-new`:
   - Read the active feature spec file and look for a `Skills:` field
   - Pre-selected skills have priority when assigning to tasks
2. **Match skills to tasks** based on expertise:
   - Read each available skill's `## Expertise` section
   - Match expertise areas to the task's domain/technology
   - If a pre-selected skill matches the task, assign it
   - If no pre-selected skill matches but another installed skill does, suggest it to the user
   - If no skill matches at all, set "none"
3. The assigned skill is loaded by the agent before executing the task

**Quality strategy per task:**
- `required` — TDD mandatory, tests MUST pass (default for: API, workers, data layer, security)
- `recommended` — write tests, warn if skipped (default for: frontend, mobile UI)
- `optional` — ask user "Write tests? [y/N]" (default for: infra, config, docs, migrations)
- Read the project-level default from `tyrex.yml` quality section and override per task context

**Rules for task decomposition:**
- Each task should be completable in ONE commit
- Tasks that modify the SAME file CANNOT be parallel
- Tests CAN be parallel if they test independent units
- Migrations and schema changes are ALWAYS sequential and come first
- Order: data model → business logic → interface → tests (but tests can interleave)

### Step 2b: Generate SPEC per task
For EACH proposed task, generate a SPEC draft:

1. Create `docs/specs/NNN-task-MMM-[slug].md` using the SPEC template
2. Fill in:
   - **Objective:** What this task achieves technically
   - **Technical Approach:** How it will be implemented, referencing context and SRS/PRD where relevant
   - **Constraints & Trade-offs:** Informed by project context and demand context
   - **Dependencies:** Libraries, services, or other tasks
   - **Files Affected:** Same as task file list
   - **Edge Cases:** Identified from SRS/PRD and context
   - **Testing Strategy:** Aligned with the task's quality attribute
3. SPECs are drafts at this stage — they are refined during `/tyrex-do`
4. Present all SPECs to the user as part of the plan review

### Step 2c: Offer documentation tasks (optional)
After proposing implementation tasks, check if any of these are relevant for this feature:
- `/tyrex-readme` — if the feature changes the project's public API or adds new capabilities
- `/tyrex-openapi` — if the feature adds/modifies API endpoints
- `/tyrex-wiki` — if the feature introduces new concepts or architecture changes

If relevant, suggest adding them as final tasks (after all implementation and test tasks). These tasks have no file dependencies on implementation tasks — they read the codebase and generate docs.

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
Present the plan — including task list, execution graph, and SPEC drafts — and ask:
- "Does this plan look good?"
- "Want to add, remove, or reorder any tasks?"
- "Any task that should NOT be parallelized?"
- "Any SPEC that needs adjustment?"

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
spec_file: "docs/specs/NNN-task-MMM-slug.md"
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

Tell the user: "Plan approved. Run /tyrex-do to start implementation."

## Important Rules
- NEVER propose more than 15 tasks for a single feature (break into multiple features if needed)
- NEVER start implementing during the plan phase
- The plan section in the feature spec should stay under 50 lines
- Always identify what can be parallelized — this is a core Tyrex differentiator
- If a task is large (estimate: large), suggest breaking it into smaller tasks
- ALWAYS generate a SPEC draft per task — SPECs are mandatory documentation
- Context files (project-level and demand-level) MUST be read and considered in task planning
- SPECs should reference relevant context, SRS requirements, and PRD goals where applicable
