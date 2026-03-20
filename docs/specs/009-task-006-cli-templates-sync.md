# SPEC: Task 006 — Update CLI + templates + sync to agent directories

## Feature
009 — Debug Command

## Objective
Register the new command in all framework touchpoints and sync to all 4 agent directories.

## Technical Approach
1. **`bin/tyrex.js`**: Verify the unified command source pattern auto-discovers new `.md` files (if it does, no change needed). If commands are listed explicitly, add `tyrex-debug.md`.
2. **`templates/CLAUDE.md`**: Add `/tyrex-debug` row to the Commands Available table.
3. **`templates/AGENTS.md`**: Add `/tyrex-debug` row to the Commands Available table.
4. **Sync**: Copy all files from `templates/commands/unified/` to all 4 agent command directories (claude, opencode, cursor, codex). This is the LAST step per project patterns.

## Files Affected
- `bin/tyrex.js` (if explicit command list exists)
- `templates/CLAUDE.md` (modified)
- `templates/AGENTS.md` (modified)
- `.claude/commands/` (sync)
- `.opencode/commands/` (sync)
- `.cursor/rules/tyrex/` (sync)
- `.codex/skills/tyrex/` (sync)

## Testing Strategy
- Verify command table includes `/tyrex-debug` in both CLAUDE.md and AGENTS.md
- Verify all 4 agent directories have the new command file
- Verify existing commands were not modified during sync
