# SPEC: Add Crash Detection Pre-flight to All Commands

## Task
Feature 020, Task 4 — Add crash detection pre-flight to all commands

## Date
2026-03-24

## Objective
Add the shared crash detection pre-flight check to all `/tyrex-*` commands that operate on features, so crash signals are detected proactively before the user even runs `/tyrex-recover`.

## Technical Approach
For each command in `templates/commands/unified/`, add a pre-flight section that includes the shared crash-detection procedure. The section goes BEFORE the command's main behavior (Step 0 or before Step 1).

**Commands that need pre-flight** (operate on features or state):
- tyrex-do.md
- tyrex-plan.md
- tyrex-review.md
- tyrex-new.md
- tyrex-status.md
- tyrex-quick.md
- tyrex-evolve.md
- tyrex-settings.md
- tyrex-discuss.md
- tyrex-context.md
- tyrex-skills.md

**Commands that do NOT need pre-flight** (standalone, no feature state):
- tyrex-recover.md (IS the recovery command)
- tyrex-init.md (project setup, no features yet)
- tyrex-help.md (informational only)
- tyrex-readme.md (doc generation, reads codebase)
- tyrex-openapi.md (doc generation)
- tyrex-wiki.md (doc generation)
- tyrex-research.md (standalone research)
- tyrex-security-review.md (standalone scan)
- tyrex-test-review.md (standalone scan)
- tyrex-debug.md (standalone diagnosis)
- tyrex-handoff.md (deprecated, delegates to /tyrex-quick)

**Pre-flight block to add** (referencing shared/crash-detection.md):
```markdown
### Pre-flight: Crash Detection
Before proceeding, check for crash signals per `templates/commands/shared/crash-detection.md`.
If crash detected: present "Inconsistent state detected. Run /tyrex-recover or continue anyway?"
If no crash: proceed normally.
```

## Constraints & Trade-offs
- Must not change existing command behavior — only add the pre-flight check
- Pre-flight adds ~1 paragraph to each command — minimal token overhead
- Commands that already have Step 0 (like tyrex-new with roadmap check) get pre-flight BEFORE Step 0

## Dependencies
- Task 1 (crash-detection.md must be defined)
- Task 3 (tyrex-resume.md removed, so we don't add pre-flight to a deleted command)

## Files Affected
- ~11 files in `templates/commands/unified/` (edit, add pre-flight section)

## Edge Cases
- Commands with `--auto` flag: pre-flight should auto-choose "continue" if crash signals are low-severity
- Commands already in recovery context (called from within /tyrex-recover): skip pre-flight to avoid loops

## Testing Strategy
Quality: optional (markdown text additions, grep to verify all target commands have the section)
