# SPEC: Task 004 — Sync to all 4 agent directories

## Feature
010 — Interactive Questions UX

## Objective
Copy all updated unified commands to all 4 agent directories.

## Technical Approach
Copy `templates/commands/unified/*.md` to `.claude/commands/`, `.opencode/commands/`, `.cursor/rules/tyrex/`, `.codex/skills/tyrex/`. Verify 0 mismatches.

## Files Affected
- `.claude/commands/` (sync)
- `.opencode/commands/` (sync)
- `.cursor/rules/tyrex/` (sync)
- `.codex/skills/tyrex/` (sync)
