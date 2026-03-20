# SPEC: Update constitution + TYREX.md + sync + finalize (Feature 012)

## Task
feat-012-task-003

## Objective
Add versioning as a framework directive in constitution.md, document the pattern in TYREX.md, sync commands, and update CHANGELOG.

## Technical Approach
1. **constitution.md**: Add rule: "Version bump is mandatory — when CHANGELOG or ADR changes, detect package manager, suggest semver bump, propagate version, include in commit"
2. **TYREX.md**: Add versioning pattern to Project Patterns section. Add ADR reference to Architecture Decisions table.
3. **templates/CLAUDE.md + AGENTS.md**: No new command to add, but update if pattern section exists
4. **Sync** all modified command templates to 4 agent directories
5. **CHANGELOG**: Add feature 012 entry
6. **bin/tyrex.js**: No changes needed (no new command)

## Security Considerations
- None

## Constraints & Trade-offs
- Constitution rule must be concise and enforceable
- TYREX.md update should reference ADR and summarize behavior

## Dependencies
- Tasks 1, 2 (all command modifications must be complete before sync)

## Files Affected
- `.tyrex/constitution.md` (modify)
- `.tyrex/TYREX.md` (modify)
- `templates/CLAUDE.md` (modify — if applicable)
- `templates/AGENTS.md` (modify — if applicable)
- `docs/CHANGELOG.md` (modify)
- All agent command directories (sync)

## Edge Cases
- None significant

## Testing Strategy
- Quality: required — constitution rule must be clear and not conflict with existing rules
