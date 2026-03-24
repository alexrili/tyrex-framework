# ADR-013: Tyrex Recover — Forensic Crash Recovery Replacing Resume

## Status
Accepted

## Date
2026-03-24

## Participants
- Alex Lima (product owner, architect)
- Claude (AI pair programmer)

## Context
The existing `/tyrex-resume` command reads `cursor.yml` to restore session state. This works when the previous session ended gracefully (cursor was updated). But when the LLM session disconnects abruptly — network failure, auth expiry, service outage — the agent may have been mid-task: code partially written, files modified, but neither committed nor reflected in `.tyrex/` state. The cursor still points to the last *completed* task, not the interrupted one.

Three approaches were evaluated:
1. **Checkpoint-heavy** — write cursor on every file change (high I/O, clutters git diff)
2. **External watchdog** — background process monitors session health (dependency, complexity)
3. **Forensic recovery** — reconstruct state from evidence (git diff, timestamps, task files) on demand

The key insight: git already tracks what changed. Task state files track what was planned. The delta between them reveals what was interrupted.

## Decision
We adopt forensic recovery that replaces `/tyrex-resume`:

1. **Replace, don't add** — `/tyrex-recover` subsumes `/tyrex-resume`. Normal resume (no crash) is a fast-path within recover. One command, two modes. Removes `/tyrex-resume` from the command set.

2. **Evidence-based detection** — Crash signals are computed by comparing git state (dirty tree, branch, file mtimes) against `.tyrex/` state (cursor, task files, feature files). No new persistent state needed.

3. **Three crash signals** — (a) dirty tree with stale cursor, (b) task state mismatch (file says in_progress, cursor disagrees), (c) timestamp drift (working tree newer than cursor.last_updated).

4. **Always ask, never assume** — Uncommitted changes are always presented to the user with choices: keep, stash, discard. No silent decisions on potentially valuable work.

5. **Auto-fix with guard rails** — When changes are coherent (single task, tests pass), offer to auto-complete the interrupted task. Requires explicit user confirmation.

6. **Pre-flight in all commands** — Every `/tyrex-*` command runs a lightweight crash detection check. If crash signals are found, suggests running `/tyrex-recover` before proceeding.

7. **Shared crash detection** — Detection logic lives in `templates/commands/shared/crash-detection.md`, included by all commands. Keeps detection consistent and maintainable.

## Consequences

### Positive
- Handles the most common crash scenario (network disconnect) without new infrastructure
- No new dependencies or background processes
- Subsumes `/tyrex-resume` — simpler mental model (one command instead of two)
- Pre-flight detection catches crashes proactively, even when user doesn't realize
- Evidence-based approach works without requiring eager state writes

### Negative
- Cannot recover LLM conversation context (provider responsibility)
- Forensics depend on git — if user runs `git checkout .` before recovery, changes are lost
- Pre-flight adds ~1-2s latency to every command (mitigated: only when crash signals found)
- Auto-fix confidence is heuristic — may suggest completion when changes are actually broken

## Alternatives Considered

| Alternative | Pros | Cons | Why rejected |
|-------------|------|------|-------------|
| Checkpoint on every write | Perfect state always | High I/O, noisy git diff, slows agent | Over-engineered for the problem frequency |
| External watchdog process | Detects crash in real-time | New dependency, platform-specific, complexity | Violates zero-dependency principle |
| Keep resume + add recover | No breaking change | Two overlapping commands, confusing UX | Resume is strictly a subset of recover |
