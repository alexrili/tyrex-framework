# SPEC: Create /tyrex-test-review command template

## Task
feat-013-task-001

## Objective
Create the `/tyrex-test-review` command as a markdown prompt template for scanning test coverage gaps with argued suggestions.

## Technical Approach
- Create `templates/commands/unified/tyrex-test-review.md` following existing command conventions
- Plan mode only — identifies gaps, generates reports, never writes tests
- Scan strategy:
  1. Detect test framework (jest.config, vitest.config, phpunit.xml, pytest.ini, etc.)
  2. Map test files to source files (convention-based: `foo.test.js` → `foo.js`)
  3. Identify critical flows: payment, auth, API endpoints, data writes, user input handling
  4. Classify gaps by risk: critical (must test), important (should test), nice-to-have (could test)
  5. Argue each suggestion with context ("this endpoint handles user payments with no input validation test")
- Output: per-session report in `.tyrex/tests/TEST-REVIEW-NNN.md`
- Consolidated view in `.tyrex/tests/coverage-gaps.md` with tracking
- Mirror `.tyrex/security/` and `.tyrex/bugs/` patterns for consistency

## Security Considerations
- Input validation: test framework detection should not execute any code, only read config files
- File path validation when scanning test directories

## Constraints & Trade-offs
- Intelligent suggestions, not generic — every suggestion must have a "why"
- Does NOT write tests, run tests, or fix code
- Works for ANY project stack, not just Node.js

## Dependencies
- QA Engineer skill for testing domain expertise

## Files Affected
- `templates/commands/unified/tyrex-test-review.md` (create)

## Edge Cases
- Project with no test framework — report the absence, suggest setup
- Project with tests but no config file — detect by convention (test/, __tests__/, *.test.*, *.spec.*)
- Monorepo with multiple test frameworks — handle each package
- First run vs subsequent — handle missing `.tyrex/tests/` directory

## Testing Strategy
- Quality: required — verify command template completeness and argued suggestions pattern
