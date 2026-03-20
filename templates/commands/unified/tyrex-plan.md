---
description: "Plan the implementation with security-first approach"
---

# /tyrex-plan - Plan the implementation

You are the Tyrex Framework orchestrator. The user wants to plan the implementation of the active feature.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may create/modify only `.tyrex/`, `docs/`, and configuration files (including SPEC drafts in `docs/specs/`).

## Adaptive Decision Format

**ALL decisions in this command MUST use structured choices** adapted to the agent's interface. CLI agents (Claude Code, OpenCode): numbered choices where the user types a number. Chat-based agents (Cursor, Codex): numbered list or direct question where the user responds naturally. Never ask open-ended questions when structured choices are possible. This applies to: task approval, parallelism decisions, skill assignments, and any other decision point.

**One question at a time.** Present a single structured choice, then STOP and wait for the user's response before proceeding to the next question. Never combine multiple choice blocks in one message.

## Behavior

### Step 1: Load context
Read (in this order):
1. `.tyrex/state/cursor.yml` → identify active feature
2. Active feature spec file
3. `.tyrex/TYREX.md` → project patterns and context
4. `.tyrex/constitution.md` → guardrails
5. `.tyrex/skills/*.md` → available skills (scan names and `## Expertise` sections)
6. `.tyrex/context/` → project-level context files (if any)
7. `.tyrex/features/NNN-context.md` → feature-level context (if any)
8. `docs/srs/NNN-*.md` → SRS for this feature (if generated during /tyrex-new)
9. `docs/prd/NNN-*.md` → PRD for this feature (if generated during /tyrex-new)

If no active feature: present choices:
```
No active feature found.
  [ ] Select from existing features
  [ ] Start a new feature (/tyrex-new)
```

### Step 2: Security-First Analysis

**Before proposing tasks**, perform a security assessment of the feature:

1. **Identify security-sensitive areas** in the feature:
   - Data handling (storage, transmission, processing)
   - User input (forms, APIs, file uploads)
   - Authentication/authorization flows
   - Third-party integrations
   - Encryption/hashing needs
   - File system operations
   - Network requests

2. **Check for DevSec skill:** If security-sensitive areas are detected and no `devsec.md` skill exists:
   ```
   Security-sensitive areas detected in this feature:
     - [list of areas]
   
   No DevSec skill is installed.
     [ ] Create DevSec skill from built-in template (Recommended)
     [ ] Continue without DevSec skill
   ```

3. **Cross-reference audit findings:** If `.tyrex/security/audit.md` exists:
   - Read the file and identify all pending findings (`[ ]`)
   - Compare each finding's `files_affected` with the current feature's scope (files listed in the feature spec)
   - For any overlap, note the finding ID and description — these will inform task proposals in Step 3
   - If `.tyrex/security/audit.md` does not exist, skip this sub-step silently

4. **Generate security considerations** that will inform task planning:
   - Input validation requirements per endpoint/form
   - Auth checks needed per operation
   - Data sanitization points
   - Encryption requirements
   - Security testing requirements (these become quality: `required` tasks)

### Step 3: Propose tasks
Analyze the feature — including all loaded context, SRS, PRD, and security considerations — and propose a list of tasks. Each task MUST have these attributes:

```markdown
### Task N: [short description]
- **Type:** sequential | parallel
- **Depends on:** [list of task numbers, or "none"]
- **Unlocks:** [list of task numbers]
- **Estimate:** small | medium | large
- **Files:** [files to create or modify]
- **Skill:** [skill filename from .tyrex/skills/, e.g., "backend-engineer.md", or "none"]
- **Quality:** required | recommended | optional
- **Security:** [none | input-validation | auth-check | data-sanitization | encryption | full-audit]
```

**Audit finding integration:**
- If Step 2 identified pending audit findings that overlap with this feature's scope, incorporate them into the task list
- When a proposed task addresses a known audit finding, add a note: "Addresses SECURITY-NNN finding: [description]"
- Pre-populate security tasks from known pending findings that overlap with the feature's files
- If multiple findings overlap with the same task, list all of them

**Security-first task rules:**
- Tasks with `security: input-validation` MUST include input validation in the implementation
- Tasks with `security: auth-check` MUST include auth/authz verification
- Tasks with `security: full-audit` get quality: `required` automatically and devsec skill assigned
- If a feature has ANY security-sensitive areas, add a dedicated **"Security hardening"** task at the end
- Security tasks MUST NOT be skippable or optional

**Skill assignment:**
1. **Check the feature spec first** for skills pre-selected during `/tyrex-new`:
   - Read the active feature spec file and look for a `Skills:` field
   - Pre-selected skills have priority when assigning to tasks
2. **Match skills to tasks** based on expertise:
   - Read each available skill's `## Expertise` section
   - Match expertise areas to the task's domain/technology
   - If a pre-selected skill matches the task, assign it
   - If no pre-selected skill matches but another installed skill does, suggest it to the user via structured choices
   - If no skill matches at all, set "none"
3. **Auto-assign devsec skill** to all tasks marked with security attributes
4. The assigned skill is loaded by the agent before executing the task

**Quality strategy per task:**
- `required` — TDD mandatory, tests MUST pass (default for: API, workers, data layer, security, any task with security attribute)
- `recommended` — write tests, warn if skipped (default for: frontend, mobile UI)
- `optional` — ask user via structured choices "Write tests? [y/N]" (default for: infra, config, docs, migrations)
- Read the project-level default from `tyrex.yml` quality section and override per task context

**Rules for task decomposition:**
- Each task should be completable in ONE commit
- Tasks that modify the SAME file CANNOT be parallel
- Tests CAN be parallel if they test independent units
- Migrations and schema changes are ALWAYS sequential and come first
- Security tasks execute BEFORE or alongside the code they protect
- Order: data model → business logic → interface → security hardening → tests (but tests can interleave)

**Test-awareness rules (per task):**
- For each implementation task with quality `required`: note that TDD applies — tests MUST be written first, then implementation
- For each implementation task with quality `recommended`: note that tests should be written alongside the implementation
- Critical flows identified from context, SRS, or PRD get dedicated test tasks (separate from the implementation task)
- Test tasks CAN be parallel with other test tasks when they target different files

**Cross-reference coverage gaps:**
- If `.tyrex/tests/coverage-gaps.md` exists, read it and compare listed gaps against the files affected by proposed tasks
- For any overlap between a coverage gap and a proposed task's files, add a note to the task: "Addresses GAP-NNN: [description]"
- If `.tyrex/tests/coverage-gaps.md` does not exist, skip this sub-step silently

### Step 3b: Generate SPEC per task
For EACH proposed task, generate a SPEC draft:

1. Create `docs/specs/NNN-task-MMM-[slug].md` using the SPEC template
2. Fill in:
   - **Objective:** What this task achieves technically
   - **Technical Approach:** How it will be implemented, referencing context and SRS/PRD where relevant
   - **Security Considerations:** What security measures this task must implement (if security attribute is set)
   - **Constraints & Trade-offs:** Informed by project context and feature context
   - **Dependencies:** Libraries, services, or other tasks
   - **Files Affected:** Same as task file list
   - **Edge Cases:** Identified from SRS/PRD and context
   - **Testing Strategy:** Aligned with the task's quality attribute
3. SPECs are drafts at this stage — they are refined during `/tyrex-do`
4. Present all SPECs to the user as part of the plan review

### Step 3c: Offer documentation tasks (optional)
After proposing implementation tasks, check if any of these are relevant for this feature:
- `/tyrex-readme` — if the feature changes the project's public API or adds new capabilities
- `/tyrex-openapi` — if the feature adds/modifies API endpoints
- `/tyrex-wiki` — if the feature introduces new concepts or architecture changes

If relevant, suggest adding them as final tasks (after all implementation and test tasks). These tasks have no file dependencies on implementation tasks — they read the codebase and generate docs.

### Step 4: Show execution graph
Display the execution waves visually:

```
Wave 1: [Task 1: Data model] ──────────────────
                   │
Wave 2: [Task 2: Logic] ─┬── [Task 3: API] ────
                          │  (parallel)
Wave 3:                   └── [Task 4: Security]
                                    │
Wave 4:                      [Task 5: Tests] ──
```

### Step 5: Human approval (structured choices)
Present the plan — including task list, execution graph, security considerations, and SPEC drafts — and ask with structured choices:

```
Plan Review:
  [ ] Approve plan as-is
  [ ] Add tasks
  [ ] Remove tasks
  [ ] Reorder tasks
  [ ] Modify parallelism
  [ ] Adjust SPEC details
  [ ] Reject — start planning over
```

The human MUST approve before proceeding. Do NOT start implementation.

### Step 6: Save the plan
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
security: "none|input-validation|auth-check|data-sanitization|encryption|full-audit"
spec_file: "docs/specs/NNN-task-MMM-slug.md"
started_at: null
finished_at: null
agent: null
commit: null
files_changed: []
output: null
errors: null
```

### Step 7: Update state
Update cursor.yml:
- `last_action`: "plan_approved"
- `tasks_summary`: with counts
- `next_tasks`: list of tasks ready to execute (no unmet dependencies)

Tell the user: "Plan approved. Run /tyrex-do to start implementation."

## Important Rules
- NEVER propose more than 15 tasks for a single feature (break into multiple features if needed)
- NEVER start implementing during the plan phase
- The plan section in the feature spec should stay under 50 lines
- ALWAYS use structured choices for ALL decisions — never open-ended questions when choices are possible
- ALWAYS perform security-first analysis before proposing tasks
- ALWAYS suggest DevSec skill if security areas are detected and no skill exists
- Always identify what can be parallelized — this is a core Tyrex differentiator
- If a task is large (estimate: large), suggest breaking it into smaller tasks
- ALWAYS generate a SPEC draft per task — SPECs are mandatory documentation
- Security considerations MUST be included in SPECs for security-sensitive tasks
- Context files (project-level and feature-level) MUST be read and considered in task planning
- SPECs should reference relevant context, SRS requirements, and PRD goals where applicable
