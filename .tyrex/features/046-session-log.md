---
id: "046"
title: "Session Log Estruturado"
status: "spec"
branch: "feat/046-session-log"
epic: "EP-008"
backlog_item: "BL-034"
created: "2026-03-28"
acceptance_criteria:
  - "SESS-NNN.yml generated automatically by /tyrex-do and /tyrex-quick"
  - "Fields: session_id, feature_id, started_at, finished_at, duration_seconds"
  - "Tasks log: task_id, wave, started_at, finished_at, status, files_changed, commit"
  - "Metrics: total_tasks, completed, failed, retries, waves_count"
  - "Context checkpoints: estimated_pct at each task/wave boundary"
  - "Index file (metrics/index.yml) updated with each new session"
  - "/tyrex-status consumes and shows recent session summary"
---

## Objective

Add structured session logging to execution commands (/tyrex-do, /tyrex-quick).
Each execution session generates a YAML log file in `.tyrex/metrics/sessions/`
with timestamps, task details, wave info, and context estimation checkpoints.
An index file enables quick lookup without scanning all session files.

## Technical Notes

- Session files: `.tyrex/metrics/sessions/SESS-NNN.yml`
- Index file: `.tyrex/metrics/index.yml`
- Session ID = auto-increment from index (SESS-001, SESS-002, ...)
- Timestamps: ISO 8601 format
- Duration: calculated from started_at/finished_at
- Context checkpoints: capture estimated_pct from context monitor
- Commands that generate sessions: tyrex-do, tyrex-quick
- Command that consumes sessions: tyrex-status
- Data format: YAML (consistent with EP-009 direction)

## Out of Scope

- Execution report generation (BL-035)
- Quality scorecards (BL-036)
- Real context usage tracking (BL-037)
- API exposure of session data
- Session log rotation or cleanup
