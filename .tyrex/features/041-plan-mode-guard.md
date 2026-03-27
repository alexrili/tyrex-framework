---
id: "041"
title: "Plan Mode Enforcement Hook"
status: "spec"
branch: "feat/041-plan-mode-guard"
epic: "EP-007"
backlog_item: "BL-029"
created: "2026-03-27"
acceptance_criteria:
  - "Hook lê cursor.yml e verifica agent_mode"
  - "Em plan mode, bloqueia escrita de source code files"
  - "Permite escrita de .tyrex/, docs/, markdown, YAML"
  - "Mensagem clara quando bloqueia"
  - "Em build mode, permite tudo (pass-through)"
  - "Performance < 100ms por invocação"
---

## Objective

Create a validator script that plugs into the hook infrastructure (BL-028).
When agent_mode is "plan" in cursor.yml, block Write/Edit of source code files.
Allow state/config/docs files. In build mode, pass-through (allow all).

## Technical Notes

- Validator goes in `templates/hooks/validators/plan-mode-guard.sh`
- Uses `tyrex_yaml_get` from lib/common.sh to read cursor.yml
- Uses `tyrex_is_source_file` from lib/common.sh for classification
- Only runs for "pre-tool-use" event (not pre-commit/commit-msg)
- Exit 0 = allow, Exit 2 = block (per validator protocol)

## Out of Scope

- Modifying the hook runner or library (already done in BL-028)
- Other validators (TDD, changelog — BL-030 through BL-033)
