# ADR-014: Quick Rewrite as Orchestrator + Doc Impact Analysis

## Date
2026-03-24

## Status
Accepted

## Context

Two gaps were identified in the framework:

1. `/tyrex-quick` was implemented as a compressed pipeline that reimplements new/plan/do in abbreviated form. Language like "collapses the ceremony", "fewer steps", and "Skip this step" caused agents to skip stages entirely — no SPECs, no ADRs, no proper planning, no version bumps. The intent was to auto-approve confirmations, not to reduce work.

2. The framework enforces CHANGELOG, SPEC, version bump, and security audit — but has no mechanism to detect when code changes make existing documentation (README, wiki, OpenAPI, config files) inconsistent. This is the core problem Tyrex was built to solve, yet it has a blind spot for doc-code drift.

## Decision

### Quick as Orchestrator
Rewrite `/tyrex-quick` to be an orchestrator that delegates to the full logic of existing commands:
- Execute `/tyrex-new` internally with auto-approve on confirmations
- Execute `/tyrex-plan` internally with auto-approve on confirmations
- Execute `/tyrex-do` internally with auto-approve on confirmations

The command does NOT reimplement any stage logic. It references the existing commands and adds `--auto` semantics. Clarification questions for genuine ambiguities are still asked.

### Doc Impact Analysis as Shared Algorithm
Create `templates/commands/shared/doc-impact-analysis.md` — a shared algorithm (like crash-detection.md and external-tracker-sync.md) that:
- Scans project docs, framework docs, and config files
- Matches against code changes (ports, routes, env vars, CLI args, config values)
- Outputs inconsistency list
- Auto-creates fix tasks when drift detected

Integrated into 3 commands: `/tyrex-plan` (predictive), `/tyrex-do` (post-implementation), `/tyrex-review` (Lens 6).

## Consequences

### Positive
- Quick produces identical output to manual workflow — user trust restored
- Doc drift caught mechanically — no reliance on agent memory
- Shared algorithm reusable across commands (same pattern as crash-detection)
- Existing `/tyrex-readme`, `/tyrex-openapi`, `/tyrex-wiki` can be invoked by fix tasks

### Negative
- Quick command file becomes shorter but depends on other command files being in context
- Doc scan adds ~2-5s per checkpoint (acceptable trade-off)
- False positives possible on common patterns (mitigated by specific matching)

## Alternatives Considered

1. **Keep quick as compressed pipeline, just fix the language** — Rejected. The root cause is structural: reimplementing logic leads to drift between quick and the real commands.
2. **Doc consistency as a separate command only** — Rejected. Must be automated and integrated into the workflow, not optional.
3. **Doc impact as part of CHANGELOG check only** — Rejected. Too narrow. Needs to run at plan time (predictive) and review time (validation).
