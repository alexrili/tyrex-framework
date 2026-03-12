# SPEC: Update README and help text

## Feature
Feature 005 — Global-Only Installation

## Date
2026-03-12

## Project
tyrex-framework

## Objective
Update README.md and help output to reflect the new global-only installation model.

## Technical Approach

1. **README.md:**
   - Replace install instructions: `npm install -g tyrex-framework` → `tyrex` → `tyrex init` in each project
   - Remove any mention of `--local`/`--global` flags
   - Update file structure section to show what's global (`~/`) vs local (`.tyrex/`)
   - Update examples section
2. **Help text in `printHelp()`:**
   - Already updated in Task 1 — this task focuses on README

## Acceptance Criteria
- [ ] README install section shows global-only flow
- [ ] No references to `--local`/`--global` flags
- [ ] File structure section distinguishes global vs local files

## Constraints & Trade-offs
- Keep README concise — don't over-explain symlinks

## Dependencies
- Task 1 (to know final CLI interface)

## Files Affected
- `README.md` (modify)

## Edge Cases
- None

## Testing Strategy
- Visual review of README rendering

## Rollback Plan
- Revert this commit.
