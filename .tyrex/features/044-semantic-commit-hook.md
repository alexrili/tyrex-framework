---
id: "044"
title: "Semantic Commit Validation Hook"
status: "spec"
branch: "feat/044-semantic-commit-hook"
epic: "EP-007"
backlog_item: "BL-032"
created: "2026-03-27"
acceptance_criteria:
  - "Valida formato conventional commit no commit message"
  - "Suporta prefixos padrão (feat, fix, chore, etc)"
  - "Suporta prefixos Tyrex (backlog, discuss, plan, evolve, etc)"
  - "Mensagem clara com formato esperado quando inválido"
  - "Aceita breaking change indicator (!)"
  - "Flag --no-commit-lint para bypass"
---

## Objective

Commit-msg validator that ensures all commit messages follow the
conventional commits format, including Tyrex-specific prefixes.

## Technical Notes

- Validator: `templates/hooks/validators/commit-lint.sh`
- Only runs for "commit-msg" event
- Reads commit message from TYREX_COMMIT_MSG env var
- Regex validation with conventional + Tyrex prefixes
- Bypass: TYREX_NO_COMMIT_LINT=1

## Out of Scope

- Validating commit body content or length
