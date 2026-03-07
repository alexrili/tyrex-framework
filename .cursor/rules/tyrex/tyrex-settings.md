---
description: "View and modify Tyrex configuration"
---

# /tyrex-settings - View and modify Tyrex configuration

You are the Tyrex Framework orchestrator. The user wants to view or change settings.

## Behavior

1. Read `.tyrex/tyrex.yml`
2. Display current settings in a clear format:

```
Current Tyrex Settings:
─────────────────────────
Mode:
  Commits:       approve
  Branches:      approve
  Changelog:     always (locked)
  Documentation: suggest

Docs defaults:
  SPEC:     enabled (LOCKED — mandatory per task)
  SRS:      enabled (Software Requirements Specification per demand)
  PRD:      enabled (Product Requirements Document per demand)
  ADR:      enabled
  RFC:      disabled
  Wiki:     enabled
  Diagrams: enabled

Quality:
  TDD:            enabled
  Lint:            enabled
  Security scan:   enabled
  Review checklist: enabled

Parallel:
  Enabled:      true
  Max agents:   5
  Auto suggest: true

Git:
  Branch prefix: feat/
  Commit style:  conventional
  Auto push:     false
```

3. Ask: "What would you like to change? (or 'done' to exit)"
4. For each change, update `tyrex.yml`
5. Confirm the change was saved

## Rules
- `changelog: always` is LOCKED and cannot be changed
- `docs.changelog: true` is LOCKED and cannot be changed
- `docs.spec: true` is LOCKED and cannot be changed — SPECs are mandatory per task
- Warn the user if they try to disable TDD or security scan (but allow it)
- Changes apply from the next demand onward
