# SPEC: 016-task-006 — Multi-Demand Updates: tyrex-status + tyrex-help

## Objective

Update tyrex-status to display all open features in a summary table; update tyrex-help with a clear two-path workflow guide.

## Technical Approach

1. **tyrex-status**: Scan all `.tyrex/state/features/*.yml` files. Display a table with columns: Feature ID, Name, Status, Branch, Tasks Done/Total. Highlight the currently active feature (resolved via Feature Context Resolution). Show per-task detail only for the active feature.
2. **tyrex-help**: Add a "Two Paths" section showing: (a) Full ceremony chain: new -> plan -> do -> review, and (b) Fast-lane: quick (for bug fixes, tweaks, small changes). Include when to use each path.
3. Both commands: reference Feature Context Resolution where applicable.

## Files Affected

- `templates/commands/unified/tyrex-status.md`
- `templates/commands/unified/tyrex-help.md`

## Testing Strategy

- Verify tyrex-status lists multiple features when multiple per-feature state files exist.
- Verify the active feature is correctly highlighted based on branch context.
- Confirm tyrex-help two-path section is clear and references correct command sequences.
