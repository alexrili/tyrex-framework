# Feature 013 — Automated tests as first-class citizen

## Objective
Make test coverage a proactive framework concern: dedicated scan command for coverage gaps, plus integration across all commands to ensure no implementation passes without at least asking about tests.

## Acceptance Criteria
- Command `/tyrex-test-review` scans project for test gaps with argued suggestions
- Plan mode only — identifies gaps, generates reports, never writes tests
- Session reports in `.tyrex/tests/TEST-REVIEW-NNN.md`
- Consolidated view in `.tyrex/tests/coverage-gaps.md` with tracking
- `/tyrex-init` detects test infrastructure; suggests framework + structure if absent
- `/tyrex-plan` includes test task per implementation task (TDD first); critical flows get dedicated test task
- `/tyrex-do` runs test suite before commit; generates mini-report
- `/tyrex-review` flags implementations without tests as finding; runs test suite and reports
- `/tyrex-new` reads `coverage-gaps.md`, shows relevant gaps, can create feature from gap
- Framework never lets an implementation pass without asking about tests
- Built-in `qa-engineer` skill template shipped with framework

## Out of Scope
- Writing tests automatically
- Measuring code coverage percentages (tools like istanbul/c8)
- Performance/load testing

## Skills
- qa-engineer

## Configuration
- Docs: CHANGELOG, SPEC per task, ADR-010
- Branch: feat/013-tests-first-class
- Commit mode: approve each

## Tasks
1. Create /tyrex-test-review command template [qa-engineer] (large)
2. Update /tyrex-init — detect test infrastructure [qa-engineer] (small) ‖
3. Integrate test awareness into /tyrex-new + /tyrex-review [qa-engineer] (medium) ‖
4. Integrate test awareness into /tyrex-plan + /tyrex-do [qa-engineer] (medium) ‖
5. Sync commands + update CLI, CHANGELOG, TYREX.md (small)

Wave 6: T1 → Wave 7: T2‖T3‖T4 → Wave 8: T5

## Status
done
