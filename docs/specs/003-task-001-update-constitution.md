# SPEC: Task 001 — Update Constitution Rules

## Objective
Replace mandatory "interactive quiz format" with adaptive decision format in constitution files.

## Technical Approach
Edit two lines in both `.tyrex/constitution.md` and `templates/constitution.md`:
1. "The Agent MUST" section: replace quiz mandate with adaptive structured choices rule
2. "The Agent MUST NOT" section: replace "open-ended when quiz is possible" with "open-ended when structured choices are possible"

## Files Affected
- `.tyrex/constitution.md` (lines 31, 54)
- `templates/constitution.md` (same lines)

## Testing Strategy
Quality: optional — manual review of markdown changes.
