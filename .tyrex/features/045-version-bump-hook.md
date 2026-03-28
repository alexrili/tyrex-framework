---
id: "045"
title: "Version Bump Validation Hook"
status: "spec"
branch: "feat/045-version-bump-hook"
epic: "EP-007"
backlog_item: "BL-033"
created: "2026-03-27"
acceptance_criteria:
  - "Detecta CHANGELOG/ADR changes sem version bump"
  - "Suporta múltiplos manifests (package.json, pyproject.toml, etc)"
  - "Warn por default (não block)"
  - "Mensagem indica qual manifest e versão atual"
  - "Skip se nenhum manifest encontrado"
---

## Objective

Pre-commit validator that warns when CHANGELOG.md or ADR files are
staged but no version bump is detected in the package manifest.
Warn-only — does not block (human decides version).

## Technical Notes

- Validator: `templates/hooks/validators/version-check.sh`
- Only runs for "pre-commit" event
- Checks if CHANGELOG.md or docs/adrs/*.md are staged
- If yes: checks if a manifest file is also staged with version change
- Manifests: package.json, composer.json, pyproject.toml, Cargo.toml
- Warn only (exit 0 with stderr message) — never exit 2

## Out of Scope

- Validating semver correctness
- Auto-bumping version
