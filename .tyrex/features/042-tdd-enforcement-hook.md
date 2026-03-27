---
id: "042"
title: "TDD Enforcement Hook"
status: "spec"
branch: "feat/042-tdd-enforcement-hook"
epic: "EP-007"
backlog_item: "BL-030"
created: "2026-03-27"
acceptance_criteria:
  - "Hook detecta source files staged sem test files correspondentes"
  - "Respeita quality strategy (required = block, recommended = warn, optional = skip)"
  - "Suporta convenções comuns (*.test.*, *.spec.*, __tests__/)"
  - "Configurável via tyrex.yml (padrões de test files)"
  - "Mensagem indica quais source files não têm testes"
  - "Flag --no-tdd-check para bypass explícito"
---

## Objective

Pre-commit validator that checks: if source files are staged, corresponding
test files should exist. Enforcement level follows tyrex.yml quality.strategy
per area (required=block, recommended=warn, optional=skip).

## Technical Notes

- Validator: `templates/hooks/validators/tdd-check.sh`
- Only runs for "pre-commit" event (not pre-tool-use)
- Reads staged files from TYREX_STAGED_FILES env var (set by pre-commit runner)
- Maps source files to test files via naming conventions
- Reads tyrex.yml quality.strategy to determine area→enforcement
- Area detection: api/, workers/, data/ → required; frontend/ → recommended; etc.
- Bypass: checks for TYREX_NO_TDD_CHECK=1 env var or --no-tdd-check in commit

## Out of Scope

- Running the actual tests (that's the test runner's job)
- Creating test files (that's the agent's job during /tyrex-do)
