---
description: "Show current project status"
---

# /tyrex-status - Show current project status

You are the Tyrex Framework orchestrator. Show the user a comprehensive view of where things stand.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. Read-only analysis and reporting only.

## Feature Context Resolution

**This command shows all features.** Scan `.tyrex/state/features/*.yml` to list all features and their status. The current branch's feature (if any) is highlighted.

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
10. `.tyrex/security/audit.md` — security findings from /tyrex-security-review (if exists)
11. `.tyrex/bugs/` — debug session reports and open bugs (if exists)
12. `.tyrex/tests/coverage-gaps.md` — test coverage gaps from /tyrex-test-review (if exists)

### Step 1b: Scan all feature state files

Scan `.tyrex/state/features/*.yml` to discover ALL features and their status. For each file, read the feature ID, name, branch, status, and task progress. Detect the current git branch to identify which feature (if any) belongs to the current branch.

Display a multi-feature table:

```
Features:
  ID   Name                    Branch                    Status      Progress
  014  session-recovery        feat/014-session-recovery done        5/5
  015  skills-overhaul         feat/015-skills-overhaul  done        9/9
  016  command-consistency     feat/016-command-cons...  in_progress 2/8
  ← current branch
```

The current branch's feature gets a `← current branch` marker on its row. If no feature matches the current branch, show the table without a marker.

After the table, show the detailed view for the current branch's feature only (tasks, next steps, blocked items, etc.).

### Step 2: Display comprehensive status

```
TYREX Status
═══════════════════════════════════════

Project: [name]
Config:  commits=[mode] branches=[mode] docs=[mode]

─── Features ───────────────────────────
  ID   Name                    Branch                    Status      Progress
  001  feature-name            feat/001-feature-name     done        8/8
  002  feature-name            feat/002-feature-name     done        7/7
  003  feature-name            feat/003-feature-name     in_progress 3/7
  ← current branch

Active (current branch): 003-feature-name
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

─── Security ───────────────────────────
  Last audit:     [date from security-audit.md header | never]
  Findings:       [N pending, M resolved | no findings | no audit]

  [!] MEDIUM  .env not in .gitignore
  [!] LOW     Unescaped regex in bin/tyrex.js:102
  [x] LOW     Path containment in bin/tyrex.js:378  (resolved)

─── Bugs ───────────────────────────────
  Debug sessions: [N | none]
  Open bugs:      [N (C critical, H high, M medium, L low) | none]

  [!] CRITICAL  BUG-001: [title] (DEBUG-003)
  [!] HIGH      BUG-002: [title] (DEBUG-005)

─── Tests ──────────────────────────
  Last scan:      [date from coverage-gaps.md header | never]
  Coverage gaps:  [N total: P pending, R resolved | no gaps | no scan]

  By tier:
    Critical:     [N pending / M total]
    Important:    [N pending / M total]
    Nice-to-have: [N pending / M total]

  [!] CRITICAL  [module/file]: [description of gap]
  [!] IMPORTANT [module/file]: [description of gap]
  [x] IMPORTANT [module/file]: [description of gap]  (resolved)

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
  Feature:        [filename | none] (.tyrex/features/NNN-context.md)

Last commit: [hash] ([time or date])
Last action: [action from cursor.yml]
═══════════════════════════════════════

Commands:
  /tyrex-discuss          Explore the project, ask questions, brainstorm
  /tyrex-do               Continue implementation (if active feature)
  /tyrex-review           Review completed feature (if all tasks done)
  /tyrex-new              Start new feature
  /tyrex-debug            Diagnose problems, analyze logs, document bugs
  /tyrex-quick            Quick fix or small task
  /tyrex-skills           Create or list skills
  /tyrex-context          Add project context
  /tyrex-security-review  Run security audit
  /tyrex-test-review      Scan for test coverage gaps
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

7. **Security findings** — If `.tyrex/security/audit.md` exists:
   - Parse the findings table for `Status` column (`[ ]` = pending, `[x]` = resolved)
   - Count total findings, pending, and resolved
   - Extract the last scan date from the audit.md header
   - Show each pending finding with severity and description
   - Show resolved findings as `[x]` (collapsed or dimmed)
   - If all findings are resolved, show "All clear — no pending security findings"
   - If no `.tyrex/security/audit.md` exists, show "No security scans yet. Run `/tyrex-security-review`."

8. **Bug registry** — If `.tyrex/bugs/` exists:
   - Count `DEBUG-*.md` files (total debug sessions)
   - Parse each file for findings with `Status: open` vs `Status: resolved`
   - Count open bugs by severity (critical, high, medium, low)
   - Show each open bug with severity and title
   - If no `.tyrex/bugs/` or no files: omit the Bugs section entirely

9. **Test coverage gaps** — If `.tyrex/tests/coverage-gaps.md` exists:
   - Parse the gaps table for `Status` column (`[ ]` = pending, `[x]` = resolved)
   - Count total gaps, pending, and resolved
   - Extract the last scan date from the coverage-gaps.md header
   - Group gaps by tier: critical, important, nice-to-have
   - Show each pending gap with tier and description
   - Show resolved gaps as `[x]` (collapsed or dimmed)
   - If all gaps are resolved, show "All clear — no pending test coverage gaps"
   - If no `.tyrex/tests/coverage-gaps.md` exists, show "No test reviews yet. Run `/tyrex-test-review`."

### Step 4: Actionable suggestions

Based on the status, suggest the most relevant next actions:

- If there's an active feature with pending tasks: suggest `/tyrex-do`
- If all tasks are done but feature not reviewed: suggest `/tyrex-review`
- If no active feature: suggest `/tyrex-new`
- If TYREX.md is incomplete: suggest `/tyrex-evolve` or `/tyrex-discuss` to explore and fill gaps
- If no context files: suggest `/tyrex-context` or `/tyrex-discuss` to explore the project
- If project is greenfield (no features completed, minimal code): suggest `/tyrex-discuss` to brainstorm
- If no skills and features exist: suggest `/tyrex-skills create`
- If stale branches exist: suggest cleanup
- If roadmap has planned features: mention what's next
- If security findings are pending: "N security findings pending. Fix now with `/tyrex-quick`? [y/N]" — if user says yes, list the pending findings and let them choose which to fix, then hand off to `/tyrex-quick`
- If open bugs exist: "N open bugs found. Run `/tyrex-debug` to investigate more, or `/tyrex-quick` to fix."
- If test coverage gaps are pending: "N test coverage gaps pending. Run `/tyrex-test-review` to rescan, or `/tyrex-quick` to address gaps."
- If no security scan has been run: suggest `/tyrex-security-review`
- If no test review has been run: suggest `/tyrex-test-review`
- Always include `/tyrex-discuss` in the commands list for Q&A availability

## Rules
- Keep the output concise — this is a status check, not a full report
- Highlight what's actionable (what can the user do next?)
- Show blocked tasks and what they're waiting for
- The Roadmap section provides forward-looking visibility into planned work
- The Health section surfaces issues proactively — don't wait for the user to ask
- If roadmap.yml doesn't exist, still try to extract future references from feature specs
- Adapt the display: omit sections that are completely empty/irrelevant (e.g., don't show Skills section if no skills exist and no features reference them)
