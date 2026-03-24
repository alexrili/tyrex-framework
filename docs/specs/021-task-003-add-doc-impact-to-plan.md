# SPEC: Task 003 — Add doc impact analysis to tyrex-plan.md

## Feature
021 — Quick Rewrite & Doc Impact Analysis

## Objective
Add a predictive doc impact analysis step to `/tyrex-plan` that checks whether planned changes will affect existing documentation and auto-adds a doc update task if so.

## Technical Approach
Add a new step after Step 3c (documentation task offers) and before Step 4 (execution graph):

**New Step 3d: Doc Impact Analysis (predictive)**
1. Reference `templates/commands/shared/doc-impact-analysis.md`
2. Collect all `Files` from proposed tasks
3. Run the scan algorithm against the planned file list (not actual diffs — predictive mode)
4. If matches found: auto-add a "Documentation consistency update" task as the LAST task in the plan
   - This task has: quality: optional, skill: none, depends_on: all other tasks
   - Its SPEC lists the specific docs that may need updating

## Constraints
- Must be lightweight — predictive, not exhaustive
- The doc update task is added silently in `--auto` mode, shown as recommendation otherwise
- Does not block plan approval

## Files Affected
- `templates/commands/unified/tyrex-plan.md` (add step)

## Testing Strategy
Not applicable (markdown prompt file).
