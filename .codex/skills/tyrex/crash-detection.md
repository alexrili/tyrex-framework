## Pre-flight: Crash Detection

**Include this section in every command that operates on features.** It detects abrupt session terminations by comparing git state against `.tyrex/` state.

### When to Include
Commands that read/write feature state: `/tyrex-do`, `/tyrex-plan`, `/tyrex-review`, `/tyrex-new`, `/tyrex-status`, `/tyrex-quick`, `/tyrex-evolve`, `/tyrex-settings`, `/tyrex-discuss`, `/tyrex-context`, `/tyrex-skills`.

Commands that do NOT need this: `/tyrex-recover` (IS the recovery), `/tyrex-init`, `/tyrex-help`, `/tyrex-readme`, `/tyrex-openapi`, `/tyrex-wiki`, `/tyrex-research`, `/tyrex-security-review`, `/tyrex-test-review`, `/tyrex-debug`, `/tyrex-handoff`.

### Detection Algorithm (must complete < 2 seconds)

**Step 1: Quick exit conditions** — skip detection entirely if:
- No `.tyrex/` directory exists (not a Tyrex project)
- No `cursor.yml` exists
- Current branch does NOT match `feat/*` or `feature/*` (no feature context)
- Working tree is clean (`git status --porcelain` returns empty)

If ALL quick exit conditions are false (i.e., dirty tree on a feature branch), proceed to Step 2.

**Step 2: Read state** (cursor.yml is already loaded by most commands):
- `cursor.yml` → `last_active_feature`, `last_action`, `last_updated`
- Identify feature ID from branch name (e.g., `feat/020-*` → feature 020)
- Read per-feature state file `.tyrex/state/features/NNN.yml` → `current_task_in_progress`, `status`

**Step 3: Evaluate crash signals** — a crash is detected if ANY of these are true:

| Signal | Condition | Meaning |
|--------|-----------|---------|
| `dirty_tree_stale_cursor` | Uncommitted changes exist AND `current_task_in_progress` is null AND `last_action` is NOT `feature_created` or `plan_approved` | Agent was coding but never updated state |
| `task_state_mismatch` | A task state file in `.tyrex/state/features/NNN/tasks/` shows `status: in_progress` AND per-feature state shows different or null `current_task_in_progress` | Task was running when session died |
| `timestamp_drift` | `cursor.yml` `last_updated` is older than the most recent uncommitted file modification time by more than 5 minutes AND there are uncommitted changes to source files (not just `.tyrex/` files) | Work happened after last state update |

**Step 4: Response**

- **No crash signals:** Proceed silently. Zero overhead for clean sessions.
- **Crash signals detected:** Present structured choices:
  ```
  ⚠ Inconsistent state detected — possible session crash.
  Signals: [list detected signals in plain language]

    [1] Run /tyrex-recover (recommended)
    [2] Continue anyway (state may be stale)
  ```
- **If `--auto` or `--auto-approve` flag is active:** Log the detection as a warning but continue anyway (the user chose automation — don't block). Add a note: "Crash signals detected but continuing due to --auto flag. Run /tyrex-recover manually if needed."

### Important Rules
- Detection MUST be lightweight — no deep file scanning, no test runs
- NEVER auto-recover — always present the choice (except in --auto mode)
- NEVER block the command — the user can always choose to continue
- False positives are acceptable (user manually edited files) — the user can dismiss
- Do NOT read task SPEC files or run git diff during detection — only porcelain status and state files
