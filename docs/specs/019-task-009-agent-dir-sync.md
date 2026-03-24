# SPEC: Sync Commands to Agent Directories

## Task
Feature 019, Task 9

## Objective
Re-sync all modified commands and shared docs from `templates/commands/` to all 4 agent directories as the mandatory last step.

## Technical Approach
1. Copy all files from `templates/commands/unified/` to:
   - `.claude/commands/`
   - `.opencode/commands/`
   - `.cursor/rules/tyrex/`
   - `.codex/skills/tyrex/`
2. Copy shared docs from `templates/commands/shared/` to the same directories.
3. Verify all files match.

## Constraints
- Must be the LAST task — any changes after sync will be missed
- Per project pattern: "Sync after every command update"

## Files Affected
- `.claude/commands/` (all modified .md files)
- `.opencode/commands/` (all modified .md files)
- `.cursor/rules/tyrex/` (all modified .md files)
- `.codex/skills/tyrex/` (all modified .md files)

## Testing Strategy
Quality: optional. Verify file contents match source.
