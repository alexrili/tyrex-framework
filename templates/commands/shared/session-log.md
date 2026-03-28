# Session Log

> Shared algorithm for creating, updating, and finalizing structured session logs.
> Referenced by: `/tyrex-do`, `/tyrex-quick`, `/tyrex-recover`

## Purpose

Tracks execution sessions with structured YAML files so that metrics, recovery, and post-mortem analysis have reliable data. Each invocation of `/tyrex-do` or `/tyrex-quick` produces exactly one session file.

## Session Lifecycle

Every session goes through three phases:

1. **Create** — at execution start, generate a session file with initial metadata and `status: running`.
2. **Update** — incrementally during execution, append wave/task entries and context checkpoints.
3. **Finalize** — at execution end, calculate duration, set final status, compute metrics summary, update index.

## Session ID Generation

**Step 1:** Read `.tyrex/metrics/index.yml`.
- If the file does not exist, create it with `last_session_id: 0` and an empty `sessions` array.
- If the `.tyrex/metrics/sessions/` directory does not exist, create it.

**Step 2:** Increment `last_session_id` by 1.

**Step 3:** Format as `SESS-NNN` (zero-padded to 3 digits).
- Example: `last_session_id: 0` produces `SESS-001`, then `SESS-002`, etc.

**Step 4:** Write the new `last_session_id` value back to `index.yml` immediately (before session file creation) to avoid ID collisions.

## Session File Schema

File: `.tyrex/metrics/sessions/SESS-NNN.yml`

```yaml
session_id: "SESS-NNN"
feature_id: NNN
command: "tyrex-do" | "tyrex-quick"
branch: "feat/NNN-slug"
execution_mode: "fresh" | "inline"
started_at: "2026-03-28T15:30:00Z"
finished_at: "2026-03-28T16:15:00Z"
duration_seconds: 2700
status: "running" | "completed" | "failed" | "interrupted"

waves:
  - wave: 1
    tasks_count: 2
    parallel: true
    started_at: "ISO 8601"
    finished_at: "ISO 8601"

tasks:
  - task_id: "046-001"
    wave: 1
    started_at: "ISO 8601"
    finished_at: "ISO 8601"
    status: "completed" | "failed" | "skipped"
    files_changed: 3
    commit: "abc1234"
    retries: 0
    context_checkpoint:
      estimated_pct: 45
      threshold: "ok" | "warning" | "critical"

# Only present in tyrex-quick sessions
verify:
  deliverables_total: N
  passed: N
  failed: N
  skipped: N

# Only present in tyrex-quick sessions
review:
  findings_total: N
  critical: N
  high: N
  medium: N
  low: N
  accepted: true | false

metrics:
  total_tasks: N
  completed: N
  failed: N
  retries: N
  waves_count: N
  files_changed: N
  commits: N
  version_bump: "1.28.0 → 1.29.0" | null
```

**Field notes:**
- `status` starts as `"running"` at creation. Set to `"completed"` or `"failed"` at finalization.
- `finished_at` and `duration_seconds` are `null` until finalization.
- `verify` and `review` blocks are only present for `tyrex-quick` sessions (which include verification and review phases).
- `metrics` block is computed at finalization from the `tasks` and `waves` arrays.

## Index Schema

File: `.tyrex/metrics/index.yml`

```yaml
last_session_id: 3
sessions:
  - id: "SESS-001"
    feature_id: 44
    command: "tyrex-quick"
    started_at: "2026-03-26T14:00:00Z"
    status: "completed"
    tasks_completed: 3
    tasks_total: 3
    duration_seconds: 2100
  - id: "SESS-002"
    feature_id: 44
    command: "tyrex-do"
    started_at: "2026-03-27T09:00:00Z"
    status: "completed"
    tasks_completed: 5
    tasks_total: 5
    duration_seconds: 3600
```

The index provides a lightweight summary for `/tyrex-status` and dashboards without reading individual session files.

## Hook Points

Commands that integrate session logging must call these hooks at the specified points.

### session_start

**When:** `/tyrex-do` Step 1 (before first wave) or `/tyrex-quick` Step 3c (before execution).

**Actions:**
1. Generate session ID (see Session ID Generation above)
2. Create `.tyrex/metrics/sessions/SESS-NNN.yml` with:
   - `session_id`, `feature_id`, `command`, `branch`, `execution_mode`
   - `started_at` set to current ISO 8601 timestamp
   - `status: "running"`
   - Empty `waves`, `tasks`, and `metrics` sections

### wave_start

**When:** Before dispatching tasks in a wave.

**Actions:**
1. Append entry to `waves` array:
   - `wave` number, `tasks_count`, `parallel` flag, `started_at` timestamp
   - `finished_at: null`

### task_start

**When:** Before executing a task (or dispatching to sub-agent).

**Actions:**
1. Append entry to `tasks` array:
   - `task_id`, `wave` number, `started_at` timestamp
   - `status: "running"`, `retries: 0`
   - All other fields `null`

### task_end

**When:** After task completes (success or failure).

**Actions:**
1. Update the task entry:
   - `finished_at` timestamp
   - `status`: `"completed"`, `"failed"`, or `"skipped"`
   - `files_changed`: count of files modified by the task
   - `commit`: short SHA of the task commit (or `null` if no commit)
   - `retries`: number of retry attempts (0 if succeeded first try)
2. Run context monitor estimation (see `context-monitor.md`) and record:
   - `context_checkpoint.estimated_pct`: current context usage estimate
   - `context_checkpoint.threshold`: `"ok"` (< 50%), `"warning"` (50-85%), `"critical"` (>= 85%)

### wave_end

**When:** After all tasks in a wave complete.

**Actions:**
1. Update the wave entry: set `finished_at` timestamp

### session_end

**When:** After all waves complete, or on failure/interruption.

**Actions:**
1. Set `finished_at` to current ISO 8601 timestamp
2. Calculate `duration_seconds` from `started_at` to `finished_at`
3. Set `status`:
   - `"completed"` — all tasks completed successfully
   - `"failed"` — one or more tasks failed and execution stopped
4. Compute `metrics` block from `tasks` array:
   - `total_tasks`: length of tasks array
   - `completed`: count where status is `"completed"`
   - `failed`: count where status is `"failed"`
   - `retries`: sum of all task retries
   - `waves_count`: length of waves array
   - `files_changed`: sum of all task `files_changed`
   - `commits`: count of non-null commit entries
   - `version_bump`: read from version bump hook output, or `null`
5. For `tyrex-quick` sessions, populate `verify` and `review` blocks from the verification and review phase results
6. Update `.tyrex/metrics/index.yml`:
   - Append session summary to `sessions` array
   - Keep `last_session_id` as-is (already set during session_start)

## Error Handling

**On task failure:**
- Record the failed task with `status: "failed"` in the session file
- Continue to session_end — do NOT leave the session file incomplete

**On execution failure (fatal):**
- Run session_end with `status: "failed"`
- Partial data (completed waves/tasks) is preserved
- Index is always updated, even on failure

**On interruption (session crash, agent dies):**
- The session file retains `status: "running"` (never finalized)
- `/tyrex-recover` detects this: any session with `status: "running"` and no `finished_at` is a crashed session
- Recovery can resume from the last completed task or finalize the session as `"interrupted"`

**On missing metrics directory:**
- Any hook that writes to `.tyrex/metrics/` must ensure the directory exists first
- Create `.tyrex/metrics/` and `.tyrex/metrics/sessions/` as needed — never fail on missing directories

## Integration Points

- **`/tyrex-do`:** Call `session_start` before first wave. Call `wave_start`/`wave_end` around each wave. Call `task_start`/`task_end` around each task. Call `session_end` after all waves or on failure.
- **`/tyrex-quick`:** Same as `/tyrex-do` but also populates `verify` and `review` blocks during session_end.
- **`/tyrex-recover`:** Scan for sessions with `status: "running"` to detect crashed sessions. On resume, create a NEW session (do not reuse the crashed one). On finalize-only, set crashed session to `"interrupted"`.
- **`/tyrex-status`:** Read `index.yml` to show session history. Read latest session file for detailed metrics.
