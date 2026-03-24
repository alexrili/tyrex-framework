# SPEC: Task 002 — Rewrite tyrex-quick.md as orchestrator

## Feature
021 — Quick Rewrite & Doc Impact Analysis

## Objective
Completely rewrite `/tyrex-quick` so it delegates to the full logic of `/tyrex-new`, `/tyrex-plan`, and `/tyrex-do` instead of reimplementing them in abbreviated form.

## Technical Approach
The new quick command structure:

1. **Parameters:** Same as today (`--auto`, `--auto-approve` alias)
2. **Step 1 — Capture:** Ask "What do you need done?" — same as current. But clarification questions happen even with `--auto` when description is genuinely ambiguous.
3. **Step 2 — Execute /tyrex-new internally:**
   - Use `tyrex.yml` defaults for docs config (not "CHANGELOG + SPEC only")
   - Generate feature spec, branch, docs (PRD/SRS/ADR per tyrex.yml config)
   - With `--auto`: auto-approve all confirmations, still generate all artifacts
   - Without `--auto`: present each choice interactively
4. **Step 3 — Execute /tyrex-plan internally:**
   - Full security-first analysis, task decomposition, SPECs per task
   - With `--auto`: auto-approve plan
   - Without `--auto`: present plan for approval
5. **Step 4 — Execute /tyrex-do internally:**
   - Full TDD, CHANGELOG, version bump, commits
   - With `--auto`: auto-approve all commits
   - Without `--auto`: present each commit for approval
6. **Step 5 — Summary**

Key language changes:
- Remove: "collapses", "fewer steps", "skip this step", "compact"
- Add: "delegates to", "same stages", "auto-approve only", "no stages skipped"
- The `--auto` description changes from "full autopilot" to "auto-approve confirmations"

The command references the existing command files for behavior, not reimplementation.

## Constraints
- Must NOT reimplement any logic from new/plan/do
- Must produce identical artifacts to manual workflow
- Escalation rule retained (>8 tasks → suggest full workflow)
- Crash detection pre-flight retained

## Files Affected
- `templates/commands/unified/tyrex-quick.md` (full rewrite)

## Testing Strategy
Not applicable (markdown prompt file).
