# SPEC: Task 007 — Security hardening review

## Feature
009 — Debug Command

## Objective
Review the debug command template through the DevSec lens, ensuring all command execution paths have proper security guardrails.

## Technical Approach
Review `templates/commands/unified/tyrex-debug.md` for:

1. **Command injection vectors:** Verify no user input is interpolated into shell commands. All commands must be constructed by the agent and presented for approval.
2. **Path traversal:** Verify log file read instructions include path validation (within project directory).
3. **Approval gates:** Every destructive or state-changing command (docker up/down, service restart) requires explicit user approval.
4. **Error message safety:** Bug reports should not expose system paths, credentials, or sensitive environment variables.
5. **Docker command safety:** Verify only read/start operations are used (no `docker rm`, `docker rmi`, or volume deletions).

Also review `/tyrex-new` changes (Task 3) to ensure bug file parsing doesn't introduce issues.

## Files Affected
- `templates/commands/unified/tyrex-debug.md` (refinement if needed)

## Testing Strategy
- Checklist review against DevSec skill review criteria
- Verify each shell command instruction has an approval gate
- Verify no user input concatenation in command templates
