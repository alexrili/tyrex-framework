# SPEC: Task 004 — Add doc impact analysis to tyrex-do.md

## Feature
021 — Quick Rewrite & Doc Impact Analysis

## Objective
Add a post-implementation doc impact scan to `/tyrex-do` that runs after all tasks complete and auto-creates fix tasks when documentation drift is detected.

## Technical Approach
Add a new step between Step 4 (task execution) completion and Step 5 (feature completion):

**New Step 4b: Doc Impact Analysis (post-implementation)**
1. Reference `templates/commands/shared/doc-impact-analysis.md`
2. Collect `files_changed` from ALL completed tasks in this feature
3. Run the full scan algorithm against actual diffs (not predictive — real changes)
4. If inconsistencies found:
   - Create fix task(s) automatically (one per doc category or one combined)
   - Execute the fix task(s) immediately (same commit rules, CHANGELOG, etc.)
   - This happens BEFORE the completion summary
5. If no inconsistencies: proceed to completion summary with note "Doc consistency: OK"

Behavior with `--auto`:
- Fix tasks are auto-created and auto-executed
- No approval needed

Behavior without `--auto`:
- Present findings and ask: `[1] Fix now [2] Skip (add to backlog)`

## Constraints
- Runs on actual diffs, not predictions — more accurate than plan-time scan
- Fix tasks follow the same commit/CHANGELOG/version-bump rules as regular tasks
- MUST NOT block if scan finds nothing

## Files Affected
- `templates/commands/unified/tyrex-do.md` (add step)

## Testing Strategy
Not applicable (markdown prompt file).
