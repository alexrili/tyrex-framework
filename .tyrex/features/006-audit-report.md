# UX Writing Audit Report — Tyrex Framework

## Executive Summary

246 touchpoints audited across 19 files (1 JS + 18 MD).
**Key findings:** 3 systemic issues + 40+ individual improvements.

### Systemic Issues

1. **"demand" vs "feature"** — 50+ occurrences of "demand" used interchangeably with "feature". "Demand" is jargon. Standardize on **"feature"** everywhere.
2. **"quiz" references** — 30+ occurrences of "quiz" as synonym for structured choices. "Quiz" implies testing the user. Replace with **"choices"**.
3. **Repeated boilerplate** — "Adaptive Decision Format" block copy-pasted across 5 commands. Extract to constitution.md.

### Tone Fixes

- 7 exclamation marks in user-facing messages
- 5+ passive voice instances
- 5+ verbose messages that can be shortened
- Informal language ("seems", "you're done!", "there's nothing")

### Formatting Fixes

- Dashboard separator lengths vary (31-40 chars)
- Title style inconsistent (some "TYREX X", some without prefix)
- Label casing mostly consistent (good)
- "Next step" format varies between inline and blockquote

### Error Message Fixes

- 6 error/edge-case messages lack actionable next steps
- 3 messages expose internal paths or alarming terms ("corrupted")

### Prompt Fixes

- 2 open-ended questions should be structured choices
- 3 prompts missing response format hints
- 1 incorrect command reference (/tyrex-status instead of /tyrex-help)

## Action Plan

Task 3: Fix CLI (bin/tyrex.js) — 16 items
Task 4: Fix commands (18 files) — terminology + tone + formatting
