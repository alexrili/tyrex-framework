# SPEC: Rewrite qa-engineer skill

## Objective
Rewrite qa-engineer.md from 48 to ~100 lines with concrete, actionable patterns for test design, fixture management, flaky test diagnosis, and coverage strategy.

## Technical Approach
- Add patterns for test design: AAA (Arrange-Act-Assert), boundary value analysis, equivalence partitioning
- Add fixture/factory management patterns: builder pattern, shared fixtures, teardown discipline
- Add flaky test diagnosis workflow: isolation, timing sensitivity, order dependency detection
- Add coverage measurement strategy: branch vs line, meaningful thresholds, coverage ratchet
- Expand review criteria to 15+ items covering test naming, assertion quality, and independence
- Keep stack-agnostic with language-specific notes (Jest, pytest, Go testing, etc.)

## Files Affected
- `templates/skills/qa-engineer.md`
- `.tyrex/skills/qa-engineer.md`

## Testing Strategy
N/A (markdown documentation)
