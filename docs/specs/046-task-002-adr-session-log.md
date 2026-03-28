---
task_id: "046-002"
title: "ADR-022 — Session log estruturado"
feature_id: "046"
wave: 1
depends_on: []
quality: "optional"
skill: null
files:
  - "docs/adrs/ADR-022-session-log.md"
relevant_files:
  - "docs/adrs/ADR-017-wave-execution.md"
  - "docs/adrs/ADR-018-context-monitor.md"
  - ".tyrex/features/046-session-log.md"
---

## Objective

Document the architectural decision for structured session logging.

## Key Points to Cover

- Context: EP-008 Observabilidade — need structured execution data
- Decision: YAML session logs in `.tyrex/metrics/sessions/`, index in `metrics/index.yml`
- Data format: YAML (consistent with EP-009 direction — API-ready data)
- Scope: tyrex-do and tyrex-quick generate logs; tyrex-status consumes
- Session ID: auto-increment from index (SESS-001, SESS-002, ...)
- Rationale: structured data enables future BL-035 (execution report), BL-036 (quality scorecard), BL-037 (context tracking)
- Alternatives considered: JSON (less human-readable), SQLite (dependency), append-only event log (BL-044 scope)
