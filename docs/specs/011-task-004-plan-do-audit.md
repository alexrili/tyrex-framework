# SPEC: Integrate audit.md into /tyrex-plan and /tyrex-do

## Task
feat-011-task-004

## Objective
Make `/tyrex-plan` cross-reference security findings and `/tyrex-do` resolve findings when completing security tasks.

## Technical Approach

### /tyrex-plan changes:
- In Step 2 (Security-First Analysis): also read `.tyrex/security/audit.md`
- Cross-reference known findings with the current feature's scope
- Pre-populate security tasks from known pending findings that overlap with the feature's files
- Add note in proposed tasks: "Addresses SECURITY-NNN finding: [description]"

### /tyrex-do changes:
- After completing any task with `security` attribute or `rc-*` prefix:
  1. Read `.tyrex/security/audit.md`
  2. If the task addresses a known finding, mark it `[x]` with resolution date
  3. Update the audit.md file

## Security Considerations
- Data sanitization: when writing to audit.md, ensure finding descriptions don't contain injection vectors
- Validate `[ ]` → `[x]` transition (never revert `[x]` to `[ ]`)

## Constraints & Trade-offs
- /tyrex-plan only suggests, never auto-creates security tasks without showing them in the plan
- /tyrex-do only marks findings when task explicitly addresses them (via task metadata)

## Dependencies
- Task 1 (defines audit.md format and finding structure)

## Files Affected
- `templates/commands/unified/tyrex-plan.md` (modify)
- `templates/commands/unified/tyrex-do.md` (modify)

## Edge Cases
- No audit.md exists during planning — skip cross-reference
- Task addresses a finding that was already resolved
- Multiple tasks address the same finding

## Testing Strategy
- Quality: required — resolution tracking must be reliable
