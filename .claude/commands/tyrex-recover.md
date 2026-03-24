---
description: "Recover from crashed session or resume from last session"
---

# /tyrex-recover - Crash Recovery & Session Resumption

You are the Tyrex Framework orchestrator. The user needs to recover from an abrupt session termination or resume a previous session.

This command **replaces** `/tyrex-resume`. Normal resume (no crash detected) is a fast-path within this command.

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

## Adaptive Decision Format

**ALL decisions in this command MUST use structured choices.** CLI agents: numbered choices. Chat agents: numbered list or direct question. Never open-ended questions when structured choices are possible.

**One question at a time.** Present a single structured choice, then STOP and wait.

## Behavior

### Step 1: Triage — Crash or Normal Resume?

Read these files (minimal reads for triage):
1. `.tyrex/state/cursor.yml` → `last_active_feature`, `last_action`, `last_updated`
2. Resolve feature via Feature Context Resolution → per-feature state file
3. Run `git status --porcelain` to check for uncommitted changes

**Evaluate crash signals** (same algorithm as `templates/commands/shared/crash-detection.md`):

| Signal | Condition |
|--------|-----------|
| `dirty_tree_stale_cursor` | Uncommitted changes AND `current_task_in_progress` is null AND `last_action` ≠ `feature_created`/`plan_approved` |
| `task_state_mismatch` | Task file says `in_progress` but per-feature state disagrees |
| `timestamp_drift` | `last_updated` older than newest uncommitted source file by > 5 minutes |

**Decision:**
- **No crash signals detected → go to Step 6 (Normal Resume)**
- **Crash signals detected → continue to Step 2 (Forensic Analysis)**

### Step 2: Forensic Analysis

Gather evidence from multiple sources:

1. **Git state:**
   - Current branch name → map to feature ID
   - `git diff --stat` → list of modified files with change counts
   - `git diff --cached --stat` → list of staged files
   - `git log -1 --format="%H %s %ai"` → last commit hash, message, date
   - `git stash list` → any stashed work from prior sessions

2. **Tyrex state:**
   - Per-feature state file → `current_task_in_progress`, `status`, `last_task_completed`, `tasks_summary`
   - Read all task state files in `.tyrex/state/features/NNN/tasks/` → find any with `status: in_progress`
   - Feature spec → task list with descriptions and file assignments

3. **Cross-reference — determine interrupted task:**
   - Match modified file paths against task `files` lists from the feature spec
   - Match modified file paths against `in_progress_files_touched` from per-feature state
   - If a task state file says `in_progress`, that's the interrupted task
   - If no task is `in_progress` but files match a `pending` task, that task likely started but state wasn't updated
   - If files don't match any task, flag as "unclassified changes"

4. **Estimate completion:**
   - Count files in the interrupted task's SPEC `Files Affected` list
   - Count how many of those files appear in the uncommitted changes
   - Completion % = (matched files / total files) * 100 (rough heuristic)

### Step 3: Diagnostic Summary

Present the forensic findings:

```
TYREX Recovery — Session Crash Detected
═══════════════════════════════════════

Feature:   [NNN] [feature name]
Branch:    [branch name]
Status:    [feature status]

Crash signals:
  • [signal description in plain language]

Interrupted task:  Task [M] — [description]
  Files changed:   [N] files ([list short names])
  Files staged:    [N] files
  Completion:      ~[X]% (estimated)

Last known state:
  Last commit:     [hash] — [message] ([time ago])
  Last action:     [action from cursor.yml]
  Tasks:           [completed]/[total] completed

Uncommitted changes:
  [file1.ext]  +[lines added] -[lines removed]
  [file2.ext]  +[lines added] -[lines removed]
  ...
```

### Step 4: User Choices for Uncommitted Changes

Present structured choices:

```
How do you want to handle the uncommitted changes?

  [1] Keep and continue — preserve changes, resume the interrupted task
  [2] Stash for later — git stash with descriptive message, start task fresh
  [3] Discard all — git checkout . (irreversible, requires confirmation)
```

**If user chooses 1 (Keep and continue):**
- Check if test infrastructure exists
- If yes: run tests silently to assess change quality
- Report: "Tests: [N passed, M failed]" or "No test infrastructure detected"
- Proceed to Step 5

**If user chooses 2 (Stash):**
- Run: `git stash push -m "tyrex-recover: feature NNN task M — [description]"`
- Report: "Changes stashed. You can restore them later with: git stash pop"
- Reset task state to `pending`
- Update cursor and per-feature state
- Proceed to Step 6 (Normal Resume) — start the task fresh

**If user chooses 3 (Discard):**
- Confirm: "This will permanently discard all uncommitted changes. Are you sure? [y/N]"
- If confirmed: run `git checkout .` and `git clean -fd` (only untracked files in task scope)
- Reset task state to `pending`
- Update cursor and per-feature state
- Proceed to Step 6 (Normal Resume)

### Step 5: Auto-Fix Assessment

After the user chose "Keep and continue", assess whether auto-completion is viable:

**Auto-fix conditions (ALL must be true):**
- Changes belong to exactly ONE task (not spread across multiple tasks)
- Tests pass (or no test infrastructure exists)
- The task's SPEC file exists and has a clear Technical Approach
- Estimated completion is > 50%

**If auto-fix is viable:**
```
Auto-completion appears viable for Task [M]:
  • Changes are coherent (single task)
  • Tests: [pass/no infra]
  • Completion: ~[X]%
  • SPEC is available

  [1] Auto-complete this task (agent continues from where it left off)
  [2] Resume manually (review changes first, then continue)
```

**If auto-fix is NOT viable** (explain why):
```
Auto-completion is not recommended:
  • [reason: e.g., "Changes span multiple tasks", "Tests failing: 3 failures", "Completion too low: ~20%"]

  [1] Resume manually — review changes and continue
  [2] Stash changes and start fresh
```

**If user chooses auto-complete:**
- Load the interrupted task's SPEC
- Load the skill (if assigned)
- Set `agent_mode: "build"`
- Continue implementation from the current state
- Follow the standard execution checklist (test → commit → state update)

**If user chooses manual resume:**
- Show the full diff of uncommitted changes
- Set the task to `in_progress` in state
- Set `agent_mode: "build"`
- Tell user: "You're now in the interrupted task. Review the changes and continue with /tyrex-do or make manual edits."

### Step 6: Normal Resume (No Crash Detected)

This path is identical to the old `/tyrex-resume` behavior:

1. **Read state** (minimal reads):
   - Per-feature state file (resolved above)
   - Active feature spec
   - `.tyrex/context/` — project-level context (if exists)
   - `.tyrex/features/NNN-context.md` — feature-level context (if exists)
   - `docs/specs/` — SPEC files for current tasks
   - `docs/srs/` and `docs/prd/` — SRS/PRD for the active feature (if exist)

2. **Display resume summary:**
   ```
   TYREX Resume
   ═══════════════════════════════════════

   Project:  [name from tyrex.yml]
   Last session: [timestamp from cursor.yml]
   Last action:  [action from cursor.yml]

   Active feature: [feature name]
   Progress:       [completed]/[total] tasks

   Last completed: Task [N] — [description]
   Last commit:    [hash] ([time])

   Next tasks:
     • Task [N]: [description] (ready)
     • Task [N]: [description] (ready, can parallel)
     • Task [N]: [description] (blocked by Task [X])

   Continue from where you left off? [Y/n]
   ```

3. **If user confirms:**
   - Load TYREX.md and constitution.md
   - Load context files (project + feature level)
   - Load SPEC, SRS, PRD for pending tasks
   - Pick up from next pending task using the execution checklist:
     1. **Load SPEC** — read the task's SPEC file from `docs/specs/`
     2. **Load skill** — if task has a `skill` attribute, read `.tyrex/skills/<name>.md`. Apply its persona during implementation.
     3. **Checkpoint: task start** — set `current_task_in_progress`, `in_progress_since`, `in_progress_files_touched: []` in per-feature state.
     4. **Implement following quality strategy:** `required` = TDD mandatory, `recommended` = tests alongside, `optional` = default to tests in `--auto`.
     5. **Checkpoint: files touched** — append each written file path to `in_progress_files_touched`.
     6. **Pre-commit sequence:**
        - Update task state to `completed`
        - Resolve audit findings (if security task)
        - Prepare conventional commit message
        - Update CHANGELOG (mandatory)
        - Version bump check (if CHANGELOG/ADR changed: detect manifest, suggest semver, auto-accept in `--auto`, propagate)
        - Run tests before commit (stack-agnostic detection)
        - Commit (auto in `--auto`, approval otherwise)
        - Checkpoint: task complete — clear recovery fields, update `last_task_completed`
        - Auto-update TYREX.md if macro docs generated
     7. **On failure:** clear checkpoints, mark `failed`. Retry up to 3x in `--auto`, or present fix/skip/stop choices.
     8. After each task, check for newly unlocked tasks and continue.
   - If parallel tasks were in progress when session ended, check state files for completion

4. **If user says no:**
   - Show `/tyrex-status` output and let them choose what to do

### Step 7: State Recovery (after any path)

After recovery or resume completes initial triage:

1. **Fix task states:**
   - Any task with `status: in_progress` that was NOT the recovered task → reset to `pending`
   - Update `tasks_summary` counts in per-feature state

2. **Update per-feature state file:**
   - `current_task_in_progress`: set to recovered task (or null if stash/discard)
   - `in_progress_since`: set to now (or null)
   - `in_progress_files_touched`: set from git diff (or empty)
   - `updated_at`: now

3. **Update cursor.yml:**
   - `last_active_feature`: feature ID
   - `last_action`: "recovered" (crash path) or "resumed" (normal path)
   - `last_updated`: now
   - `agent_mode`: set based on recovery context
   - `tasks_summary`: recalculated from task files

### Step 8: Handle Edge Cases

- **No active feature:** Show status and suggest `/tyrex-new`
- **Multiple features with uncommitted changes** (branch mismatch):
  ```
  Changes detected but current branch doesn't match the expected feature.
  Branch: [current branch] → Feature: [NNN]
  But uncommitted changes appear to belong to Feature: [MMM]

    [1] Recover Feature [NNN] (current branch)
    [2] Switch to Feature [MMM] branch first
    [3] Show all open features
  ```
- **Per-feature state file corrupted/missing:** Reconstruct from task files in `.tyrex/state/features/NNN/tasks/`
- **No per-feature state file AND no task files:** Fall back to cursor.yml legacy fields + feature spec
- **Git not available:** "Git is required for recovery forensics. Falling back to Tyrex state only."

## Important Rules
- NEVER silently discard uncommitted changes — always require user confirmation
- SPEED is priority for normal resume — read minimal files, display quickly
- Forensic analysis reads MORE files but only when crash is detected
- Do NOT re-read the entire codebase or re-analyze architecture
- Auto-fix requires ALL conditions met AND user confirmation — never auto-complete silently
- The per-feature state file IS the primary recovery point
- cursor.yml is the secondary recovery point (global pointer)
- Task state files are the tertiary recovery point (individual task status)
- If ALL state is lost, git log + branch name + feature spec can reconstruct enough to resume
- Recovery state transitions are atomic — cursor.yml updated ONLY after all recovery actions complete
