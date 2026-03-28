---
task_id: "046-005"
title: "Add Recent Sessions section to tyrex-status"
feature_id: "046"
wave: 2
depends_on: ["046-001"]
quality: "recommended"
skill: "backend-engineer"
files:
  - "templates/commands/unified/tyrex-status.md"
relevant_files:
  - "templates/commands/shared/session-log.md"
  - ".tyrex/tyrex.yml"
---

## Objective

Add a "Recent Sessions" section to `/tyrex-status` that consumes session logs.

## Integration Points

1. **Step 1 (Gather data):** Read `.tyrex/metrics/index.yml` for session list
2. **Step 2 (Comprehensive status):** Add "Recent Sessions" section after active feature detail

## Output Format

```
─── Recent Sessions ────────────────────────────────────
  SESS-003 — 2026-03-28 15:30 — Feature 046 (tyrex-quick)
    Tasks: 5/5 completed | Duration: 45min | Status: completed
  SESS-002 — 2026-03-27 10:00 — Feature 045 (tyrex-do)
    Tasks: 2/2 completed | Duration: 20min | Status: completed
  SESS-001 — 2026-03-26 14:00 — Feature 044 (tyrex-quick)
    Tasks: 3/3 completed | Duration: 35min | Status: completed
```

- Show last 5 sessions (configurable later)
- If no sessions exist: show "No sessions recorded yet"
- If index file missing: skip section silently
