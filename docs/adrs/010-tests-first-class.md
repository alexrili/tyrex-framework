# ADR-010: Automated Tests as First-Class Citizen

## Status
Accepted

## Date
2026-03-20

## Context
The framework mandates TDD in the constitution but has no mechanism to enforce or verify test existence. Implementations can pass through `/tyrex-do` and `/tyrex-review` without any automated tests. There is no way to scan a project for test coverage gaps or identify critical flows that lack tests.

## Decision
Two-axis approach: (1) Create a dedicated `/tyrex-test-review` command that scans the project for test coverage gaps, identifies critical untested flows, and generates reports with argued suggestions. (2) Integrate test awareness into existing commands — `/tyrex-init` detects test infrastructure, `/tyrex-plan` includes test tasks per implementation, `/tyrex-do` runs tests before commit, `/tyrex-review` flags missing tests, `/tyrex-new` surfaces coverage gaps. Core principle: the framework never lets an implementation pass without at least asking about tests.

## Consequences
- **Positive:** TDD mandate becomes enforceable, not just aspirational
- **Positive:** Critical flows are identified and tested proactively
- **Positive:** Test gaps are tracked persistently like security findings
- **Positive:** Consistent pattern with `.tyrex/security/` and `.tyrex/bugs/`
- **Negative:** One more command to maintain; integration touches 5 existing commands
- **Trade-off:** Framework becomes more opinionated about testing — intentional
