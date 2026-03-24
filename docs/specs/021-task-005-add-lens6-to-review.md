# SPEC: Task 005 — Add Lens 6: Documentation Consistency to tyrex-review.md

## Feature
021 — Quick Rewrite & Doc Impact Analysis

## Objective
Add a 6th review lens to `/tyrex-review` that checks documentation consistency against the branch diff.

## Technical Approach
Add after existing Lens 5 (Test Coverage):

**Lens 6: Documentation Consistency**
> "Does the documentation still reflect reality after these changes?"

1. Reference `templates/commands/shared/doc-impact-analysis.md`
2. Run scan against the full branch diff (`git diff main...HEAD`)
3. For each inconsistency found, report as a finding:
   - Severity: medium (doc drift) or high (config file drift like docker-compose, .env.example)
   - File reference: `doc_file:line_number`
   - What changed vs what the doc says
4. Findings feed into the existing review → fix loop:
   - `--do-all`: auto-create rc- tasks for all doc findings
   - `--do-critical`: auto-create rc- tasks only for high severity (config drift)

Update the command description from "5 critical lenses" to "6 critical lenses".

## Constraints
- Same finding format as other lenses (severity, file:line, description)
- Integrates with existing --do-all/--do-critical flow
- Does not duplicate work if doc update task was already executed during /tyrex-do

## Files Affected
- `templates/commands/unified/tyrex-review.md` (add lens + update description)

## Testing Strategy
Not applicable (markdown prompt file).
