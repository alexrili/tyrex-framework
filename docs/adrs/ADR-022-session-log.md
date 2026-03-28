# ADR-022: Structured Session Logging

**Status:** Accepted
**Date:** 2026-03-28
**Participants:** Alex (human), Claude (AI)

## Context

EP-008 (Observabilidade e Métricas) establishes the need for structured execution data — not just feelings or prose narratives about what happened. Currently, once a Tyrex session ends (tyrex-do, tyrex-quick), there is no persistent record of what occurred: which tasks ran, which waves executed, what passed or failed, how long things took, or what context was consumed. This makes post-session analysis impossible and blocks downstream features.

Key drivers:

1. **No session history** — after a session ends, all execution knowledge lives only in the chat transcript, which is ephemeral and unstructured
2. **Foundation for EP-008 features** — BL-035 (execution report), BL-036 (quality scorecard), and BL-037 (context usage tracking) all require structured session data as input
3. **Aligned with ADR-016 principle** — "data in YAML, narrative in Markdown" — session data must be machine-parseable for future API exposure
4. **EP-009 direction** — data architecture requires structured, queryable state files; session logs are the first metrics artifact

## Decision

Each execution session (tyrex-do, tyrex-quick) generates a structured YAML log capturing what happened during the session.

### Storage

- **Session files:** `.tyrex/metrics/sessions/SESS-NNN.yml` (one file per session)
- **Index file:** `.tyrex/metrics/index.yml` (enables quick lookup without scanning the directory)
- **Session ID:** auto-increment from index counter (SESS-001, SESS-002, ...)

### Shared Algorithm

- **Location:** `templates/commands/shared/session-log.md`
- Embedded as a shared procedure in command templates that produce sessions
- Producers call the shared algorithm at session start (to initialize) and session end (to finalize)

### Producers and Consumers

| Role | Commands |
|------|----------|
| **Producers** | tyrex-do, tyrex-quick |
| **Consumers (current)** | tyrex-status (shows recent sessions) |
| **Consumers (future)** | execution reports (BL-035), quality scorecards (BL-036), context tracking (BL-037) |

### Data Captured

- Session metadata: ID, feature, command, start/end timestamps, duration
- Task results: task ID, status (pass/fail/skip), wave assignment
- Wave execution info: wave number, tasks in wave, parallel vs sequential
- Commits: hash, message, associated task
- Context checkpoints: files read, tokens estimated
- Verify/review results: pass/fail, issues found

## Alternatives Considered

1. **JSON format** — Less human-readable and inconsistent with existing YAML state files (cursor.yml, task files, backlog items). YAML is the universal structured format in Tyrex.
2. **SQLite database** — Adds a runtime dependency, violating the zero-dep principle established in ADR-016. Filesystem-based YAML is sufficient and git-trackable.
3. **Append-only event log** — Too granular for session-level summary. Fine-grained event streaming is deferred to BL-044 (event stream) in EP-009.
4. **Markdown session reports** — Not machine-parseable. Would require NLP to extract data for reports and scorecards — exactly the problem ADR-016 identified with prose-based findings.

## Consequences

### Positive

- Structured data enables automated execution reports and quality metrics without prose parsing
- Index file prevents O(n) directory scans when looking up sessions
- YAML format is consistent with all other Tyrex state files (cursor.yml, task files, backlog items)
- Session data becomes API-ready, aligned with EP-009 data architecture direction
- Foundation layer — once sessions are logged, BL-035/036/037 become straightforward consumers

### Negative

- Session files accumulate over time (cleanup/rotation deferred — not in scope for BL-034)
- Incremental writes to YAML during execution adds complexity to command prompts (must update file at session start and session end)
- New directory structure (`.tyrex/metrics/`) must be created and documented

### Risks

- Session log writes could fail silently if the metrics directory doesn't exist (mitigated: shared algorithm creates directory on first write)
- Large sessions with many tasks could produce verbose YAML files (mitigated: session is a summary, not an event stream — granularity is bounded)

## Related ADRs

- ADR-016 (Production-Ready v2.0) — parent decision establishing EP-008 and the "data in YAML" principle
- ADR-015 (Backlog system) — backlog items BL-034 through BL-037 are the EP-008 deliverables
