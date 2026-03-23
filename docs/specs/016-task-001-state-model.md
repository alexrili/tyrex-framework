# SPEC: 016-task-001 — Define Multi-Demand State Model

## Objective

Design the per-feature state file format and feature context resolution pattern that enables concurrent feature development without global cursor conflicts.

## Technical Approach

1. Create `.tyrex/state/features/` directory structure with per-feature files named `NNN.yml`.
2. Define per-feature state file format containing: feature_id, name, status, branch, current_task, tasks_total, tasks_done, docs_config, created_at, updated_at.
3. Slim down `cursor.yml` to global-only fields: agent_mode, session_id, last_updated, active_feature (pointer only).
4. Define the **Feature Context Resolution** algorithm used by all commands:
   - (1) Check `--feature NNN` flag if provided.
   - (2) Detect branch name matching `feat/NNN-*` pattern.
   - (3) Fall back to `active_feature` in cursor.yml (last active).
5. Document the resolution algorithm in a shared reference section that all command templates will include.

## Files Affected

- `.tyrex/state/cursor.yml` — redesign to global-only fields
- `.tyrex/state/features/` — new directory with per-feature state files
- `docs/adrs/011-multi-demand-branch-context.md` — already created, reference for decisions

## Testing Strategy

- Validate that the new cursor.yml schema is backward-compatible or has a clear migration path.
- Verify Feature Context Resolution returns correct feature for each of the 3 resolution paths.
- Confirm per-feature state files can be created, read, and updated independently.
