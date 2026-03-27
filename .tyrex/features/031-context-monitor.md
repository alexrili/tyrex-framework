# Feature 031 — Context Monitor

## Summary
Add context window monitoring to long-running commands. Estimates token usage
and injects warnings when thresholds are crossed. Suggests actions like spawning
sub-agents or starting fresh sessions.

## Source
Backlog item BL-019 (EP-006 — Execution Engine, Phase 6)
Inspired by GSD framework's gsd-context-monitor hook.

## Acceptance Criteria
- Token estimation mechanism based on approximate message/file counts
- Configurable thresholds in tyrex.yml (50%, 70%, 85%)
- Warnings injected naturally in response, without interrupting flow
- Action suggestions when threshold high (fresh session, sub-agent, etc.)
- Integration with /tyrex-status to show context health
- Works in any runtime (no agent-specific hooks required)

## Out of Scope
- Exact token counting (impossible without API access)
- Runtime hooks (gsd-style JS hooks — Tyrex is prompt-only)
- Changes to bin/tyrex.js

## Technical Approach
1. tyrex.yml — add context_engineering.monitoring section with thresholds
2. Shared template — new context-monitor.md with estimation heuristics + warning format
3. tyrex-do.md — integrate monitoring checkpoint after each task
4. tyrex-status.md — add context health section
5. TYREX.md + CHANGELOG + version bump + sync

## Files Affected
- .tyrex/tyrex.yml + templates/tyrex.yml
- templates/commands/shared/context-monitor.md (new)
- templates/commands/unified/tyrex-do.md
- templates/commands/unified/tyrex-status.md
- .tyrex/TYREX.md
- docs/CHANGELOG.md
