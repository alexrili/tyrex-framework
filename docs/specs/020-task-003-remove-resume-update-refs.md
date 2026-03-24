# SPEC: Remove tyrex-resume and Update References

## Task
Feature 020, Task 3 — Remove tyrex-resume and update references

## Date
2026-03-24

## Objective
Delete the old `/tyrex-resume` command and update all references across the codebase to point to `/tyrex-recover`.

## Technical Approach
1. **Delete** `templates/commands/unified/tyrex-resume.md`
2. **Update `templates/CLAUDE.md`** — command table: replace `tyrex-resume` row with `tyrex-recover`
3. **Search and replace** references to `/tyrex-resume` in:
   - All `templates/commands/unified/tyrex-*.md` (commands that mention resume)
   - `.tyrex/TYREX.md` (patterns section)
   - `docs/CHANGELOG.md` (historical references are fine, only update current/unreleased)
   - `bin/tyrex.js` (if it references the command name for installation)
4. **Update `bin/tyrex.js`** — the CLI installs commands by copying from `templates/commands/unified/`. Ensure it picks up `tyrex-recover.md` and no longer references `tyrex-resume.md`

## Constraints & Trade-offs
- Historical references in CHANGELOG (past versions) should NOT be changed — only unreleased/current
- `bin/tyrex.js` may reference command names for installation — must update without breaking the install flow
- Existing symlinks in agent directories will have stale tyrex-resume references until Task 5 syncs

## Dependencies
- Task 2 (tyrex-recover.md must exist before we remove the old command)

## Files Affected
- `templates/commands/unified/tyrex-resume.md` (delete)
- `templates/CLAUDE.md` (edit command table)
- `bin/tyrex.js` (update command references if any)
- Various `templates/commands/unified/tyrex-*.md` (update mentions)

## Edge Cases
- Commands that say "hand off to /tyrex-resume" need to say "/tyrex-recover" instead
- Users with existing installations will have stale symlinks until they run `tyrex` again

## Testing Strategy
Quality: optional (text changes, grep verification)
