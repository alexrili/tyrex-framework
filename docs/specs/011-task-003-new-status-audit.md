# SPEC: Integrate audit.md into /tyrex-new and /tyrex-status

## Task
feat-011-task-003

## Objective
Make `/tyrex-new` and `/tyrex-status` security-aware by reading `.tyrex/security/audit.md`.

## Technical Approach

### /tyrex-new changes:
- Add Step 0b (after bug check, before roadmap): Read `.tyrex/security/audit.md`
- If pending `[ ]` findings exist, show count and offer structured choices:
  - "Fix security findings first (create feature from finding)"
  - "Continue with new feature (findings noted)"
- Similar pattern to existing bug check in Step 0

### /tyrex-status changes:
- Add security section that reads `.tyrex/security/audit.md`
- Display: total findings, pending `[ ]`, resolved `[x]`, last scan date
- Read from `.tyrex/security/` instead of `.tyrex/map/security-audit.md`

## Security Considerations
- None (read-only consumers of audit data)

## Constraints & Trade-offs
- Both commands are read-only consumers — they display data, never modify audit.md

## Dependencies
- Task 1 (defines audit.md format)

## Files Affected
- `templates/commands/unified/tyrex-new.md` (modify)
- `templates/commands/unified/tyrex-status.md` (modify)

## Edge Cases
- No `.tyrex/security/audit.md` exists — skip section gracefully
- All findings resolved — show "all clear" message
- Malformed audit.md — degrade gracefully

## Testing Strategy
- Quality: recommended — verify sections are added correctly
