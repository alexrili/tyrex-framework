# ADR-008: One Question at a Time — Sequential Interaction Pattern

## Status
Accepted

## Date
2026-03-19

## Participants
- Human: identified the UX problem (inconsistent batching of questions)
- AI: technical design and implementation approach

## Context

Tyrex commands use "Adaptive Decision Format" — structured choices presented to the user during workflows like `/tyrex-new`, `/tyrex-plan`, `/tyrex-do`, and `/tyrex-quick`. The intent is interactive, one-at-a-time question flow.

However, AI agents reading the command templates sometimes batch 3-5 questions into a single output. This happens because:

1. **No explicit "wait" instruction** — templates list sequential steps with questions, but don't explicitly tell the agent to stop and wait for a response between each.
2. **Adjacent choice blocks** — when multiple `[1] / [2] / [3]` blocks appear in proximity, agents treat them as a single composite output.
3. **The Adaptive Decision Format section** describes the format but not the cadence.

The result: users sometimes face a wall of text with multiple choice groups, losing the interactive feel and having to answer a combo of 4-5 questions at once.

## Decision

Establish a **"One question at a time"** interaction rule enforced at three levels:

1. **Constitution rule** (global, authoritative): Add to "The Agent MUST" section a clear rule requiring one question per message, wait for response before next.

2. **Adaptive Decision Format section** (per command): Strengthen the boilerplate paragraph in every command template to include explicit sequential instruction.

3. **Step-level markers** (in templates): Add brief "Present and wait for response." notes at decision points in the most complex commands.

### The rule

> Present ONE structured choice at a time. After presenting a choice, STOP and wait for the user's response before proceeding to the next question. Never combine multiple choice blocks in a single message. If a step has a decision point, that step's output ends at the choice — the next step begins only after the user responds.

### Exceptions
- **Confirmation of defaults** — when showing a pre-filled configuration (like the docs bundle in `/tyrex-new` Step 4), multiple sections CAN be shown together because they are a single "review and confirm" action, not separate questions.
- **Status/summary output** — non-interactive output (like `/tyrex-status`) can show all information at once since no response is expected.

## Consequences

### Positive
- Consistent interactive experience across all commands and all AI agents
- Users answer one question at a time — less cognitive load
- Each response can inform the next question (adaptive flow)
- Works better with CLI agents where long outputs scroll off screen

### Negative
- More back-and-forth turns in the conversation (mitigated: each turn is faster)
- Slightly more verbose templates (mitigated: one line per decision point)

## Alternatives Considered

1. **Only fix per-command templates** — Rejected: without a global rule, new commands would repeat the same problem. The constitution rule prevents this.
2. **Create a shared include/macro** — Rejected: markdown command templates don't support includes. The boilerplate must be in each file.
3. **Only fix the most problematic commands** — Rejected: inconsistency is the root problem. A partial fix creates inconsistency elsewhere.

## Related ADRs
- ADR-003: Adaptive Decision Format (this builds on it, adding cadence rules)
