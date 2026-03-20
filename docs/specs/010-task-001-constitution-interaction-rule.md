# SPEC: Task 001 — Update constitution.md with interaction rule

## Feature
010 — Interactive Questions UX

## Objective
Add a global "one question at a time" rule to constitution.md that all commands inherit.

## Technical Approach
Add to "The Agent MUST" section:
> Present ONE structured choice at a time. After presenting a choice, STOP and wait for the user's response before proceeding to the next question. Never combine multiple choice blocks in a single message.

Add to "The Agent MUST NOT" section:
> Batch multiple questions or choice blocks in a single message (exception: configuration review blocks that are a single confirm action)

## Files Affected
- `.tyrex/constitution.md`

## Testing Strategy
- Verify rule is clear and unambiguous
- Verify exception for config review blocks is documented
