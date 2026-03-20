# SPEC: Sync commands + update CLI, CHANGELOG, TYREX.md (Feature 011)

## Task
feat-011-task-005

## Objective
Sync the new security-review command to all 4 agent directories, update bin/tyrex.js to include the new command, and update documentation.

## Technical Approach
1. Update `bin/tyrex.js`:
   - Add `tyrex-security-review` to the commands list (installed to agent dirs)
   - Increment command count in help text
2. Update `templates/CLAUDE.md` and `templates/AGENTS.md`:
   - Add `/tyrex-security-review` to the commands table
3. Sync all modified commands to the 4 agent directories
4. Update `docs/CHANGELOG.md` with feature 011 entry
5. Update `.tyrex/TYREX.md` with security review pattern and ADR-009 reference

## Security Considerations
- None

## Constraints & Trade-offs
- Sync must be the LAST step — any changes after sync will be missed
- CHANGELOG format must follow existing conventions

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
- Agent directories don't exist (user hasn't installed for that agent) — skip gracefully

## Testing Strategy
- Quality: required — verify sync completed to all agents, command count updated
