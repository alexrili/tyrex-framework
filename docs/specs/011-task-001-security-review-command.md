# SPEC: Create /tyrex-security-review command template

## Task
feat-011-task-001

## Objective
Create the core `/tyrex-security-review` command as a markdown prompt template. This is the main deliverable — a comprehensive security scanning command that reads the codebase and generates reports.

## Technical Approach
- Create `templates/commands/unified/tyrex-security-review.md` following the existing command template structure (frontmatter + Agent Mode + Adaptive Decision Format + Behavior sections)
- Plan mode only — reads code, generates reports, never modifies source
- Scan scope: secrets/envs, sensitive data in logs/comments, logical vulns (injection, auth bypass, path traversal), unprotected endpoints, OWASP Top 10
- Output: per-session report in `.tyrex/security/SECURITY-NNN.md` (sequential numbering like DEBUG-NNN)
- Consolidated audit in `.tyrex/security/audit.md` with `[ ]`/`[x]` status tracking
- Preserve previous `[x]` statuses when generating new reports
- Mirror `.tyrex/bugs/` pattern from `/tyrex-debug` for consistency

## Security Considerations
- Path traversal: ensure file scanning stays within project boundaries using `path.resolve()` checks
- No dynamic code execution during scanning
- Report output sanitized (no executable content in markdown)

## Constraints & Trade-offs
- Command must work for ANY project stack, not just Node.js
- Finding rows are never deleted, only marked `[x]` when resolved
- Session reports are immutable once created

## Dependencies
- Existing command template patterns (tyrex-debug.md as closest reference)
- DevSec skill for security domain expertise

## Files Affected
- `templates/commands/unified/tyrex-security-review.md` (create)

## Edge Cases
- Project with no source code (only config) — should still scan for secrets
- Very large codebases — scanning strategy should be pragmatic, not exhaustive
- First run vs subsequent runs — handle missing `.tyrex/security/` directory
- Existing `.tyrex/map/security-audit.md` — migration handled in Task 2

## Testing Strategy
- Quality: required — manual verification of command template completeness and correctness
- Verify all sections match framework command conventions
- Verify scan scope covers all items from feature spec acceptance criteria
