---
description: "Resume from last session"
---

# /tyrex-resume - Resume from last session

You are the Tyrex Framework orchestrator. The user lost their session and is resuming.

## Agent Mode

This command inherits the `agent_mode` from the command it resumes into. Read `cursor.yml` to determine the last action and set the appropriate mode:
- If resuming into `/tyrex-do`: set `agent_mode: "build"`
- Otherwise: set `agent_mode: "plan"`

## Adaptive Decision Format

**ALL decisions in this command MUST use structured choices** adapted to the agent's interface. CLI agents (Claude Code, OpenCode): numbered choices where the user types a number. Chat-based agents (Cursor, Codex): numbered list or direct question where the user responds naturally. Never ask open-ended questions when structured choices are possible.

**One question at a time.** Present a single structured choice, then STOP and wait for the user's response before proceeding to the next question. Never combine multiple choice blocks in one message.

## Behavior

### Step 0: Git consistency check (Layer 1)

**Before trusting cursor.yml, verify the git state matches the recorded state.**

1. Read `.tyrex/state/cursor.yml` — extract `last_commit` and `current_task_in_progress` (if present)
2. Run these git commands to detect inconsistency:
   - `git log --oneline <last_commit>..HEAD` — commits the cursor doesn't know about
   - `git status --porcelain` — uncommitted changes (staged + unstaged + untracked in project dirs)
   - `git diff --stat` — summary of unstaged changes
3. **Evaluate consistency:**

   **Case A: Clean — no extra commits, no dirty files**
   - Cursor and git are in sync. Proceed to Step 1.

   **Case B: Untracked commits only — commits exist after `last_commit` but no dirty files**
   - The session committed work but died before updating cursor.yml.
   - Show:
     ```
     TYREX Resume — Inconsistency Detected
     ═══════════════════════════════════════

     Cursor says:  last_commit=<hash>, last_task=<task_id>
     Git shows:    <N> commit(s) ahead of cursor

     Untracked commits:
       <hash> <message>
       <hash> <message>

     The session likely committed successfully but died before updating state.

       [1] Reconcile — analyze commits and update cursor to match git
       [2] Inspect — show full diffs before deciding
       [3] Ignore — trust cursor.yml as-is and continue
     ```

   **Case C: Dirty working tree — uncommitted changes exist**
   - The session was mid-implementation when it died.
   - Show:
     ```
     TYREX Resume — Uncommitted Changes Detected
     ═══════════════════════════════════════

     Cursor says:  last_commit=<hash>, last_task=<task_id>
     Git shows:    <N> uncommitted file(s)

     Uncommitted changes:
       M <file_path>
       M <file_path>
       ? <file_path>

       [1] Reconcile — analyze changes and decide per-task (Recommended)
       [2] Inspect — show full diffs before deciding
       [3] Stash — stash changes and resume from cursor state
       [4] Discard — discard all uncommitted changes (destructive)
     ```

   **Case D: Both — untracked commits AND dirty files**
   - Combine Cases B and C: show both, offer reconciliation.

4. **Reconciliation logic (when user chooses [1] Reconcile):**
   - For untracked commits: read commit messages and changed files, match them to pending/in_progress tasks by comparing `files_changed` with task file lists. Update matched tasks to `completed`, update cursor.yml `last_commit` and `last_task_completed`.
   - For dirty files: proceed to Step 0b (Layer 3 — intelligent reconciliation).

### Step 0b: Intelligent reconciliation (Layer 3)

**When uncommitted changes exist and the user chose to reconcile:**

1. **Check checkpoint fields in cursor.yml:**
   - If `current_task_in_progress` is set: we know exactly which task was running.
   - If `in_progress_files_touched` is set: we know which files the task intended to modify.
   - If neither is set: the session died before the `/tyrex-do` checkpoint was written — fall back to heuristic matching (compare dirty files against pending task file lists).

2. **Cross-reference files:**
   - Compare `in_progress_files_touched` (from cursor.yml) with `git diff --name-only` (actual dirty files).
   - **Files match** = the changes are likely from the in-progress task.
   - **Extra files in git** = unexpected changes (manual edits? different task?).
   - **Missing files from checkpoint** = task didn't finish writing all files.

3. **Stack-agnostic test runner detection:**
   Scan the project root for known manifest files and extract the test command. Check in this order (first match wins):

   | Manifest File | How to detect test command |
   |---------------|--------------------------|
   | `package.json` | Read `scripts.test` — if it exists and is not the default `echo "Error: no test specified" && exit 1`, use it (run via `npm test` or `yarn test` based on lockfile presence) |
   | `pyproject.toml` | Check for `[tool.pytest]` or `[tool.pytest.ini_options]` section → `pytest`; or check `[project.scripts]` for a test entry |
   | `Makefile` / `GNUmakefile` | Check for a `test:` target → `make test` |
   | `Cargo.toml` | Rust project → `cargo test` |
   | `go.mod` | Go project → `go test ./...` |
   | `mix.exs` | Elixir project → `mix test` |
   | `build.gradle` / `build.gradle.kts` | Gradle project → `./gradlew test` |
   | `pom.xml` | Maven project → `mvn test` |
   | `Gemfile` | Ruby project → check for `rake` task: `bundle exec rake test` or `bundle exec rspec` |
   | `composer.json` | Check `scripts.test` → `composer test`; or check for `phpunit.xml` → `./vendor/bin/phpunit` |
   | `CMakeLists.txt` | C/C++ project → `ctest` (if build dir exists) |
   | `deno.json` / `deno.jsonc` | Deno project → `deno test` |
   | `bun.lockb` | Bun project → `bun test` |

   - If **multiple manifests** exist: prefer the one matching the project's primary stack (check TYREX.md `## Tech Stack` if available).
   - If **no test command** is detected: note it and skip test validation.
   - **Security:** The test command is read from the project's own manifest and trusted as project-owned. In non-`--auto-approve` mode, display the exact command before running.

4. **Decision matrix:**

   | Files match checkpoint? | Tests pass? | Action |
   |------------------------|-------------|--------|
   | Yes | Yes | **Auto-complete:** commit the changes, mark task as `completed`, update cursor.yml. Show: "Task [X] recovered — changes committed." |
   | Yes | Fail | **Show context:** display test failures, ask user: `[1] Fix and complete` / `[2] Reset task to pending` / `[3] Stash and skip` |
   | Yes | No test runner | **Ask user:** `[1] Commit as-is (trust the changes)` / `[2] Inspect changes first` / `[3] Reset task to pending` |
   | Partial match | Any | **Show context:** display which files match and which don't. Ask: `[1] Inspect all changes` / `[2] Reset task to pending` / `[3] Stash and start fresh` |
   | No match / no checkpoint | Any | **Heuristic mode:** compare dirty files against all pending task file lists. If a match is found, suggest it. Otherwise ask: `[1] Inspect changes` / `[2] Stash changes` / `[3] Discard changes` |

5. **For parallel wave recovery** (when `current_task_in_progress: "parallel-wave"`):
   - Read `in_progress_parallel_tasks` from cursor.yml
   - Check each task's state file: some sub-agents may have completed
   - For completed sub-tasks: validate and commit
   - For incomplete sub-tasks: check if their files are in the dirty tree, apply the same decision matrix per task
   - Show a summary: "Parallel wave: 2/3 tasks completed, 1 needs recovery"

### Step 1: Quick state recovery

Read ONLY these files (minimal token usage):
1. `.tyrex/state/cursor.yml` — the session pointer (already read in Step 0)
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
Recovery: [Clean | Reconciled N commits | Recovered task X | N issues found]

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
- **Tasks were in_progress when session ended:** If NOT recovered in Step 0b, mark them as `pending` again (they didn't complete)
- **Cursor.yml is corrupted or missing:** Fall back to reading all task state files to reconstruct state
- **No active feature:** Show status and suggest `/tyrex-new`
- **`last_commit` hash not found in git:** The branch may have been rebased or force-pushed. Fall back to `git log --oneline -10` to show recent history and ask the user to identify the recovery point.

## Important Rules
- SPEED is the priority here — read minimal files, display quickly
- Do NOT re-read the entire codebase
- Do NOT re-analyze architecture
- Git is the ultimate source of truth — cursor.yml is the fast-path, git is the verification layer
- If cursor.yml has `in_progress` tasks, they need to be evaluated via Layer 3 before blindly resetting
- The test command is detected from the project's own manifest files — NEVER hardcode a test command for a specific language or framework
- Always present structured choices for recovery decisions — never auto-discard or auto-rollback without user consent
- The `[Discard]` option must always warn that it is destructive and irreversible
