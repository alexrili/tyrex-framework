# ADR-006: Skill Evolution via /tyrex-review

## Status
Accepted

## Date
2026-03-12

## Participants
- Human: product direction and scope decisions
- AI: technical design and implementation approach

## Context

The Tyrex skills system (ADR-002) introduced reusable AI agent personas stored as markdown files in `.tyrex/skills/`. Skills have a `## Patterns` section designed to grow over time and a `## Review Criteria` section for self-checks. However, no mechanism exists to actually populate these sections from real project experience.

Currently:
1. **Skills are static after creation.** The `## Patterns` and `## Review Criteria` sections remain as they were written initially, never reflecting what the agent learns from actual code reviews.
2. **Review findings are lost.** `/tyrex-review` identifies patterns, anti-patterns, and recurring issues, but these insights disappear after the review — they are not persisted anywhere reusable.
3. **No skill creation from reviews.** When `/tyrex-review` finds patterns in areas without a corresponding skill, there is no suggestion to create one.

This means the framework has a knowledge acquisition system (review) and a knowledge application system (skills) that are disconnected.

## Decision

Extend `/tyrex-review` with a **knowledge extraction step** (new Step 5b, after TYREX.md evolution) that:

1. **Evolves existing skills** — After each review, the agent analyzes findings and updates the `## Patterns` section of relevant skills with new patterns discovered. Also updates `## Review Criteria` if new checklist items emerge.

2. **Suggests new skills** — If review findings reveal recurring patterns in areas without an existing skill, the agent suggests creating a new skill pre-populated with the patterns just identified.

### Mechanism

**Pattern extraction rules:**
- A finding that appears 2+ times across files → candidate for a pattern
- A finding that matches an existing skill's expertise domain → update that skill
- A finding with no matching skill → suggest creating a new skill
- CRITICAL/HIGH findings always generate pattern entries (even if seen once)

**Skill update format:**
- New patterns are appended to `## Patterns` with a date header
- Each pattern entry includes: description, example (code reference), and the review where it was found
- `## Review Criteria` gets new checklist items if the review reveals checks not currently listed
- Skills have a max size of 150 lines — if approaching the limit, the agent summarizes older patterns

**User control:**
- Pattern additions are presented for approval before writing
- The user can reject, edit, or approve each addition
- `--do-all` flag auto-approves pattern additions

### Integration points

| Step | What happens |
|------|-------------|
| Review Step 5b (new) | Extract patterns from findings, propose skill updates |
| Review Step 6 | Summary includes "Skills updated: [list]" or "New skills suggested: [list]" |
| Review Step 9 | Skill files are committed alongside other changes |

## Consequences

**Positive:**
- Skills become living documents that improve with every review cycle
- Project-specific knowledge accumulates automatically
- Future reviews are more precise because skills have richer patterns
- New team members benefit from accumulated institutional knowledge
- The `## Patterns` section — previously empty or static — becomes the most valuable part of each skill

**Negative:**
- Skill files grow over time (mitigated: 150-line limit with summarization)
- Review takes slightly longer due to the knowledge extraction step
- Risk of noisy pattern additions (mitigated: user approval before writing)

## Alternatives Considered

1. **Separate knowledge-base file** — Rejected: duplicates skill content, adds another file to maintain. Skills already have the right structure for this.
2. **Automatic pattern addition without approval** — Rejected: risk of noisy or incorrect patterns degrading skill quality. User approval is essential.
3. **Only update patterns on `/tyrex-review full`** — Rejected: PR reviews are more frequent and produce more actionable patterns. Both scopes should contribute.

## Related ADRs
- ADR-002: Skills System (foundation this builds on)
