---
task_id: "046-003"
title: "Integrate session logging into tyrex-do"
feature_id: "046"
wave: 2
depends_on: ["046-001"]
quality: "recommended"
skill: "backend-engineer"
files:
  - "templates/commands/unified/tyrex-do.md"
relevant_files:
  - "templates/commands/shared/session-log.md"
  - "templates/commands/shared/execution-checklist.md"
  - "templates/commands/shared/context-monitor.md"
---

## Objective

Add session logging hooks to `/tyrex-do` at natural execution checkpoints.

## Integration Points

1. **Step 1 (Load context):** Create session file — `SESS-NNN.yml` with initial fields (session_id, feature_id, command, started_at, status: running)
2. **Step 3 (Build wave plan):** Log wave count, task count, execution mode
3. **Step 4 (Wave loop — wave entry):** Log wave start (wave number, tasks in wave)
4. **Step 4 Phase C (Task complete):** Log task result (task_id, status, files_changed, commit, context checkpoint)
5. **Step 4 (Wave complete):** Log wave end (finished_at)
6. **Step 4 (Context monitor check):** Capture context checkpoint data into session log
7. **Step 5 (Feature complete):** Finalize session (finished_at, duration_seconds, status, metrics summary). Update index.

## Implementation Approach

- Add a `## Session Logging` section referencing the shared algorithm
- Insert logging directives at each hook point (minimal — one line per hook)
- Session file is updated incrementally (not rewritten from scratch at the end)
- On failure/interruption: session status = "failed" or "interrupted", partial data preserved
