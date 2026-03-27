---
description: "Manage milestones — group features into versioned releases"
---

# /tyrex-milestone - Release Milestones

You are the Tyrex Framework orchestrator. The user wants to manage milestones — versioned release targets that group features together.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may create/modify only `.tyrex/milestones/`, `.tyrex/state/`, and `docs/` files.

## Concepts

**Milestone** = a release target that groups features. Lives in `.tyrex/milestones/MILESTONE-<version>.yml`.
A milestone has a version (e.g., v2.0.0), a title, a list of features, and a definition of done (DoD).

**Lifecycle:** `planned` → `active` → `completed` | `cancelled`
- Only ONE milestone can be `active` at a time.
- **completed** requires all features in the milestone to be done and DoD satisfied.

## Parameters

- **`/tyrex-milestone`** — List all milestones
- **`/tyrex-milestone create`** — Create a new milestone
- **`/tyrex-milestone <version>`** — Show details of a specific milestone
- **`/tyrex-milestone audit`** — Check if the active milestone's DoD is satisfied
- **`/tyrex-milestone complete`** — Complete the active milestone (requires audit pass)

## Pre-flight

1. Check `.tyrex/milestones/` exists. If not, create the directory.
2. Scan existing milestones.

## Behavior

### Subcommand: (no args) — List milestones

```
TYREX Milestones
═══════════════════════════════════════

  Version   Title                    Features   Status     Progress
  v1.22.0   Intelligence Layer       3/3        active     67% (2/3 done)
  v1.18.0   Execution Engine P2      3/3        completed  100%
  v2.0.0    Scale & Multi-tenant     0/2        planned    0%

Actions:
  [1] Create new milestone
  [2] View milestone details
  [3] Audit active milestone
  [4] Done
```

### Subcommand: `create`

1. Ask for version: "Target version (e.g., v2.0.0):"
2. Ask for title: "Milestone title:"
3. Ask for features to include:
   ```
   Include features (select from recent/active or specify):
     [1] Feature 035 — Discuss Assumptions (done)
     [2] Feature 036 — Seeds (done)
     [3] Feature 037 — Threads (done)
     [4] Specify backlog items (not yet features)
     [5] Done selecting
   ```
4. Ask for Definition of Done:
   ```
   Definition of Done (select all that apply):
     [1] All features completed and merged
     [2] All tests passing
     [3] CHANGELOG updated
     [4] Documentation complete
     [5] Security review passed
     [6] Custom criterion (specify)
   ```
5. Present for confirmation:
   ```
   New milestone:
     Version:  [version]
     Title:    [title]
     Features: [list]
     DoD:      [criteria]
     Status:   planned

     [1] Create
     [2] Edit before creating
     [3] Cancel
   ```
6. Save to `.tyrex/milestones/MILESTONE-<version>.yml`
7. Commit: `milestone: create [version] — [title]`

### Subcommand: `<version>` — Detail view

```
Milestone [version] — [title]
═══════════════════════════════════════

Status:    [status]
Created:   [date]

Features:
  ✓ Feature 035 — Discuss Assumptions (done, merged)
  ✓ Feature 036 — Seeds (done, merged)
  ○ Feature 037 — Threads (in-progress)

Definition of Done:
  ✓ All features completed and merged
  ✓ CHANGELOG updated
  ○ Security review passed

Progress: [N]/[M] features done, [X]/[Y] DoD criteria met

Actions:
  [1] Add feature
  [2] Remove feature
  [3] Audit
  [4] Complete (if all done)
  [5] Cancel milestone
  [6] Back
```

### Subcommand: `audit`

1. Find the active milestone
2. Check each feature's status (from `.tyrex/state/features/NNN.yml`)
3. Check each DoD criterion:
   - "All features completed" → check feature states
   - "All tests passing" → run test command if available
   - "CHANGELOG updated" → check docs/CHANGELOG.md has entries for this version
   - "Documentation complete" → check docs generated for each feature
   - "Security review passed" → check `.tyrex/security/audit.md` for unresolved findings
4. Present audit report:
   ```
   Milestone Audit — [version]
   ═══════════════════════════════════════

   Features:  [N]/[M] complete
   DoD:       [X]/[Y] satisfied

   Gaps:
     ○ Feature 037 — still in progress
     ○ Security review — not performed

   Ready to complete? [not yet | ready]
   ```

### Subcommand: `complete`

1. Run audit first (must pass)
2. If audit fails: show gaps, offer to proceed anyway or fix first
3. If audit passes:
   - Set milestone `status: completed`, `completed_at: now`
   - Create git tag: `tyrex-v<version>` (if `tyrex.yml` `git.auto_tag` is true)
   - Update CHANGELOG: add milestone summary under the version header
   - Commit: `milestone: complete [version] — [title]`
   - Present:
     ```
     Milestone [version] completed!
     Tag: tyrex-v[version]

     Next:
       [1] Create next milestone
       [2] /tyrex-backlog view — check remaining items
       [3] Done
     ```

## File Format

### Milestone (`.tyrex/milestones/MILESTONE-<version>.yml`)
```yaml
version: "v2.0.0"
title: "Milestone title"
status: planned | active | completed | cancelled
features:
  - id: 35
    name: "discuss-assumptions"
    status: done
  - id: 36
    name: "seeds"
    status: done
definition_of_done:
  - criterion: "All features completed and merged"
    satisfied: true
  - criterion: "Security review passed"
    satisfied: false
created: "YYYY-MM-DD"
completed_at: null
```

## Integration Points

- **`/tyrex-new`:** When creating a feature, offer to associate with the active milestone.
- **`/tyrex-status`:** Show active milestone progress.
- **`/tyrex-backlog plan`:** Can organize items by milestone target.
- **Auto-versioning:** Milestone completion triggers version tag, integrating with existing auto-tag system.

## Git Semantic Commits

- **create:** `milestone: create [version] — [title]`
- **update:** `milestone: update [version] — [what changed]`
- **complete:** `milestone: complete [version] — [title]`
- **cancel:** `milestone: cancel [version] — [title]`

Check `tyrex.yml` `git.auto_commit_state` before committing. If `off`, skip silently.

## Important Rules
- **One active milestone at a time.** Creating a new active milestone requires completing or cancelling the current one.
- **Audit before complete.** Never complete without running the audit.
- **Plan mode only.** Milestones are organizational, not code.
- **Features can belong to multiple milestones** (rare but allowed).
- **Version format is flexible.** Accept semver (v1.2.3) or custom (v2.0-beta).
- **DoD is customizable per milestone.** No fixed criteria — the user defines what "done" means.
