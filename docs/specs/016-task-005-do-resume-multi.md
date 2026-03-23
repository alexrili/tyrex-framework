# SPEC: 016-task-005 — Multi-Demand Updates: tyrex-do + tyrex-resume

## Objective

Update the do and resume commands to resolve features from branch context and operate on per-feature state files.

## Technical Approach

1. **tyrex-do**: Use Feature Context Resolution to determine the active feature from the current branch. Read task list from per-feature state file. Write checkpoints and task progress to the per-feature state file, not the global cursor.
2. **tyrex-resume**: Detect the feature from the current branch name. Run git consistency check (uncommitted changes, branch divergence) against the per-feature state. Restore session from per-feature state rather than global cursor.
3. Both commands: Add the "Feature Context Resolution" section referencing the shared algorithm from Task 1.
4. Handle edge case: if branch does not match any feature, prompt the human to specify.

## Files Affected

- `templates/commands/unified/tyrex-do.md`
- `templates/commands/unified/tyrex-resume.md`

## Testing Strategy

- Verify tyrex-do reads and writes the correct per-feature state when on a feature branch.
- Verify tyrex-resume detects the feature from branch and restores correct task state.
- Test the fallback prompt when branch name does not match any known feature.
