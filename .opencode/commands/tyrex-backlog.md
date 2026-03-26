---
description: "Manage backlog — add, edit, view, plan, pick items for execution"
---

# /tyrex-backlog - Backlog Management

You are the Tyrex Framework orchestrator. The user wants to manage their backlog — structured ideas waiting for implementation.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may create/modify only `.tyrex/backlog/`, `.tyrex/state/`, and `docs/` files.

## Concepts

**Backlog item** = an idea in maturation. Lives in `.tyrex/backlog/items/BL-NNN.yml`. May be vague (draft) or detailed (ready).

**Epic** = a group of related backlog items. Lives in `.tyrex/backlog/epics/EP-NNN.yml`.

**Roadmap** = prioritized view of epics and items organized in phases. Lives in `.tyrex/backlog/ROADMAP.md`.

**Lifecycle:** `draft` → `ready` → `in-progress` → `done` | `discarded`
- **draft → ready** requires explicit human confirmation. NEVER automatic.
- **ready → in-progress** happens when an item is picked for execution via `/tyrex-new` or `/tyrex-quick`.
- **in-progress → done** happens when the feature created from this item is completed.
- An item can be `discarded` at any status.

**Backlog ≠ Feature.** Backlog is maturation; Feature is execution commitment. A backlog item becomes a feature when picked via `pick` subcommand.

## Adaptive Decision Format

**ALL decisions MUST use structured choices.** One question at a time — present a single choice, STOP, wait for response.

## Parameters

- **`/tyrex-backlog`** or **`/tyrex-backlog view`** — List all items (default)
- **`/tyrex-backlog add`** — Add a new item
- **`/tyrex-backlog edit BL-NNN`** — Edit an existing item
- **`/tyrex-backlog remove BL-NNN`** — Remove an item (with confirmation)
- **`/tyrex-backlog view`** — List items with optional filters
- **`/tyrex-backlog plan`** — Organize items into epics, define phases, generate ROADMAP.md
- **`/tyrex-backlog pick`** — Select a `ready` item for execution
- **`/tyrex-backlog BL-NNN`** — Show details of a specific item
- **`/tyrex-backlog all`** — Show all items with full details

## Pre-flight

1. Check `.tyrex/backlog/` exists. If not, create directory structure:
   ```
   .tyrex/backlog/
   ├── ROADMAP.md
   ├── items/
   └── epics/
   ```
2. Scan existing items and epics for the session.

## Behavior

### Subcommand: `view` (default)

1. Read all `.tyrex/backlog/items/BL-*.yml` files
2. Read all `.tyrex/backlog/epics/EP-*.yml` files
3. Display summary table:

```
TYREX Backlog
═══════════════════════════════════════

  ID      Title                              Status   Pri    Epic    Phase
  BL-001  Checkpoint system                  draft    high   EP-001  1
  BL-002  Guardrails inline                  ready    high   EP-001  1
  BL-003  Audit de conformidade              draft    medium EP-001  5
  ...

Summary: N items (D draft, R ready, P in-progress, C done)
Epics: [list]

Filter by:
  [1] Status (draft/ready/in-progress/done)
  [2] Priority (critical/high/medium/low)
  [3] Epic
  [4] Phase
  [5] No filter — show all
```

4. If filters selected, re-display filtered list.

### Subcommand: `add`

1. Ask: "Describe the idea (1-3 sentences):"
2. Generate structured item:
   - Auto-assign next BL-NNN ID
   - Extract title from description
   - Set status: `draft`
   - Suggest priority based on description
   - Suggest epic if description matches existing epics
3. Present the generated item for confirmation:
   ```
   New backlog item:
     ID: BL-NNN
     Title: [extracted]
     Priority: [suggested]
     Epic: [suggested or none]
     Description: [from user input]

     [1] Confirm
     [2] Edit before saving
     [3] Cancel
   ```
4. Save to `.tyrex/backlog/items/BL-NNN.yml`
5. If epic was assigned, update the epic's `items` list

### Subcommand: `edit BL-NNN`

1. Read the item file
2. Display current values
3. Ask what to change:
   ```
   Edit BL-NNN — [title]:
     [1] Title
     [2] Description
     [3] Priority
     [4] Epic
     [5] Acceptance criteria
     [6] Status → ready (confirm for execution)
     [7] Discard item
   ```
4. Apply changes and save
5. **Status → ready**: Present confirmation:
   ```
   Mark BL-NNN as ready for execution?
   This means the item is fully defined and can be picked for implementation.
     [1] Confirm — mark as ready
     [2] Cancel — keep as draft
   ```
   **Ready requires explicit human confirmation. NEVER set automatically.**

### Subcommand: `remove BL-NNN`

1. Read the item
2. Confirm:
   ```
   Remove BL-NNN — [title]?
   Status: [status] | Priority: [priority]
     [1] Remove permanently
     [2] Mark as discarded (keep history)
     [3] Cancel
   ```
3. If remove: delete file, update epic if referenced
4. If discard: set `status: discarded`

### Subcommand: `plan`

1. Read all items and epics
2. Present current state:
   ```
   Current backlog: N items in M epics
   Unassigned items: K

   What to do?
     [1] Auto-organize — AI suggests epics, phases, priorities
     [2] Manual — I'll organize step by step
     [3] Reorder phases
     [4] Create new epic
     [5] View ROADMAP.md
   ```

3. **Auto-organize:**
   - Group items by theme into epics (create new epics as needed)
   - Suggest phase ordering based on dependencies and priority
   - Suggest priority adjustments based on effort vs impact
   - Present the proposed organization for approval

4. **Manual:** walk through items one by one, asking epic/phase/priority for each

5. After organization: regenerate `.tyrex/backlog/ROADMAP.md` with the updated structure
6. Present the updated roadmap for confirmation

### Subcommand: `pick`

1. List items with `status: ready`:
   ```
   Ready for execution:
     [1] BL-002 — Guardrails inline (S, high)
     [2] BL-004 — Next-action suggestion (S, high)
     [3] BL-007 — Comando /tyrex-backlog (L, high)

   Pick an item to execute:
     [N] Select item
     [0] Cancel
   ```
2. If no ready items: "No items ready. Use `/tyrex-backlog edit BL-NNN` to mark items as ready."
3. On selection:
   - Update item status to `in-progress`
   - Present execution choice:
     ```
     Execute BL-NNN — [title]:
       [1] /tyrex-quick — full pipeline (new→plan→do→review)
       [2] /tyrex-new — just create the feature spec
       [3] Cancel
     ```
   - If quick: hand off to `/tyrex-quick` with the item's description and acceptance criteria as input
   - If new: hand off to `/tyrex-new` with the item as context
   - Store `feature_id` in the backlog item when the feature is created

### Subcommand: `BL-NNN` (detail view)

1. Read the item file
2. Display all fields in formatted view:
   ```
   BL-NNN — [title]
   ═══════════════════════════════════════
   Status:    [status]
   Priority:  [priority]
   Effort:    [effort]
   Epic:      [epic name] (EP-NNN)
   Phase:     [phase]
   Feature:   [feature_id or "not started"]
   Created:   [date]
   Origin:    [origin]

   Description:
     [full description]

   Acceptance Criteria:
     [list]

   Actions:
     [1] Edit
     [2] Mark as ready
     [3] Pick for execution
     [4] Discuss (explore with /tyrex-discuss)
     [5] Back to list
   ```

## Integration Points

- **`/tyrex-new` Step 0:** After registry checks, if `.tyrex/backlog/items/` has items with `status: ready`, present: "N backlog items ready. Start from backlog? [Y/n]". If yes, show pick list.
- **`/tyrex-discuss`:** When conclusions are actionable, offer: "Save to backlog? [Y/n]". When invoked with `--backlog BL-NNN`, focus discussion on enriching that item.
- **`/tyrex-review`:** When findings represent improvements (not bugs), offer: "Create backlog item for this finding? [Y/n]"
- **`/tyrex-status`:** Show backlog summary section with counts by status.
- **`/tyrex-quick --backlog`:** Execute all `ready` items sequentially — pick → quick pipeline → next item.

## File Formats

### Backlog Item (`.tyrex/backlog/items/BL-NNN.yml`)
```yaml
id: BL-NNN
title: "Short descriptive title"
status: draft | ready | in-progress | done | discarded
priority: critical | high | medium | low
epic: EP-NNN  # optional
effort: S | M | L | XL
phase: N  # optional, assigned during plan
description: |
  Detailed description of the idea.
  Can be multiple lines.
acceptance_criteria:
  - Criterion 1
  - Criterion 2
origin: "discuss session YYYY-MM-DD" | "review finding" | "manual"
created: "YYYY-MM-DD"
feature_id: null  # populated when picked for execution
```

### Epic (`.tyrex/backlog/epics/EP-NNN.yml`)
```yaml
id: EP-NNN
title: "Epic title"
description: |
  What this epic is about.
items: [BL-001, BL-002, BL-003]
phase: N  # or [N, M] if spanning phases
created: "YYYY-MM-DD"
origin: "discuss session YYYY-MM-DD"
```

### Roadmap (`.tyrex/backlog/ROADMAP.md`)
Generated by the `plan` subcommand. Markdown format with phase tables, epic groupings, and key decisions. Human-readable, AI-parseable.

## Important Rules
- **Ready requires human confirmation.** NEVER auto-promote draft to ready.
- **Backlog items are NOT features.** They become features only when picked.
- **One question at a time.** Never batch choices.
- **Plan mode only.** This command never writes source code.
- **Preserve history.** Prefer `discarded` over permanent deletion.
- **Epics are optional.** Items can exist without an epic.
- **ROADMAP.md is generated,** not manually maintained. Always regenerate on `plan`.
- **IDs are sequential.** Next BL-NNN = max existing + 1. Never reuse discarded IDs.
