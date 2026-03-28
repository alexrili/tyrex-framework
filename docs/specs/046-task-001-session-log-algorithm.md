---
task_id: "046-001"
title: "Session log shared algorithm + YAML template"
feature_id: "046"
wave: 1
depends_on: []
quality: "recommended"
skill: "backend-engineer"
files:
  - "templates/commands/shared/session-log.md"
relevant_files:
  - "templates/commands/shared/context-monitor.md"
  - "templates/commands/shared/execution-checklist.md"
  - ".tyrex/tyrex.yml"
---

## Objective

Create a shared algorithm that any command can reference to generate structured session logs.
Also create the YAML schema/template for SESS-NNN.yml files.

## Requirements

1. **Shared algorithm** (`templates/commands/shared/session-log.md`):
   - Instructions for when/how to create a session log
   - Session ID generation: auto-increment from index (SESS-001, SESS-002, ...)
   - Directory: `.tyrex/metrics/sessions/`
   - Index: `.tyrex/metrics/index.yml`
   - Lifecycle: create at session start, update during execution, finalize at session end
   - Hook points: session start, task start/end, wave start/end, commit, context checkpoint, session end
   - Index update algorithm: read index, append new session entry, write back

2. **Session YAML schema** (documented in the algorithm file):
   ```yaml
   session_id: "SESS-NNN"
   feature_id: NNN
   command: "tyrex-do" | "tyrex-quick"
   branch: "feat/NNN-slug"
   execution_mode: "fresh" | "inline"
   started_at: "ISO 8601"
   finished_at: "ISO 8601"
   duration_seconds: N
   status: "completed" | "failed" | "interrupted"

   waves:
     - wave: 1
       tasks_count: N
       parallel: true|false
       started_at: "ISO 8601"
       finished_at: "ISO 8601"

   tasks:
     - task_id: "NNN-MMM"
       wave: N
       started_at: "ISO 8601"
       finished_at: "ISO 8601"
       status: "completed" | "failed" | "skipped"
       files_changed: N
       commit: "hash"
       retries: N
       context_checkpoint:
         estimated_pct: N
         threshold: "ok" | "warning" | "critical"

   metrics:
     total_tasks: N
     completed: N
     failed: N
     retries: N
     waves_count: N
     files_changed: N
     commits: N
     version_bump: "old → new" | null
   ```

3. **Index schema** (`.tyrex/metrics/index.yml`):
   ```yaml
   last_session_id: N
   sessions:
     - id: "SESS-NNN"
       feature_id: NNN
       command: "tyrex-do"
       started_at: "ISO 8601"
       status: "completed"
       tasks_completed: N
       tasks_total: N
   ```

## Acceptance Criteria

- Shared algorithm file exists at `templates/commands/shared/session-log.md`
- YAML schema is complete and documented
- Index update algorithm is defined
- Session ID auto-increment is specified
- All timestamps use ISO 8601
- Algorithm is self-contained (any command can reference it)
