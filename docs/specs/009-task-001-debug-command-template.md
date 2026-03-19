# SPEC: Task 001 — Create /tyrex-debug command template

## Feature
009 — Debug Command

## Objective
Create the core `/tyrex-debug` markdown command template that instructs AI agents to run structured interactive debug sessions with infrastructure management, log analysis, and persistent bug documentation.

## Technical Approach
Write `templates/commands/unified/tyrex-debug.md` following the established command template pattern (frontmatter + Agent Mode + Adaptive Decision Format + Behavior steps). The command must cover:

1. **Session initialization:** Set plan mode, load debugger skill (suggest creation if missing), determine next DEBUG-NNN number
2. **Investigation mode selection:** User-directed (describe symptom) or automatic (broad scan)
3. **Diagnostic depth:** Quick (logs + code), Standard (+ traces + tests), Deep (+ health checks + metrics) — presented as structured choices
4. **Infrastructure management:** Check docker/service status, offer to start with user permission, present every command before execution
5. **Evidence collection:** Read logs (filter ERROR/WARN/FATAL), parse stack traces, map to source files, run tests if available
6. **Hypothesis loop:** Form hypothesis → test → narrow/pivot → document. Interactive with user in directed mode, autonomous in auto mode
7. **Bug documentation:** Generate `.tyrex/bugs/DEBUG-NNN.md` with structured findings (severity, status, symptom, root cause, evidence, affected area, suggested fix, reproduction)
8. **Session wrap-up:** Present summary, offer to mark bugs as resolved, update cursor.yml

## Security Considerations
- **Command injection prevention:** Every shell command (docker, service start, log read) MUST be presented to user for approval. Never interpolate user-provided text into shell commands.
- **Path traversal:** Validate log file paths stay within project directory.
- **Error safety:** Do not expose internal file paths or system info in bug reports beyond what's needed for diagnosis.

## Constraints & Trade-offs
- Plan mode only — no source code modifications
- Must work without Docker (gracefully skip container features per NFR-003)
- Follows adaptive decision format (structured choices per ADR-003)
- Bug report format must match SRS Section 4 schema

## Files Affected
- `templates/commands/unified/tyrex-debug.md` (new)

## Edge Cases
- No Docker installed → skip container checks, inform user
- No logs found → inform user, suggest alternative sources
- Empty project (no services) → automatic mode limited to code-only analysis
- Multiple docker-compose files → ask user which one

## Testing Strategy
- Verify command template follows established patterns (frontmatter, agent mode, sections)
- Verify all SRS functional requirements (FR-001 through FR-013) are addressed
- Verify security guardrails are present in the template
