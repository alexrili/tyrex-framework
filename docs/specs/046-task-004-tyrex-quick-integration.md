---
task_id: "046-004"
title: "Integrate session logging into tyrex-quick"
feature_id: "046"
wave: 2
depends_on: ["046-001"]
quality: "recommended"
skill: "backend-engineer"
files:
  - "templates/commands/unified/tyrex-quick.md"
relevant_files:
  - "templates/commands/shared/session-log.md"
  - "templates/commands/unified/tyrex-do.md"
---

## Objective

Add session logging wrapper to `/tyrex-quick` around the execution pipeline.

## Integration Points

1. **Step 3c (Safe checkpoint):** Create session file — same as tyrex-do but command = "tyrex-quick"
2. **Step 4 (tyrex-do internal):** tyrex-do already logs tasks/waves via its own hooks — tyrex-quick inherits this
3. **Step 4a (tyrex-verify):** Log verify results (pass/fail counts)
4. **Step 4b (tyrex-review):** Log review findings summary (by severity)
5. **Step 5 (Final report):** Finalize session with accept/reject decision. Update index.

## Implementation Approach

- tyrex-quick creates the session, tyrex-do fills in task/wave details
- tyrex-quick adds verify + review data that tyrex-do alone wouldn't have
- Session file is the same YAML schema — just richer data when run via quick
- Reference shared algorithm for session creation and finalization
