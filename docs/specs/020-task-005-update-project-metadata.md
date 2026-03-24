# SPEC: Update Project Metadata

## Task
Feature 020, Task 5 — Update project metadata

## Date
2026-03-24

## Objective
Update TYREX.md with new patterns for crash recovery and the recover command. Update any remaining documentation references.

## Technical Approach
1. **Update `.tyrex/TYREX.md`:**
   - Add pattern: "Crash recovery via forensics" — evidence-based state reconstruction from git + `.tyrex/` state
   - Add pattern: "Pre-flight crash detection" — all feature-operating commands check for crash signals
   - Add pattern: "/tyrex-recover replaces /tyrex-resume" — single command for both normal resume and crash recovery
   - Update command count (tyrex-resume removed, tyrex-recover added = net 0 change, but command name changed)
   - Update any references to tyrex-resume in patterns section
2. **Update `docs/CHANGELOG.md`** — finalize the unreleased entry for this feature
3. **Update `.tyrex/features/020-tyrex-recover.md`** — set status to reflect plan complete

## Constraints & Trade-offs
- TYREX.md has a living patterns section — add concisely, don't duplicate ADR content
- CHANGELOG entry was started during /tyrex-new — update with final task details

## Dependencies
- Tasks 2, 3, 4 (need to know final state of all changes)

## Files Affected
- `.tyrex/TYREX.md` (edit patterns section)
- `docs/CHANGELOG.md` (edit unreleased section)

## Edge Cases
- None significant

## Testing Strategy
Quality: optional (documentation updates)
