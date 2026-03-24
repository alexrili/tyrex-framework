# SPEC: tyrex-status — Sync State Display

## Task
Feature 019, Task 8

## Objective
Show external tracker sync information in `/tyrex-status` per feature.

## Technical Approach
1. **Features table** — Add columns: "Tracker", "Mode", "Last Sync" to the features table.
2. **Detail** — For the active feature, show full external_ref info: source, issue ID (as link), mode, last synced timestamp.
3. **Subtask sync** — Show how many tasks have external_task_ref vs total tasks.
4. **Integration config** — Show configured provider in project info section.

## Constraints
- Only show tracker columns if any feature has external_ref (keep output clean for non-tracker users)

## Files Affected
- `templates/commands/unified/tyrex-status.md`

## Testing Strategy
Quality: optional. Manual test.
