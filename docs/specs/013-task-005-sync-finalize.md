# SPEC: Sync commands + update CLI, CHANGELOG, TYREX.md (Feature 013)

## Task
feat-013-task-005

## Objective
Sync the new test-review command to all 4 agent directories, update bin/tyrex.js, and update documentation.

## Technical Approach
1. Update `bin/tyrex.js`:
   - Add `tyrex-test-review` to the commands list
   - Increment command count in help text
2. Update `templates/CLAUDE.md` and `templates/AGENTS.md`:
   - Add `/tyrex-test-review` to the commands table
3. Sync all modified commands to 4 agent directories
4. Update `docs/CHANGELOG.md` with feature 013 entry
5. Update `.tyrex/TYREX.md` with test-first-class pattern and ADR-010 reference

## Security Considerations
- None

## Constraints & Trade-offs
- Sync must be the LAST step
- CHANGELOG format must follow existing conventions
- Command count must be accurate across all references

## Dependencies
- Tasks 1-4 (all command modifications must be complete before sync)

## Files Affected
- `bin/tyrex.js` (modify)
- `templates/CLAUDE.md` (modify)
- `templates/AGENTS.md` (modify)
- `docs/CHANGELOG.md` (modify)
- `.tyrex/TYREX.md` (modify)
- All agent command directories (sync)

## Edge Cases
- Agent directories don't exist — skip gracefully

## Testing Strategy
- Quality: required — verify sync, command count, CHANGELOG accuracy
