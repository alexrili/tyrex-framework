---
description: "Show current project status"
---

# /tyrex-status - Show current project status

You are the Tyrex Framework orchestrator. Show the user a comprehensive view of where things stand.

## Behavior

### Step 1: Gather data
Read these files (in parallel where possible):
1. `.tyrex/state/cursor.yml` — session state
2. `.tyrex/tyrex.yml` — project configuration
3. `.tyrex/features/` — all feature specs (list directory)
4. `.tyrex/state/tasks/` — all task state files
5. `.tyrex/roadmap.yml` — project roadmap and backlog (if exists)
6. `.tyrex/skills/` — installed skills (list directory)
7. `.tyrex/context/` — project context files (list directory)
8. `.tyrex/TYREX.md` — check completeness (sections filled or empty)
9. `docs/` — scan for existing documentation files

### Step 2: Display comprehensive status

```
TYREX Status
═══════════════════════════════════════

Project: [name]
Config:  commits=[mode] branches=[mode] docs=[mode]

─── Features ───────────────────────────
  001-feature-name           done        (8/8 tasks)
  002-feature-name           done        (7/7 tasks)
  003-feature-name           in_progress (3/7 tasks)

Active: 003-feature-name
  Task 3: ServiceX             completed
  Task 4: ServiceY             in_progress  <- current
  Task 5: Controller           blocked (needs 3, 4)
  Task 6: Tests A              pending (can parallel after 5)
  Task 7: Tests B              pending (can parallel after 5)

─── Roadmap ────────────────────────────
  004-feature-name           planned     (depends on 003)
  005-feature-name           planned     (depends on 002)
  006-feature-name           discussed   (no spec yet)

─── Health ─────────────────────────────
  TYREX.md:       [complete | incomplete (list empty sections)]
  Constitution:   [present | missing]
  Context:        [N files | no project context ingested]
  Skills:         [N installed (list names) | none installed]
  Git branches:   [N stale feature branches | clean]
  Pending fixes:  [list if any diagnosed | none]

─── Documentation ──────────────────────
  CHANGELOG:      [present, up to date | present, stale | missing]
  ADRs:           [N (list numbers)] | none
  Wiki:           [N pages] | none
  SRS/PRD:        [N documents] | none
  SPECs:          [N task specs] | none
  README:         [present | not generated]

─── Skills ─────────────────────────────
  Installed:      [N] (.tyrex/skills/)
  [skill-name]    [role description]
  [skill-name]    [role description]
  Active:         [names assigned to current feature | none]

─── Context ────────────────────────────
  Project:        [N files] (.tyrex/context/)
  Demand:         [filename | none] (.tyrex/features/NNN-context.md)

Last commit: [hash] ([time or date])
Last action: [action from cursor.yml]
═══════════════════════════════════════

Commands:
  /tyrex-do        Continue implementation (if active feature)
  /tyrex-review    Review completed feature (if all tasks done)
  /tyrex-new       Start new feature
  /tyrex-quick     Quick fix or small task
  /tyrex-skills    Create or list skills
  /tyrex-context   Add project context
```

### Step 3: Health diagnostics

Perform these quick checks and include results in the Health section:

1. **TYREX.md completeness** — Check if key sections are filled:
   - Project Overview (not just placeholder)
   - Tech Stack (has entries)
   - Architecture (has content)
   - Project Patterns (has entries)
   Report which sections are empty/placeholder.

2. **Stale branches** — List `feat/*` branches that have been merged to main but not deleted.

3. **Context coverage** — Check if `.tyrex/context/` has files. If empty, suggest `/tyrex-context`.

4. **Skills coverage** — Check if `.tyrex/skills/` has skills. If empty and features exist, note it.

5. **Documentation gaps** — Check what exists in `docs/`:
   - Is CHANGELOG present and does it have entries beyond the template?
   - Are there ADR files? How many?
   - Are there wiki pages? How many?
   - Are there SRS/PRD files?
   - Is README.md present?

6. **Roadmap awareness** — If `.tyrex/roadmap.yml` exists, show planned/discussed features. If it doesn't exist but feature specs reference future features in "Out of Scope" or "Related" sections, extract those references and display them with a note "(extracted from feature specs — consider creating roadmap.yml)".

### Step 4: Actionable suggestions

Based on the status, suggest the most relevant next actions:

- If there's an active feature with pending tasks: suggest `/tyrex-do`
- If all tasks are done but feature not reviewed: suggest `/tyrex-review`
- If no active feature: suggest `/tyrex-new`
- If TYREX.md is incomplete: suggest `/tyrex-evolve`
- If no context files: suggest `/tyrex-context`
- If no skills and features exist: suggest `/tyrex-skills create`
- If stale branches exist: suggest cleanup
- If roadmap has planned features: mention what's next

## Rules
- Keep the output concise — this is a status check, not a full report
- Highlight what's actionable (what can the user do next?)
- Show blocked tasks and what they're waiting for
- The Roadmap section provides forward-looking visibility into planned work
- The Health section surfaces issues proactively — don't wait for the user to ask
- If roadmap.yml doesn't exist, still try to extract future references from feature specs
- Adapt the display: omit sections that are completely empty/irrelevant (e.g., don't show Skills section if no skills exist and no features reference them)
