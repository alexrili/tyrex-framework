# SPEC: Task 1 — Add Step 5b (Knowledge Extraction) to /tyrex-review

## Objective
Insert a new Step 5b into the `/tyrex-review` command (between TYREX.md evolution and review summary) that extracts patterns from review findings and proposes skill updates.

## Technical Approach
Add a new `### Step 5b: Skill evolution` section to `templates/commands/unified/tyrex-review.md` with:

1. **Pattern extraction logic** — instructions for the agent to:
   - Scan all findings from the 4 lenses
   - Match findings to existing skills by comparing finding domain against each skill's `## Expertise` section
   - Identify CRITICAL/HIGH findings as automatic pattern candidates
   - Identify findings appearing 2+ times across files as pattern candidates
   - Detect unmatched domains that suggest a new skill

2. **Skill update proposal** — instructions to:
   - Draft new `## Patterns` entries (date, description, code reference, review source)
   - Draft new `## Review Criteria` checklist items for uncovered checks
   - Present the proposed additions for user approval
   - Handle `--do-all` flag: auto-approve pattern additions
   - Handle the 150-line limit: summarize older patterns if approaching limit

3. **New skill suggestion** — instructions to:
   - When findings match no existing skill, suggest creating one
   - Pre-populate the new skill with patterns from the current review
   - Present structured choices: create now / skip / create later

## Files Affected
- `templates/commands/unified/tyrex-review.md` — add Step 5b section (~40-50 lines)

## Edge Cases
- No skills exist in `.tyrex/skills/` → all findings trigger "suggest new skill"
- All findings match existing skills → no new skill suggestion, only updates
- Skill at 150-line limit → summarize before appending
- Zero findings in review → skip Step 5b entirely
- `--do-all` flag → auto-approve all pattern additions

## Testing Strategy
Quality: optional (documentation/command template change). Manual verification by running `/tyrex-review` after changes.
