# SPEC: Task 4 — Sync Updated Command to All Agent Directories

## Objective
Copy the updated `tyrex-review.md` to all 4 agent command directories per the project pattern.

## Technical Approach
Copy `templates/commands/unified/tyrex-review.md` to:
- `.claude/commands/tyrex-review.md`
- `.opencode/commands/tyrex-review.md`
- `.cursor/rules/tyrex/tyrex-review.md`
- `.codex/skills/tyrex/tyrex-review.md`

Pattern: "Sync after every command update" (TYREX.md).

## Files Affected
- `.claude/commands/tyrex-review.md`
- `.opencode/commands/tyrex-review.md`
- `.cursor/rules/tyrex/tyrex-review.md`
- `.codex/skills/tyrex/tyrex-review.md`

## Testing Strategy
Quality: optional. Verify file contents match source.
