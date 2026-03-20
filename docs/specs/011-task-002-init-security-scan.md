# SPEC: Update /tyrex-init — initial security scan + migration

## Task
feat-011-task-002

## Objective
Update `/tyrex-init` to create `.tyrex/security/` directory during project initialization, run an initial security scan, and migrate existing `.tyrex/map/security-audit.md` to the new location.

## Technical Approach
- Add step in `/tyrex-init` (after project structure creation) to:
  1. Create `.tyrex/security/` directory
  2. If `.tyrex/map/security-audit.md` exists, migrate content to `.tyrex/security/audit.md`
  3. Run initial scan using the `/tyrex-security-review` command pattern (inline, not delegating)
  4. Save initial findings to `.tyrex/security/SECURITY-001.md` and `.tyrex/security/audit.md`

## Security Considerations
- Validate file paths during migration to prevent path traversal
- Ensure migration preserves existing `[x]` resolved status

## Constraints & Trade-offs
- Migration is one-time — old file is not deleted (user can clean up manually)
- Initial scan during init should be lightweight (not a full deep scan)

## Dependencies
- Task 1 (command template defines the scan format and report structure)
- Existing /tyrex-init command template

## Files Affected
- `templates/commands/unified/tyrex-init.md` (modify)

## Edge Cases
- Fresh project with no existing security audit file
- Project with existing `.tyrex/security/` from a previous version
- Migration with mixed `[ ]` and `[x]` findings

## Testing Strategy
- Quality: required — verify init creates directory, migration logic is correct
