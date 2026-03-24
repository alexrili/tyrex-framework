# SRS: Tyrex Recover (Crash Recovery & Session Resumption)

## Feature
Feature 020 — Tyrex Recover

## Date
2026-03-24

## Project
tyrex-framework

## 1. System Context
This feature replaces `/tyrex-resume` with `/tyrex-recover`, a forensic recovery command that reconstructs session state from evidence (git diff, branch, `.tyrex/` state files) rather than trusting `cursor.yml` alone. It also adds crash detection to all `/tyrex-*` commands as a pre-flight check.

Components involved:
- `templates/commands/unified/tyrex-recover.md` — new command (replaces tyrex-resume.md)
- `templates/commands/shared/crash-detection.md` — shared pre-flight check for all commands
- `.tyrex/state/cursor.yml` — recovery updates cursor to reflect true state
- `.tyrex/state/features/NNN.yml` — per-feature state cross-referenced during forensics
- `.tyrex/state/features/NNN/tasks/task-NNN.yml` — task state files for progress detection
- All `templates/commands/unified/tyrex-*.md` — add crash detection pre-flight

## 2. Functional Requirements

FR-001: The system shall detect crash signals by comparing git working tree state against `.tyrex/` cursor and task states.

FR-002: Crash signals are: (a) uncommitted changes on a `feat/*` branch with `cursor.yml` showing no `in_progress` task, (b) task state file showing `in_progress` but cursor showing `completed` or different task, (c) `last_updated` timestamp in cursor older than modified files in working tree.

FR-003: When crash is detected via any `/tyrex-*` command, the system shall present: "Inconsistent state detected. Run /tyrex-recover or continue anyway?"

FR-004: `/tyrex-recover` shall perform forensic analysis in this order: (1) read cursor.yml, (2) identify active branch and map to feature, (3) git diff to list uncommitted changes, (4) read feature and task state files, (5) cross-reference to determine interrupted task.

FR-005: The system shall classify uncommitted changes by mapping modified file paths to task descriptions in the feature spec.

FR-006: The system shall present uncommitted changes with structured choices: (a) keep and continue, (b) stash for later, (c) discard.

FR-007: When the user chooses "keep and continue", the system shall run tests (if test infrastructure exists) and report results before offering next steps.

FR-008: The system shall attempt auto-completion when: changes are coherent (belong to one task), tests pass, and the task spec is clear. Auto-completion requires user confirmation.

FR-009: The system shall display a diagnostic summary: feature name, interrupted task, files changed, files staged, test status, estimated completion percentage.

FR-010: After recovery, the system shall update `cursor.yml` to reflect the true recovered state (active feature, current task, agent mode).

FR-011: Normal resume (no crash detected) shall work identically to the current `/tyrex-resume` — read cursor, display status, offer to continue.

FR-012: The crash detection pre-flight shall be lightweight (< 2 seconds) and shall not block commands if no crash is detected.

FR-013: The system shall handle the case where multiple features have uncommitted changes (branch mismatch) by asking the user which feature to recover.

## 3. Non-Functional Requirements

NFR-001: Crash detection pre-flight must complete in under 2 seconds for repositories up to 10,000 files.

NFR-002: Recovery must never silently discard uncommitted changes — always require user confirmation.

NFR-003: The command must work without network access (all forensics are local).

NFR-004: Recovery state transitions must be atomic — cursor.yml is updated only after all recovery actions complete.

## 4. Data Model

### Crash Signal Detection (computed, not stored)
```yaml
crash_detected: true|false
signals:
  - type: "dirty_tree_stale_cursor"
    description: "Uncommitted changes but cursor shows no in_progress task"
  - type: "task_state_mismatch"
    description: "Task file says in_progress, cursor says completed"
  - type: "timestamp_drift"
    description: "Working tree newer than cursor.last_updated"
evidence:
  branch: "feat/020-tyrex-recover"
  feature_id: "020"
  uncommitted_files: ["file1.js", "file2.md"]
  staged_files: []
  probable_task: "task-003"
  cursor_last_updated: "2026-03-24T10:00:00Z"
  newest_file_mtime: "2026-03-24T10:45:00Z"
```

## 5. Error Handling

- No `.tyrex/` directory: "This project is not initialized with Tyrex. Run `tyrex init` first."
- No active branch matching `feat/*`: "No Tyrex feature branch detected. Nothing to recover."
- Git not available: "Git is required for recovery forensics."
- Conflicting signals (multiple features dirty): present choice to user
- Empty diff (clean tree): fall back to normal resume behavior
