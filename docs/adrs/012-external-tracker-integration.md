# ADR-012: External Tracker Integration via MCP

## Status
Accepted

## Date
2026-03-23

## Participants
- Alex Lima (product owner, architect)
- Claude (AI pair programmer)

## Context
Tyrex features live locally in `.tyrex/features/`. Teams using project management tools (Jira, Linear, GitHub Issues) must manually duplicate feature information, subtasks, and status updates between Tyrex and their tracker. This creates friction and discourages adoption in teams with established PM workflows.

Three approaches were evaluated: MCP-only (agent delegates to MCP server), API-direct (CLI makes HTTP calls), and hybrid (CLI for standalone, MCP for in-agent). The key constraint is Tyrex's zero-dependency policy and agent-agnostic design.

A critical lifecycle insight emerged during design: Tyrex controls only the development phase (code writing → local review). The post-development pipeline (QA, human code review, staging, production) is outside Tyrex's scope. Therefore, Tyrex must never mark remote issues as "done" — only as "in review".

## Decision
We adopt MCP-only integration with forward-only status sync:

1. **MCP-only architecture** — Tyrex CLI (`bin/tyrex.js`) never makes HTTP calls. All tracker communication is delegated to the AI agent via MCP tools. `tyrex.yml` stores configuration (provider, project, user) but not credentials. Auth is managed by the MCP server.

2. **No new commands** — Integration is woven into 6 existing commands (`/tyrex-new`, `/tyrex-plan`, `/tyrex-do`, `/tyrex-review`, `/tyrex-settings`, `/tyrex-status`) plus `tyrex init`. Behavior is activated by the presence of `external_ref` in feature state.

3. **Two import modes** — Read-only (context only, zero writes to remote) and build (assign + bidirectional sync + subtask creation).

4. **Forward-only status with lifecycle boundary** — Tyrex only pushes status forward, never backward. Maximum status Tyrex pushes is `review`. The `done` transition is owned by the human/pipeline (QA, code review, deploy). Before any push, Tyrex pulls current remote status to detect drift.

5. **Generic status model** — Four statuses (`todo`, `in_progress`, `review`, `done`). Provider-specific mapping is implicit in command instructions, not config-driven.

6. **Comment trail** — Every status update adds a comment: "Updated by {user} — powered by Tyrex Framework".

## Consequences

### Positive
- Zero new dependencies — consistent with project DNA
- Provider-agnostic — works with any tracker that has an MCP server
- No new commands to learn — natural extension of existing workflow
- Respects post-dev pipeline — never short-circuits QA/review by marking "done"
- Graceful degradation — if MCP server unavailable, commands skip sync with warning

### Negative
- Requires MCP server configured in user's AI agent — setup friction
- MCP tool names vary per provider — command instructions need conditional blocks
- Forward-only rule means Tyrex can't correct status regressions made externally
- No offline sync — requires active AI agent session for tracker operations

## Alternatives Considered

1. **API-direct (CLI makes HTTP calls)** — Rejected because it would require adding HTTP client logic to `bin/tyrex.js`, managing auth tokens, and creating provider-specific adapters. Breaks zero-dependency policy.

2. **Hybrid (CLI for standalone, MCP for in-agent)** — Rejected for complexity. Two code paths for the same operation increases maintenance and testing burden.

3. **New `/tyrex-sync` command** — Rejected. Sync should be automatic and implicit, not a manual step. Adding a command increases surface area without proportional value.

4. **Tyrex sets "done" on remote** — Rejected after lifecycle analysis. Development "done" is not delivery "done". Pushing "done" would short-circuit QA, human review, and deployment processes.

## Related ADRs
- ADR-011: Multi-demand branch-based context (feature state model this extends)
- ADR-003: Adaptive decision format (import mode choices follow this pattern)
