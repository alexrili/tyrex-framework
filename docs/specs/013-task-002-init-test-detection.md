# SPEC: Update /tyrex-init — detect test infrastructure

## Task
feat-013-task-002

## Objective
Update `/tyrex-init` to detect existing test infrastructure and suggest framework + structure if absent.

## Technical Approach
- Add step in `/tyrex-init` (after security scan, before summary):
  1. Scan for test config files (jest.config.*, vitest.config.*, phpunit.xml, pytest.ini, .rspec, etc.)
  2. Scan for test directories (test/, tests/, __tests__/, spec/)
  3. Scan for test scripts in package manifest (test, test:unit, test:e2e)
  4. If found: report what was detected, create `.tyrex/tests/` directory
  5. If not found: suggest test framework based on project stack with structured choices
  6. Create `.tyrex/tests/` directory regardless

## Security Considerations
- None (read-only detection + directory creation)

## Constraints & Trade-offs
- Detection only — never installs test frameworks or creates test files
- Suggestion is informational, not prescriptive

## Dependencies
- Task 1 (defines report format and directory structure)

## Files Affected
- `templates/commands/unified/tyrex-init.md` (modify)

## Edge Cases
- Multiple test frameworks detected — list all
- Test framework in devDependencies but no config — note discrepancy

## Testing Strategy
- Quality: recommended — verify detection covers major frameworks
