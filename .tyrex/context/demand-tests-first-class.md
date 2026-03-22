# Demand: Automated tests as first-class citizen

> Discussed on 2026-03-20. Ready for implementation.

## Summary

Two axes: a dedicated `/tyrex-test-review` command for scanning test coverage gaps, plus integration across all existing commands to ensure the framework never lets an implementation pass without at least asking about tests.

## Axis A — `/tyrex-test-review` command

Dedicated command. Plan mode, read-only. Similar to `/tyrex-security-review`.

**What it does:**
- Maps existing test coverage (frameworks, test files, what's covered)
- Identifies critical flows without tests — not "everything needs a test", but "these specific flows need tests and here's why"
- Argues each suggestion with context (e.g., "this endpoint processes payments and has no input validation test")
- Generates per-session report in `.tyrex/tests/TEST-REVIEW-NNN.md`
- Maintains consolidated view in `.tyrex/tests/coverage-gaps.md` (source of truth)

**What it does NOT do:**
- Write tests
- Run tests
- Fix code

## Axis B — Integration in existing commands

| Command | Behavior |
|---------|----------|
| `/tyrex-init` | Detect if project has tests. If not: suggest framework + initial structure |
| `/tyrex-plan` | Each implementation task includes test sub-task (TDD first). Critical flows get dedicated test task |
| `/tyrex-do` | Before committing: run tests if they exist, generate mini-report in output |
| `/tyrex-review` | Check if implementation has tests. If not: finding. Run test suite and report results |
| `/tyrex-new` | Read `coverage-gaps.md`, show relevant gaps. Can create feature from a test gap |

## Core principle

**The framework never lets an implementation pass without at least asking about tests.**

Even if the human decides not to write tests, the framework must ask. This is a proactive behavior — the framework identifies missing tests and suggests them without being asked.

## Design decisions

- Mirrors `.tyrex/security/` and `.tyrex/bugs/` patterns for consistency
- Test suggestions are intelligent, not generic — argue the "why" for each suggestion
- TDD first: suggest tests before implementation when possible
- Can create demands/features from identified test gaps
- Run existing tests before commit to catch regressions
