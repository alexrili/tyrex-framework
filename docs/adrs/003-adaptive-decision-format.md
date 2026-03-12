# ADR-003: Adaptive Decision Format (replaces mandatory quiz)

## Status
Accepted

## Date
2026-03-12

## Context
ADR established in 2026-03-10 mandated interactive quiz format (multiple-choice with `[ ]` checkboxes) for ALL user decisions across ALL commands. This works well in CLI-based agents (Claude Code, OpenCode) where users type responses directly. However, in chat-based agents (Cursor, Codex), the markdown checkboxes render as static text — users cannot click or interact with them. This creates a broken UX where the agent presents a quiz the user cannot use.

## Decision
Replace the mandatory quiz format with an **adaptive decision format**. The rule becomes:

> Present decisions as structured choices in the most effective format for the agent's interface:
> - **CLI agents** (Claude Code, OpenCode): numbered quiz — user types a number
> - **Chat-based agents** (Cursor, Codex): numbered list or direct question — user responds naturally in chat
>
> The goal is **structured choices over open-ended questions**, not a specific rendering format.

The core principle remains: never ask open-ended questions when structured options exist. Only the presentation format adapts.

## Consequences
- **Easier:** Cursor and Codex users get a natural interaction flow instead of broken checkboxes
- **Easier:** Framework works consistently across all 4 supported agents
- **Harder:** Commands cannot assume a single format — agents must judge the best presentation
- **Unchanged:** Decisions remain structured (not open-ended), cognitive load stays low

## Alternatives Considered
1. **Keep mandatory quiz, fix Cursor rendering** — Cursor does not support interactive elements in chat. No fix possible on our side.
2. **Make quiz optional entirely** — Loses the structured-choices benefit. Agents would revert to open-ended questions.
3. **Adaptive format (chosen)** — Preserves structured choices while letting the agent pick the best presentation for its interface.
