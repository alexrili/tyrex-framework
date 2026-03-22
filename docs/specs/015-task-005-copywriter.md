# SPEC: Improve copywriter skill

## Objective
Enhance copywriter.md from 105 to ~120 lines by adding patterns for dialogs, progress indicators, structured display, and color/emoji usage policy.

## Technical Approach
- Add confirmation/warning dialog patterns: destructive action phrasing, cancel-first ordering, severity levels
- Add progress indicator patterns: spinner vs progress bar selection, ETA display, completion summary format
- Add structured tables/lists display: column alignment, truncation rules, empty-state messaging
- Add color/emoji usage policy: when to use color, accessibility considerations, CI/plain-text fallback
- Tighten existing patterns for consistency with new additions

## Files Affected
- `templates/skills/copywriter.md`
- `.tyrex/skills/copywriter.md`

## Testing Strategy
N/A (markdown documentation)
