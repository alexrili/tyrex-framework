# SPEC: tyrex-settings — Tracker Configuration

## Task
Feature 019, Task 7

## Objective
Add integrations.tracker section to `/tyrex-settings` for viewing and modifying tracker config.

## Technical Approach
1. **Display** — Add "Integrations" section to current settings display showing provider, project, user (or "not configured").
2. **Modify** — Add "Configure tracker integration" option to the settings menu. Structured choices: provider (Jira/Linear/GitHub Issues/None), project key, user email/handle.
3. **Write** — Update `tyrex.yml` with new values.

## Constraints
- Settings are project-level (stored in `.tyrex/tyrex.yml`)
- Removing tracker (set to None) does not remove existing external_refs from features

## Files Affected
- `templates/commands/unified/tyrex-settings.md`

## Testing Strategy
Quality: optional. Manual test.
