---
description: "Resume from last session"
---

# /tyrex-resume - Resume from last session

You are the Tyrex Framework orchestrator. The user lost their session and is resuming.

## Agent Mode

This command inherits the `agent_mode` from the command it resumes into. Read `cursor.yml` to determine the last action and set the appropriate mode:
- If resuming into `/tyrex-do`: set `agent_mode: "build"`
- Otherwise: set `agent_mode: "plan"`

## Feature Context Resolution

**This command resumes work on a feature.** Resolve the feature using this order:
1. `--feature NNN` flag (if provided)
2. Branch name detection: `feat/NNN-*` or `feature/NNN-*` → extract NNN
3. Fallback: `last_active_feature` from `cursor.yml`
4. No feature found: show all open features and let user pick

Read the per-feature state file `.tyrex/state/features/NNN.yml` for recovery data.

## Behavior

### Step 0: Git consistency check
Resolve feature via Feature Context Resolution. Read the per-feature state file `.tyrex/state/features/NNN.yml` — extract `last_commit` and `current_task_in_progress`. Verify the git history matches `last_commit`. If not, warn the user about potential divergence before proceeding.

### Step 1: Quick state recovery
Read ONLY these files (minimal token usage):
1. `.tyrex/state/features/NNN.yml` — the per-feature state file (resolved above)
2. The active feature spec (if any)
3. `.tyrex/context/` — project-level context files (if directory exists)
4. `.tyrex/features/NNN-context.md` — feature-level context for the active feature (if exists)
5. Existing documentation for the active feature (if any):
   - `docs/specs/` — SPEC files for current tasks
   - `docs/srs/` — SRS for the active feature
   - `docs/prd/` — PRD for the active feature

Do NOT read the entire codebase. Do NOT re-analyze the project. The cursor has everything you need. Context and documentation files provide continuity across sessions.

### Step 2: Display resume summary

```
TYREX Resume
═══════════════════════════════════════

Project: [name from tyrex.yml]
Last session: [timestamp from cursor.yml]
Last action: [action from cursor.yml]

Active feature: [feature name]
Progress: [completed]/[total] tasks

Last completed: Task [N] - [description]
Last commit: [hash] ([time])

Next tasks:
  - Task [N]: [description] (ready)
  - Task [N]: [description] (ready, can parallel)
  - Task [N]: [description] (blocked by Task [X])

Continue from where you left off? [Y/n]
```

### Step 3: Resume
If the user confirms:
- Load TYREX.md and constitution.md (for context)
- Load project-level context from `.tyrex/context/` and feature-level context from `.tyrex/features/NNN-context.md`
- Load SPEC files for pending tasks, SRS and PRD for the active feature
- Continue as if `/tyrex-do` was called — pick up from the next pending task
- If there were parallel tasks in progress when the session ended, check their state files to see if any completed

If the user says no:
- Show `/tyrex-status` and let them choose what to do

### Step 4: Handle edge cases
- **Tasks were in_progress when session ended:** Mark them as `pending` again (they didn't complete)
- **Per-feature state file is corrupted or missing:** Fall back to reading all task state files in `.tyrex/state/features/NNN/tasks/` to reconstruct state
- **No active feature:** Show status and suggest `/tyrex-new`

## Important Rules
- SPEED is the priority here — read minimal files, display quickly
- Do NOT re-read the entire codebase
- Do NOT re-analyze architecture
- The per-feature state file IS the recovery point — cursor.yml only tracks agent mode and the last active feature pointer
- If the per-feature state file has `in_progress` tasks, they need to be restarted (session ended = incomplete)
