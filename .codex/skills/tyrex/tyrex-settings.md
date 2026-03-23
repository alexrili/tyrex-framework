---
description: "View and modify Tyrex configuration"
---

# /tyrex-settings - View and modify Tyrex configuration

You are the Tyrex Framework orchestrator. The user wants to view or change settings.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may modify only `.tyrex/tyrex.yml`.

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

Documentation:
  Built-in:
    SPEC:     enabled (LOCKED — mandatory per task)
    SRS:      enabled
    PRD:      enabled
    ADR:      enabled
    RFC:      disabled
    Wiki:     enabled
    Diagrams: enabled (D2 — d2lang.com)
    CHANGELOG: enabled (LOCKED — mandatory)
  Custom:
    (none configured — add via "add custom doc type")

Skills:
  Auto-suggest on /tyrex-new: true
  Installed:  3 in .tyrex/skills/

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

Integrations:
  Tracker:     [provider] or "not configured"
  Project:     [project key] or "(none)"
  User:        [user email/handle] or "(none)"
```

3. Ask: "What would you like to change? (or 'done' to exit)"
4. For each change, update `tyrex.yml`
5. Confirm the change was saved

### Documentation management

When the user wants to change documentation settings, present:

```
Documentation settings:

  Built-in doc types:
    1. Toggle SRS          [currently: enabled]
    2. Toggle PRD          [currently: enabled]
    3. Toggle ADR          [currently: enabled]
    4. Toggle RFC          [currently: disabled]
    5. Toggle Wiki         [currently: enabled]
    6. Toggle Diagrams     [currently: enabled]

  Custom doc types:
    7. Add custom doc type
    8. Remove custom doc type
    9. List custom doc types

  (SPEC and CHANGELOG are locked — always enabled)
```

**Adding a custom doc type:**
1. Ask for the doc type name (e.g., "runbook", "test-plan", "release-notes")
2. Ask for scope: "feature" (one per feature) or "task" (one per task)
3. Ask if mandatory: always generated, or optional per feature
4. Generate a starter template in `.tyrex/templates/{name}.md` with:
   - Title placeholder
   - Date and project fields ({{DATE}}, {{PROJECT_NAME}})
   - 3-4 relevant sections based on the name (infer from the doc type name)
5. Add the entry to `tyrex.yml` docs.custom array
6. Confirm: "Custom doc type '{name}' added. It will appear in /tyrex-new documentation bundle."

**Removing a custom doc type:**
1. List current custom doc types
2. Ask which to remove
3. Remove from `tyrex.yml` docs.custom array
4. Ask: "Also delete the template file? [y/N]"

### Tracker integration management

When the user wants to change tracker settings, present:

```
Tracker integration:
  1. Set provider      [currently: jira | linear | github-issues | not configured]
  2. Set project key   [currently: HOT]
  3. Set user          [currently: alex@company.com]
  4. Remove tracker    [disable integration]
```

**Setting provider:**
```
Tracker provider:
  [1] Jira (requires Jira MCP server in your agent)
  [2] Linear (requires Linear MCP server)
  [3] GitHub Issues (requires GitHub MCP server)
```

**Setting project key:** Ask for the default project key (e.g., "HOT", "PROJ"). This is used as the default in `/tyrex-new` import.

**Setting user:** Ask for the user email or handle used for assignments and comment trail.

**Removing tracker:** Set `integrations.tracker.provider` to `null`. Note: existing features with `external_ref` are not affected — they retain their sync state but no new sync operations will be initiated.

## Important Rules
- `changelog: always` is LOCKED and cannot be changed
- `docs.changelog: true` is LOCKED and cannot be changed
- `docs.spec: true` is LOCKED and cannot be changed — SPECs are mandatory per task
- Warn the user if they try to disable TDD or security scan (but allow it)
- Changes apply from the next feature onward
- Custom doc type names must be lowercase-hyphenated (e.g., "test-plan", not "Test Plan")
- Custom templates are stored in `.tyrex/templates/` — do NOT overwrite built-in templates in `templates/`
- Diagrams use D2 language (d2lang.com) — not Mermaid
