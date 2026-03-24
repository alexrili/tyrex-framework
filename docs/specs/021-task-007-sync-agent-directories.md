# SPEC: Task 007 — Sync commands to all 4 agent directories

## Feature
021 — Quick Rewrite & Doc Impact Analysis

## Objective
Copy all modified command files from `templates/commands/` to the 4 agent directories to keep them in sync.

## Technical Approach
1. Copy `templates/commands/unified/*` → `.claude/commands/`, `.cursor/rules/tyrex/`, `.codex/skills/tyrex/`, `.opencode/commands/`
2. Copy `templates/commands/shared/*` → same 4 directories
3. Verify all files are identical across directories

This is the standard sync step — always the LAST task after any command modification.

## Constraints
- MUST be the last task (depends on all command modifications being complete)
- All 4 directories must be identical after sync

## Files Affected
- `.claude/commands/*`
- `.cursor/rules/tyrex/*`
- `.codex/skills/tyrex/*`
- `.opencode/commands/*`

## Testing Strategy
Not applicable (file copy operation).
