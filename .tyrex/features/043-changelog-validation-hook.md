---
id: "043"
title: "CHANGELOG Validation Hook"
status: "spec"
branch: "feat/043-changelog-validation-hook"
epic: "EP-007"
backlog_item: "BL-031"
created: "2026-03-27"
acceptance_criteria:
  - "Bloqueia commit se source files staged sem CHANGELOG entry"
  - "Permite commits de .tyrex/ files sem CHANGELOG"
  - "Permite commits de docs/ files sem CHANGELOG"
  - "Mensagem clara indicando que CHANGELOG é obrigatório"
  - "Flag --no-changelog para bypass explícito"
---

## Objective

Pre-commit validator that ensures CHANGELOG.md is updated when source
code files are committed. Allows state-only and docs-only commits
without CHANGELOG.

## Technical Notes

- Validator: `templates/hooks/validators/changelog-check.sh`
- Only runs for "pre-commit" event
- Checks if any staged file is source code (uses tyrex_is_source_file)
- If source code staged: checks if docs/CHANGELOG.md is also staged
- Bypass: TYREX_NO_CHANGELOG=1 env var

## Out of Scope

- Validating CHANGELOG content/format (just checks presence)
