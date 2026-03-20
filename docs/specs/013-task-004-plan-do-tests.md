# SPEC: Integrate test awareness into /tyrex-plan and /tyrex-do

## Task
feat-013-task-004

## Objective
Make `/tyrex-plan` include test tasks per implementation and `/tyrex-do` run tests before commit.

## Technical Approach

### /tyrex-plan changes:
- In Step 3 (task decomposition): for each implementation task, include a test sub-task or note
  - TDD first: suggest writing tests before implementation when quality is `required`
  - Critical flows (identified from context/SRS) get dedicated test tasks
  - Test tasks can be parallel with other test tasks (different files)
- Cross-reference `.tyrex/tests/coverage-gaps.md` for known gaps in affected files

### /tyrex-do changes:
- Before commit (after code is written, before staging):
  1. Detect test framework and test command
  2. Run test suite
  3. If tests fail: show failures, offer structured choices (fix / skip with note / abort)
  4. If tests pass: include pass count in commit message or task output
  5. Generate mini-report: "Tests: 42 passed, 0 failed, 3 skipped"
- With `--auto-approve`: auto-retry once on test failure, then fail the task

## Security Considerations
- Input validation: test command should come from package manifest scripts, not user-constructed strings
- Never run `eval()` or construct shell commands dynamically

## Constraints & Trade-offs
- Test execution requires a detected test framework — graceful skip if none
- Framework asks about tests even if user decides not to write them (core principle)
- Mini-report is concise — full details in test runner output

## Dependencies
- Task 1 (defines test infrastructure detection pattern)

## Files Affected
- `templates/commands/unified/tyrex-plan.md` (modify)
- `templates/commands/unified/tyrex-do.md` (modify)

## Edge Cases
- No test framework detected → ask "Write tests? No test framework detected. Set up first?"
- Tests exist but no test script in manifest → try common commands (npm test, pytest, etc.)
- Test suite hangs → timeout after configurable duration

## Testing Strategy
- Quality: required — test execution before commit is a critical framework behavior
