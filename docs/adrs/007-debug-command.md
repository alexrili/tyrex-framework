# ADR-007: Interactive Debug Command with Persistent Bug Registry

## Status
Accepted

## Date
2026-03-19

## Participants
- Human: product direction, feature scope, and UX decisions
- AI: technical design and documentation

## Context

Tyrex provides a complete development lifecycle (new -> plan -> do -> review) but has no mechanism for structured debugging. When developers encounter bugs:

1. **Debugging is ad-hoc** — happens outside the Tyrex workflow, losing context
2. **Findings are not persisted** — root cause analysis and evidence disappear after the session
3. **No bridge to fix workflow** — there is no path from "bug found" to "bug fixed via /tyrex-do"
4. **Infrastructure setup is manual** — developers manage containers/services separately

The `/tyrex-discuss` command enables exploration and discussion but is not designed for systematic diagnosis with infrastructure interaction and bug documentation.

## Decision

Create `/tyrex-debug` as a plan-mode command that:

1. **Manages infrastructure directly** — checks container/service status, starts them with user permission. The agent runs docker/service commands after presenting them to the user for approval.

2. **Offers flexible diagnostic depth** — user chooses quick (logs only), standard (+ traces + tests), or deep (+ health checks + metrics). This avoids forcing a heavyweight process for simple issues.

3. **Supports two investigation modes:**
   - **User-directed:** User describes the symptom, agent follows their lead
   - **Automatic:** Agent takes the pilot, runs services, reads all logs, generates broad diagnostic

4. **Documents findings as a bug registry** — session reports in `.tyrex/bugs/DEBUG-NNN.md` with structured bug entries (severity, evidence, suggested fix). One file per session, multiple bugs per file.

5. **Integrates with `/tyrex-new`** — before asking for a feature description, the command checks `.tyrex/bugs/` for open bugs and offers "fix bugs first?" This closes the loop between diagnosis and fix.

6. **Ships with a debugger skill** — `templates/skills/debugger.md` provides the debug engineer persona. Auto-suggested when `/tyrex-debug` is invoked and the skill is not installed.

### Key design choices:
- **One file per session (not per bug):** A debug session often finds related issues. Grouping them preserves the investigation context and narrative flow. Individual bugs are sections within the file.
- **Plan mode only:** The command diagnoses and documents — it never fixes. This maintains the Tyrex principle of separating diagnosis from implementation.
- **User approval for all commands:** Every docker/service command is shown before execution. No automatic infrastructure changes.

## Consequences

### Positive
- Bugs are persistently documented with evidence and reproduction steps
- The diagnosis-to-fix pipeline is closed (/tyrex-debug -> /tyrex-new -> /tyrex-plan -> /tyrex-do)
- Infrastructure management is integrated into the workflow
- Debug sessions are repeatable — the report serves as documentation
- Command count: 20 (was 19)

### Negative
- Adds complexity to `/tyrex-new` (bug check step)
- Docker interaction introduces security surface (mitigated: user approval for all commands)
- Bug reports may accumulate if not cleaned up (mitigated: show age, allow manual cleanup)

## Alternatives Considered

1. **Extend /tyrex-discuss for debugging** — Rejected: discuss is read-only exploration without infrastructure interaction or structured output. Debug needs a distinct workflow.
2. **One file per bug** — Rejected: loses investigation narrative. Multiple related bugs in one session share context (same service, same log analysis). The session file preserves this.
3. **Auto-fix mode** — Rejected: violates the Tyrex principle that diagnosis and implementation are separate phases. Debug finds, /tyrex-do fixes.

## Related ADRs
- ADR-002: Skills System (debugger skill follows this pattern)
- ADR-003: Adaptive Decision Format (structured choices in debug flow)
