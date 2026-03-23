# SPEC: 016-task-004 — Multi-Demand Updates: tyrex-new + tyrex-plan

## Objective

Update the new and plan commands to support concurrent features by writing per-feature state instead of overwriting the global cursor.

## Technical Approach

1. **tyrex-new**: On feature creation, write a new `.tyrex/state/features/NNN.yml` file instead of overwriting global cursor fields. Set `active_feature` pointer in cursor.yml. Allow multiple features to exist in spec/planned state simultaneously.
2. **tyrex-plan**: Use Feature Context Resolution (Task 1 pattern) to determine which feature is being planned. Write task state files to the per-feature directory. Update the per-feature state file with task counts.
3. Both commands: Add a "Feature Context Resolution" section referencing the shared algorithm defined in Task 1.
4. Ensure backward compatibility — if no per-feature state exists, fall back to legacy cursor fields.

## Files Affected

- `templates/commands/unified/tyrex-new.md`
- `templates/commands/unified/tyrex-plan.md`

## Testing Strategy

- Verify tyrex-new creates per-feature state file and does not overwrite unrelated cursor fields.
- Verify tyrex-plan resolves feature from branch and writes to correct per-feature state.
- Confirm two features can coexist in planned state without conflicts.
