---
description: "Deterministic autopilot - Tyrex takes full control of the development flow"
---

# /tyrex-handoff - Deterministic Autopilot Mode

You are now operating under **Tyrex Handoff Protocol**. This is a deterministic mode where you MUST follow the Tyrex workflow step-by-step with ZERO deviation. Think of this as the user handing you the controls — but you fly strictly by the instrument panel.

## CRITICAL RULES (NON-NEGOTIABLE)

1. You MUST read and obey `.tyrex/constitution.md` before ANY action. If it doesn't exist, STOP and tell the user to run `/tyrex-init` first.
2. You MUST read `.tyrex/tyrex.yml` for all configuration. Do NOT ask the user things already configured.
3. You MUST read `.tyrex/state/cursor.yml` to know current state. Do NOT start from scratch if there is state.
4. You MUST follow the phase sequence below. Do NOT skip phases. Do NOT reorder.
5. You MUST update state files after EVERY action. If you crash, the next session resumes from the last recorded state.
6. You MUST NOT implement anything without an approved plan.
7. You MUST NOT commit without tests passing (respecting quality strategy for the context).
8. You MUST update `docs/CHANGELOG.md` on every change. No exceptions.
9. You MUST ask the human for decisions at defined checkpoints (marked with [CHECKPOINT] below). Between checkpoints, operate autonomously.
10. When a task specifies a skill, you MUST load that skill before executing.

## PHASE SEQUENCE

Execute these phases IN ORDER. Do not proceed to the next phase until the current one is complete.

### PHASE 0: Context Load
```
READ .tyrex/state/cursor.yml
IF active_feature exists AND status != "done":
  → Resume from last recorded state (skip to appropriate phase)
IF no .tyrex/ directory:
  → STOP. Tell user: "Run /tyrex-init first."
READ .tyrex/TYREX.md
READ .tyrex/constitution.md
READ .tyrex/tyrex.yml
REPORT current state to user
```

### PHASE 1: Demand Capture
```
ASK user: "What do you want to implement?"
LISTEN to description
ANALYZE description for:
  - Ambiguities (ask max 5 clarification questions)
  - Scope boundaries (what's NOT included)
  - Affected project areas (API? Mobile? Web? Workers?)

[CHECKPOINT] Present understanding back to user. Wait for confirmation.
```

### PHASE 2: Configuration
```
READ defaults from tyrex.yml
DETECT project context for quality strategy:
  - Check for test frameworks (jest, rspec, pytest, etc.)
  - Check for existing coverage config
  - Identify area type (api/mobile/web/worker/infra)

PRESENT configuration:
  - Documentation: CHANGELOG (mandatory) + suggest ADR/RFC/Wiki/Diagrams based on complexity
  - Documentation generation: suggest /tyrex-readme, /tyrex-openapi, /tyrex-wiki as final tasks if relevant
  - Branch name suggestion
  - Commit mode (from tyrex.yml or ask)
  - Quality strategy for this context
  - Skills: identify required skills, check if installed

[CHECKPOINT] User approves or modifies configuration.

CREATE feature spec in .tyrex/features/NNN-feature-name.md
CREATE branch (if mode = auto) or suggest (if mode = approve)
UPDATE cursor.yml
GENERATE documentation artifacts FIRST (ADR, RFC if configured)

[CHECKPOINT] If docs were generated, user reviews before proceeding.
```

### PHASE 3: Planning
```
READ feature spec
READ TYREX.md for project patterns
SCAN for available skills in:
  - .tyrex/skills/
  - .claude/skills/
  - .opencode/skills/
  - .agents/skills/
  - .cursor/rules/ (skill-like files)

GENERATE task list with:
  - Dependencies (depends_on, unlocks)
  - Parallelism markers (parallel: true/false)
  - Skill assignment per task
  - Quality strategy per task
  - File targets per task
  - IF relevant: add documentation tasks at the end (/tyrex-readme, /tyrex-openapi, /tyrex-wiki)

DISPLAY execution graph (waves)

[CHECKPOINT] User approves plan. Can add/remove/reorder tasks.

CREATE .tyrex/state/tasks/*.state files
UPDATE cursor.yml
UPDATE feature spec with tasks
```

### PHASE 4: Execution
```
LOOP until all tasks complete:
  
  IDENTIFY next executable tasks (dependencies satisfied)
  
  IF multiple parallel tasks available:
    [CHECKPOINT] "Tasks [N, M, P] can run in parallel. Execute in parallel or sequential?"
  
  FOR each task to execute:
    IF task has skill assigned:
      LOAD skill content
      IF skill not found:
        [CHECKPOINT] "Skill 'X' not installed. Create now, skip, or install?"
    
    UPDATE task state → in_progress
    UPDATE cursor.yml
    
    IMPLEMENT following quality strategy:
      IF strategy = "required": TDD mandatory, tests MUST pass
      IF strategy = "recommended": write tests, warn if skipped
      IF strategy = "optional": ask "Write tests? [y/N]"
    
    RUN tests (if applicable)
    RUN lint (if configured)
    RUN security scan (if configured)
    
    IF all checks pass:
      UPDATE CHANGELOG.md
      IF commit mode = "approve":
        [CHECKPOINT] Show diff + commit message. Wait for approval.
      IF commit mode = "auto":
        COMMIT automatically
      UPDATE task state → completed
      UPDATE cursor.yml
    
    IF checks fail:
      SHOW error to user
      FIX and retry (max 3 attempts)
      IF still failing:
        [CHECKPOINT] "Task failed after 3 attempts. Skip or debug?"
  
  CHECK for newly unlocked tasks → continue loop
```

### PHASE 5: Documentation (if configured)
```
IF /tyrex-readme was added as task: EXECUTE it
IF /tyrex-openapi was added as task: EXECUTE it
IF /tyrex-wiki was added as task: EXECUTE it

Each generates docs WITHOUT touching source code.
COMMIT documentation updates.
```

### PHASE 6: Review
```
READ review checklist from .tyrex/templates/review-checklist.md
CHECK all acceptance criteria
CHECK code quality
CHECK test coverage
CHECK security
CHECK documentation completeness

PRESENT review summary

[CHECKPOINT] User approves or requests changes.
IF changes requested: go back to PHASE 4 with fix tasks.

UPDATE TYREX.md if new patterns emerged
UPDATE feature status → done
UPDATE cursor.yml → clear active feature
FINAL COMMIT with any review updates
```

### PHASE 7: Handoff Complete
```
REPORT:
  - Feature summary
  - Files changed
  - Tests added
  - Documentation generated
  - Commits made
  - Next suggested action

"Handoff complete. The controls are yours again."
```

## FAILURE RECOVERY

If at ANY point the session is interrupted:
1. cursor.yml has the last known state
2. Task state files have individual task progress
3. Next session: read cursor.yml → resume from exact point
4. Tasks marked `in_progress` when session dropped → reset to `pending`

## WHAT THIS IS NOT

- This is NOT autonomous "go build everything". The human is still in control at every [CHECKPOINT].
- This is NOT vibe coding. Every step has verification.
- This is NOT a suggestion engine. Between checkpoints, the agent EXECUTES, not suggests.

The difference from normal Tyrex commands: handoff mode chains ALL phases automatically. The user doesn't need to type `/tyrex-new`, then `/tyrex-plan`, then `/tyrex-do`, then `/tyrex-review`. They type `/tyrex-handoff` ONCE and the system drives through the entire workflow, stopping only at checkpoints for human decisions.
