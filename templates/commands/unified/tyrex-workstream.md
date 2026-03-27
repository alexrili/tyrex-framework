---
description: "Manage workstreams — parallel namespaced work within a project"
---

# /tyrex-workstream - Parallel Namespaced Work

You are the Tyrex Framework orchestrator. The user wants to manage workstreams — isolated parallel work contexts within the same project.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may create/modify only `.tyrex/workstreams/`, `.tyrex/state/`, and `docs/` files.

## Concepts

**Workstream** = an isolated, named context for parallel work. Each workstream has its own cursor, features, and backlog scope. Useful for projects with multiple simultaneous fronts (e.g., "api-v2", "mobile-app", "infrastructure").

Workstreams live in `.tyrex/workstreams/WS-<name>/` and contain their own state.

**Default workstream:** When no explicit workstream exists, the project operates in a single implicit "main" workstream. Creating a workstream is only needed when the user wants to track multiple parallel fronts.

**Lifecycle:** `active` → `completed` | `archived`

## Parameters

- **`/tyrex-workstream`** — List all workstreams and show the active one
- **`/tyrex-workstream create <name>`** — Create a new workstream
- **`/tyrex-workstream switch <name>`** — Switch to a different workstream
- **`/tyrex-workstream complete <name>`** — Complete a workstream
- **`/tyrex-workstream <name>`** — Show details of a specific workstream

## Pre-flight

1. Check `.tyrex/workstreams/` exists. If not, create the directory.
2. Scan existing workstreams.
3. Read `cursor.yml` for `active_workstream` field.

## Behavior

### Subcommand: (no args) — List workstreams

```
TYREX Workstreams
═══════════════════════════════════════

  Name            Features   Status     Branch Prefix
  api-v2          3          active ◀   feat/ws-api-v2/
  mobile-app      1          active     feat/ws-mobile-app/
  infra           2          completed  feat/ws-infra/

Active: api-v2

Actions:
  [1] Create new workstream
  [2] Switch workstream
  [3] View workstream details
  [4] Done
```

### Subcommand: `create <name>`

1. Convert name to kebab-case
2. Check for conflicts (existing workstream with same name)
3. Create workstream directory structure:
   ```
   .tyrex/workstreams/WS-<name>/
   ├── cursor.yml       # Workstream-specific cursor
   ├── features/        # Features scoped to this workstream
   └── backlog/         # Backlog items scoped to this workstream (optional)
   ```
4. Initialize `cursor.yml` for the workstream:
   ```yaml
   workstream: "<name>"
   created: "YYYY-MM-DD"
   status: active
   last_active_feature: null
   last_action: "created"
   last_updated: "YYYY-MM-DD"
   features: []
   branch_prefix: "feat/ws-<name>/"
   ```
5. Present:
   ```
   Workstream created: [name]
   Branch prefix: feat/ws-[name]/

   Switch to this workstream now?
     [1] Yes — make it active
     [2] No — stay in current workstream
   ```
6. Commit: `workstream: create WS-[name]`

### Subcommand: `switch <name>`

1. Verify workstream exists and is `active`
2. Update global `cursor.yml`: set `active_workstream: <name>`
3. Load the workstream's cursor for context
4. Present:
   ```
   Switched to workstream: [name]
   Features: [N] ([M in-progress])
   Last action: [action] ([date])

   Next: /tyrex-status to see workstream state
   ```
5. Commit: `workstream: switch to WS-[name]`

### Subcommand: `complete <name>`

1. Verify all features in the workstream are done
2. If features pending:
   ```
   Cannot complete workstream [name]:
     ○ Feature NNN — [status]

     [1] Complete anyway (mark remaining as cancelled)
     [2] Cancel
   ```
3. If all done:
   - Set workstream `status: completed`
   - If this was the active workstream, clear `active_workstream` in global cursor
   - Present:
     ```
     Workstream [name] completed!
     Features delivered: [N]

       [1] Archive (move to .tyrex/workstreams/archive/)
       [2] Keep visible
       [3] Create next workstream
     ```
4. Commit: `workstream: complete WS-[name]`

### Subcommand: `<name>` — Detail view

```
Workstream: [name]
═══════════════════════════════════════

Status:        [status]
Created:       [date]
Branch prefix: feat/ws-[name]/
Features:      [N total] ([M done], [K in-progress])

Features:
  ✓ Feature NNN — [name] (done)
  ○ Feature NNN — [name] (in-progress)
  · Feature NNN — [name] (planned)

Actions:
  [1] Switch to this workstream
  [2] Add feature
  [3] Complete workstream
  [4] Back
```

## File Format

### Workstream cursor (`.tyrex/workstreams/WS-<name>/cursor.yml`)
```yaml
workstream: "<name>"
created: "YYYY-MM-DD"
status: active | completed | archived
last_active_feature: null
last_action: "created"
last_updated: "YYYY-MM-DD"
features: [35, 36, 37]
branch_prefix: "feat/ws-<name>/"
```

## Integration Points

- **`/tyrex-new`:** When a workstream is active, new features are automatically scoped to it. Branch prefix uses the workstream prefix. Feature ID is added to the workstream's `features` list.
- **`/tyrex-status`:** Shows active workstream name and its feature progress.
- **Global cursor.yml:** New field `active_workstream: <name> | null` indicates which workstream is active.
- **Git branching:** Features in a workstream use `feat/ws-<name>/NNN-slug` branch naming.

## Git Semantic Commits

- **create:** `workstream: create WS-[name]`
- **switch:** `workstream: switch to WS-[name]`
- **complete:** `workstream: complete WS-[name]`
- **archive:** `workstream: archive WS-[name]`

Check `tyrex.yml` `git.auto_commit_state` before committing. If `off`, skip silently.

## Important Rules
- **Workstreams are optional.** Most projects don't need them. Only suggest when the user explicitly asks.
- **Features belong to at most one workstream.** No shared features across workstreams.
- **Workstream state is separate from global state.** Each workstream has its own cursor and feature list.
- **Branch isolation.** Each workstream uses a distinct branch prefix to avoid conflicts.
- **Plan mode only.** Workstreams are organizational, not code.
- **Default behavior when no workstreams exist:** everything works as before. Workstreams are additive, not required.
- **No workstream nesting.** Workstreams are flat — no workstream within a workstream.
