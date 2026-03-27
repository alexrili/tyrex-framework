---
id: "040"
title: "Claude Code Hooks Infrastructure"
status: "spec"
branch: "feat/040-hooks-infrastructure"
epic: "EP-007"
backlog_item: "BL-028"
created: "2026-03-27"
acceptance_criteria:
  - "Estrutura templates/hooks/ com scripts de validação"
  - ".claude/settings.json configurado com hooks PreToolUse para Write|Edit"
  - "Hook runner genérico que descobre e executa validators, retorna allow/block"
  - "tyrex init instala hooks automaticamente para agentes detectados"
  - "Hooks não quebram se .tyrex/ não existe (graceful skip)"
  - "Zero dependencies extras (usa Node.js para JSON parsing)"
---

## Objective

Create the hook infrastructure that enables mechanical enforcement of Tyrex guardrails.
Shell scripts in `templates/hooks/` serve as runtime-agnostic validators.
Claude Code hooks config in `.claude/settings.json` wires them to PreToolUse events.
`tyrex init` auto-installs hooks for detected agents. Future BL items (029-033)
plug validators into this infrastructure.

## Technical Notes

- Claude Code hooks: PreToolUse event with Write|Edit matcher
- Hook receives JSON on stdin: `{tool_name, tool_input: {file_path, content}}`
- Exit 2 = block, exit 0 = allow, JSON output for structured decisions
- JSON parsing: `jq` preferred, Node.js fallback (guaranteed by framework)
- Git hooks: pre-commit and commit-msg runners (validators added by BL-030-033)
- Validator pattern: executable scripts in `validators/` dir, auto-discovered

## Out of Scope

- Specific validators (plan mode, TDD, changelog, commit lint, version bump)
- Those are BL-029 through BL-033 — separate features
- HTTP hooks, async hooks, agent hooks (future)
