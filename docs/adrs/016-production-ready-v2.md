# ADR-016: Production-Ready v2.0 — Enforcement, Observability, Data Architecture, Governance

**Status:** Accepted
**Date:** 2026-03-27
**Participants:** Alex (human), Claude (AI)

## Context

After completing EP-006 (GSD Execution Engine), analysis revealed that while Tyrex has strong governance design (constitution, skills, TYREX.md) and execution architecture (fresh context, waves, UAT), 95% of guardrails are prompt-based — the agent can choose to ignore them. Additionally, findings and session data are stored as prose markdown, making API consumption impossible without NLP.

Key gaps identified:
1. **No mechanical enforcement** — hooks exist only for OpenCode (plugin.ts), not for Claude Code or other runtimes
2. **No observability** — no structured logs, no metrics, no way to know if guardrails are actually followed
3. **Data not API-ready** — security findings, bug reports, test gaps stored as prose MD with checkbox tracking
4. **No governance layer** — no configurable policies, no compliance reports, no drift detection

## Decision

Restructure Tyrex for production readiness via 4 epics (EP-007 through EP-010), targeting v2.0 as a breaking change.

### Principles

1. **Data in YAML, narrative in Markdown with YAML frontmatter** — every file that needs to be queried by an API has structured data extractable without parsing prose
2. **If the agent can ignore it, it's a suggestion, not a guardrail** — mechanical enforcement via runtime hooks
3. **Single source of truth** — eliminate manual consolidated views; queries replace aggregations
4. **Claude Code first, LLM-agnostic architecture** — hooks designed for portability
5. **Breaking change over backward compatibility** — framework is early stage; clean cut is better than compat shims

### Epic Structure

- **EP-007: Enforcement Mecânico** (6 items) — Claude Code hooks infrastructure, plan mode enforcement, TDD enforcement, CHANGELOG validation, semantic commit validation, version bump validation
- **EP-008: Observabilidade e Métricas** (4 items) — Session logs, execution reports, quality scorecards, context usage tracking
- **EP-009: Data Architecture** (9 items) — JSON Schemas, MD→YAML migration for findings/bugs/tests, feature frontmatter, roadmap consolidation, event stream, state normalization, command template updates
- **EP-010: Governance Layer** (4 items) — Policy engine, approval gates, compliance reports, drift detection

### Execution Order

EP-007 → EP-008 → EP-009 → EP-010

Rationale: enforcement first (without it, metrics are unreliable), then observability (to measure), then data restructuring (to serve), then governance (which needs structured data).

### Key Migrations

| From | To | Rationale |
|------|----|-----------|
| `security/audit.md` (checkbox MD) | `security/findings/SEC-NNN-FFF.yml` | Queryable by API |
| `security/SECURITY-NNN.md` (prose) | Per-finding YAML files | Granular, structured |
| `bugs/DEBUG-NNN.md` (prose) | `bugs/findings/BUG-NNN-FFF.yml` | Same |
| `tests/TEST-REVIEW-NNN.md` (prose) | `tests/gaps/TST-NNN-FFF.yml` | Same |
| `features/NNN-*.md` (pure MD) | Same file + YAML frontmatter | Data extractable, narrative preserved |
| `ROADMAP.md` + `roadmap.yml` (3 files) | `backlog/ROADMAP.yml` (single source) | Eliminate redundancy |
| `map/` (static, drifts) | Eliminated — on-demand scan | No stale data |
| Manual consolidated views | Eliminated — runtime queries | Single source of truth |

### Eliminated Artifacts

- `.tyrex/security/audit.md` — replaced by queries over findings/
- `.tyrex/bugs/coverage-gaps.md` — replaced by queries over findings/
- `.tyrex/tests/coverage-gaps.md` — replaced by queries over gaps/
- `.tyrex/map/` (4 files) — replaced by on-demand scan
- `templates/roadmap.yml` — redundant empty template
- Legacy cursor.yml fields (active_feature, active_feature_file)
- Legacy task file naming (feat-NNN-task-MMM.yml)

## Consequences

### Positive
- Every data point is API-queryable without prose parsing
- Mechanical enforcement prevents guardrail drift
- Observability enables data-driven quality decisions
- Governance layer enables team-scale adoption
- JSON Schemas serve as documentation + validation + API contracts
- Event stream enables future event sourcing and state reconstruction

### Negative
- Breaking change requires v2.0 major bump
- 23 backlog items is significant work
- All 4 agent directories need re-sync after template updates
- Users on v1.x need migration guide

### Risks
- Hook performance could slow down agent execution (mitigated: <100ms target per hook)
- YAML findings could create many small files (mitigated: one per finding is manageable, and enables granular queries)
- Event stream could grow large over time (mitigated: daily rotation, grep/jq for queries)

## Alternatives Considered

1. **Gradual migration with backward compatibility** — Rejected. Maintaining dual formats increases complexity and testing burden. Framework is early stage; clean cut is better.
2. **SQLite instead of YAML files** — Rejected. Adds runtime dependency (violates zero-dep principle). YAML files are human-readable, git-trackable, and sufficient for filesystem-based state.
3. **Skip governance, just do enforcement + data** — Rejected. Governance is what makes Tyrex useful for teams, not just individuals. It's the differentiator vs GSD.

## Related ADRs

- ADR-016 through ADR-021 (GSD integration) — foundation this builds on
- ADR-009 (Security review) — security findings format changes
- ADR-010 (Test review) — test gaps format changes
- ADR-015 (Backlog system) — backlog items format preserved
