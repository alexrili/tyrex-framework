# SPEC: Update Tyrex commands and docs

## Feature
Feature 005 — Global-Only Installation

## Date
2026-03-12

## Project
tyrex-framework

## Objective
Update Tyrex slash commands, CHANGELOG, and TYREX.md to reflect the global-only installation model.

## Technical Approach

1. **`templates/commands/unified/tyrex-init.md`:** Update to reference `tyrex init` CLI subcommand. The slash command `/tyrex-init` now assumes the CLI `tyrex init` has already been run and focuses on codebase mapping and TYREX.md generation.
2. **`templates/commands/unified/tyrex-help.md`:** Update installation instructions to show global-only flow.
3. **`docs/CHANGELOG.md`:** Add `[0.4.0]` entry documenting:
   - Global-only installation (breaking change)
   - `tyrex init` subcommand for project setup
   - Symlinks for Cursor/Codex
   - Removed `--local`/`--global` flags
4. **`.tyrex/TYREX.md`:** Add architecture decision and update patterns:
   - New pattern: "Global-only install with symlinks"
   - Architecture decision: ADR-005 reference
5. **Sync commands** to all 4 agent directories (Claude, OpenCode, Cursor, Codex)

## Acceptance Criteria
- [ ] `/tyrex-init` references `tyrex init` subcommand
- [ ] `/tyrex-help` shows correct install flow
- [ ] CHANGELOG has `[0.4.0]` entry
- [ ] TYREX.md updated with new pattern and ADR reference
- [ ] All 4 agent command directories synced

## Constraints & Trade-offs
- Only update commands that reference installation — don't touch unrelated commands

## Dependencies
- Tasks 1-3 completed (know final implementation details)

## Files Affected
- `templates/commands/unified/tyrex-init.md` (modify)
- `templates/commands/unified/tyrex-help.md` (modify)
- `docs/CHANGELOG.md` (modify)
- `.tyrex/TYREX.md` (modify)

## Edge Cases
- None

## Testing Strategy
- Visual review of command content

## Rollback Plan
- Revert this commit.
