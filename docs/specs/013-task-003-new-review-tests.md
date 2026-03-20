# SPEC: Integrate test awareness into /tyrex-new and /tyrex-review

## Task
feat-013-task-003

## Objective
Make `/tyrex-new` surface coverage gaps and `/tyrex-review` flag missing tests and run test suites.

## Technical Approach

### /tyrex-new changes:
- Add Step 0c (after security check): Read `.tyrex/tests/coverage-gaps.md`
- If relevant gaps exist for the feature domain, show them with structured choices:
  - "Create feature to address test gap"
  - "Continue with new feature (gaps noted)"

### /tyrex-review changes:
- Add to Lens 2 (Code Quality) or as Lens 5: test coverage check
  1. For each file changed in the branch, check if a corresponding test file exists
  2. If implementation has no tests → flag as finding (severity based on file criticality)
  3. If test framework detected, run test suite and report results
  4. Include test results in review summary

## Security Considerations
- Running test suites: use the project's configured test command, do not construct shell commands from user input

## Constraints & Trade-offs
- /tyrex-review runs tests but doesn't fail the review on test failures (reports them)
- Test existence check is convention-based (may miss unconventional test structures)

## Dependencies
- Task 1 (defines coverage-gaps.md format)

## Files Affected
- `templates/commands/unified/tyrex-new.md` (modify)
- `templates/commands/unified/tyrex-review.md` (modify)

## Edge Cases
- No test framework → skip test execution, still check for test files
- Tests take too long → timeout handling with structured choice to skip
- All tests passing → clean summary

## Testing Strategy
- Quality: required — test execution integration must be reliable
