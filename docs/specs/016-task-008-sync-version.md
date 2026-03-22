# SPEC: 016-task-008 — Sync + CHANGELOG + Version

## Objective

Sync all modified command templates to the 4 agent directories, update CHANGELOG, and bump the project version.

## Technical Approach

1. Copy all modified `.md` files from `templates/commands/unified/` to each agent directory:
   - `.claude/commands/`
   - `.opencode/commands/`
   - `.cursor/rules/tyrex/`
   - `.codex/skills/tyrex/`
2. Verify file counts match across all 5 locations (unified + 4 agents).
3. Update `docs/CHANGELOG.md` with a new entry for feature 016 summarizing all changes.
4. Bump version in `package.json` (minor version increment).
5. Run a final diff check to confirm all agent dirs are in sync with unified templates.

## Files Affected

- `templates/commands/unified/*.md` (source of truth)
- `.claude/commands/*.md`
- `.opencode/commands/*.md`
- `.cursor/rules/tyrex/*.md`
- `.codex/skills/tyrex/*.md`
- `docs/CHANGELOG.md`
- `package.json`

## Testing Strategy

- Diff unified templates against each agent directory; expect zero differences.
- Verify CHANGELOG contains the new feature 016 entry.
- Verify package.json version was incremented correctly.
