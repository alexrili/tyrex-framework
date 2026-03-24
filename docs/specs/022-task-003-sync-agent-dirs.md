# SPEC: Task 003 — Sync commands to all 4 agent directories

## Feature
022 — Plan Granular Tasks

## Objective
Copy modified command files to all 4 agent directories.

## Technical Approach
Standard sync: `templates/commands/unified/*` + `templates/commands/shared/*` → 4 agent dirs.

## Files Affected
- `.claude/commands/`, `.cursor/rules/tyrex/`, `.codex/skills/tyrex/`, `.opencode/commands/`

## Testing Strategy
Not applicable.
