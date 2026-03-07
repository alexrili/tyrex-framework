---
description: "Show current project status"
---

# /tyrex-status - Show current project status

You are the Tyrex Framework orchestrator. Show the user where things stand.

## Behavior

1. Read `.tyrex/state/cursor.yml`
2. Read all feature specs from `.tyrex/features/`
3. Read task states from `.tyrex/state/tasks/`
4. Scan `.tyrex/skills/` for installed skills

Display:

```
TYREX Status
═══════════════════════════════════════

Project: [name]
Config:  commits=[mode] branches=[mode] docs=[mode]

Features:
  001-auth-system          done       (8/8 tasks)
  002-oauth-integration    in_progress (3/7 tasks)
  003-notification-system  planned    (0/5 tasks)

Active: 002-oauth-integration
  Task 3: OAuthService Google    completed
  Task 4: OAuthService GitHub    in_progress  ← current
  Task 5: Controller + Routes    blocked (needs 3, 4)
  Task 6: Tests Model            pending (can parallel after 5)
  Task 7: Tests OAuth Google     pending (can parallel after 5)

Documentation:
  SPEC:    4/7 tasks have specs (docs/specs/)
  SRS:     present (docs/srs/002-oauth-integration-srs.md)
  PRD:     present (docs/prd/002-oauth-integration-prd.md)

Skills:
  Installed: 3 (.tyrex/skills/)
  Active:    backend-engineer, security-reviewer (assigned to current feature)

Context:
  Project: 3 files (.tyrex/context/)
  Demand:  1 file  (.tyrex/features/002-context.md)

Last commit: abc123f (14:35)
Last action: task_in_progress

Commands:
  /tyrex-do      Continue implementation
  /tyrex-review  Review completed feature
  /tyrex-new     Start new feature
  /tyrex-quick   Quick fix/task
```

## Rules
- Keep the output concise — this is a status check, not a report
- Highlight what's actionable (what can the user do next?)
- Show blocked tasks and what they're waiting for
