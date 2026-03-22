# SPEC: Verify consistency and sync

## Objective
Verify all 8 skills have consistent structure, correct line counts, and matching section format. Ensure templates/skills/ is identical to .tyrex/skills/.

## Technical Approach
- Read all 8 skill files in both templates/skills/ and .tyrex/skills/
- Verify required section headers: Role, Expertise, Guidelines, Patterns, Review Criteria
- Verify line counts are within 80-130 range for each skill file
- Diff templates/skills/ against .tyrex/skills/ to confirm identical copies
- Report any discrepancies for correction before marking feature complete

## Files Affected
- `templates/skills/qa-engineer.md`
- `templates/skills/release-engineer.md`
- `templates/skills/devsec.md`
- `templates/skills/debugger.md`
- `templates/skills/copywriter.md`
- `templates/skills/backend-engineer.md`
- `templates/skills/frontend-engineer.md`
- `templates/skills/product-manager.md`
- `.tyrex/skills/` (same 8 files)

## Testing Strategy
N/A (markdown documentation)

## Edge Cases
- A skill might have non-standard section naming (e.g., "Review Checklist" vs "Review Criteria")
- Line count may drift during editing; verify after final edits, not during drafting
