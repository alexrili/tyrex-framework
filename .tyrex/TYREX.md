# TYREX - tyrex-framework

> This is a living document. Update it as the project evolves.
> Every pattern discovered, every hurdle solved, every decision made should be documented here.
> AI agents read this before every interaction — invest in it, it pays back exponentially.

## Project Overview

Tyrex Framework is a human-driven, AI-accelerated pair programming workflow orchestrator distributed as an npm CLI tool. It scaffolds configuration files and markdown-based slash commands into projects, enabling structured AI-assisted development across multiple AI coding agents (Claude Code, OpenCode, Cursor, Codex). The framework enforces TDD, changelogs, small atomic commits, and documentation-first practices.

## Tech Stack

- **Language:** JavaScript (Node.js, vanilla — no TypeScript)
- **Runtime:** Node.js >= 18.0.0
- **Module System:** CommonJS
- **Package Manager:** npm
- **Dependencies:** Zero runtime dependencies (Node.js built-ins only: `fs`, `path`, `readline`, `os`)
- **Framework:** None — pure Node.js stdlib
- **Database:** None (filesystem-based state via YAML)
- **Deploy:** npm registry (`tyrex-framework` package)
- **CI:** Not yet configured

## Architecture

```
CLI Scaffolding Tool + Prompt Engineering Framework

User runs `npx tyrex-framework`
  → Interactive setup (agent selection, config)
  → Scaffolds .tyrex/ directory (state, config, templates)
  → Installs slash commands to agent-specific directories
  → Commands are markdown instruction files for AI agents

bin/tyrex.js (~427 lines, single-file CLI)
  ├── main()                  Entry point, interactive flow
  ├── installCommands()       Copy .md commands to agent dirs
  ├── installTyrexStructure() Scaffold .tyrex/ and docs/
  ├── copyTemplate()          {{PLACEHOLDER}} interpolation
  ├── handleUninstall()       Remove agent commands
  └── ask/choose/confirm()    Readline helpers
```

**Supported Agents:**
| Agent       | Commands Dir             | Instructions     |
|-------------|--------------------------|------------------|
| Claude Code | `.claude/commands/`      | `CLAUDE.md`      |
| OpenCode    | `.opencode/commands/`    | `AGENTS.md`      |
| Cursor      | `.cursor/rules/tyrex/`   | `CLAUDE.md`      |
| Codex       | `.codex/skills/tyrex/`   | `CLAUDE.md`      |

## Project Patterns

- **Single-file CLI:** All runtime logic in `bin/tyrex.js` (~427 lines)
- **Template-driven output:** All scaffolded files use `{{PLACEHOLDER}}` interpolation via `copyTemplate()`
- **Two template modes:** Core files (tyrex.yml, TYREX.md, etc.) are interpolated at install time; user templates (spec.md, adr.md, etc.) are copied as-is with placeholders intact for AI agents to fill at generation time
- **Agent-agnostic commands:** One set of 18 command definitions in `templates/commands/unified/` is copied to all agent directories
- **Self-hosted:** Tyrex uses itself (`.tyrex/` exists in the repo)
- **Naming:** files=lowercase-hyphenated, JS constants=UPPER_SNAKE_CASE, JS functions=camelCase
- **Documentation layers:** SPEC (mandatory per task), SRS, PRD (suggested per demand), context ingestion at project and demand levels
- **Skills as personas:** Skills in `.tyrex/skills/` are markdown persona files (Role, Expertise, Guidelines, Patterns, Review Criteria). Auto-suggested during `/tyrex-new`, assigned to tasks during `/tyrex-plan`, loaded as context during `/tyrex-do`
- **Sync after every command update:** When updating commands in `templates/commands/unified/`, ALWAYS re-sync to all 4 agent directories as the LAST step — updates made after sync will be missed
- **Agent mode (plan/build):** Every command declares its mode (`plan` or `build`) in an `## Agent Mode` section and sets `agent_mode` in `cursor.yml` as its first action. Plan mode = no source code writes. Build mode = full implementation with TDD. Enforced via triple layer: cursor.yml state + constitution rules + per-command instructions.
- **Security finding tracking:** `.tyrex/map/security-audit.md` uses a `Status` column (`[ ]` pending, `[x]` resolved) consumed by `/tyrex-status` and `/tyrex-review`
- **Review scopes:** `/tyrex-review` supports `pr` (default, branch diff only) and `full` (codebase-wide re-scan) scopes
- **OpenCode plugin for mechanical enforcement:** `.opencode/plugin.ts` uses OpenCode's native hooks (`command.execute.before`, `permission.ask`) to mechanically enforce plan/build mode switching. `opencode.json` defines two agents (`plan` with `edit: "deny"`, `build` with `edit: "allow"`). The plugin reads/writes `cursor.yml` and injects `AgentPart` to switch agents on command execution. This is a triple-layer enforcement: cursor.yml state + constitution rules + native permission system.
- **No scripts in package.json:** No `start`, `test`, `lint`, or `build` scripts defined yet

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| (none)   | No env vars used currently | — |

## Known Hurdles

- No test framework set up yet — TDD is mandated by constitution but no testing infrastructure exists
- No CI/CD pipeline — "every commit passes CI" rule cannot be enforced yet
- No linting configured — code style is not automated
- No package-lock.json — dependency resolution not locked (irrelevant while zero-dep)
- `.env` not in `.gitignore` — preventive risk if env files are added later

## Architecture Decisions

| Date       | Decision                          | Rationale |
|------------|-----------------------------------|-----------|
| 2026-03-07 | Zero runtime dependencies         | Minimize supply-chain risk, keep CLI lightweight |
| 2026-03-07 | Single-file CLI                   | Simplicity — entire tool is one 417-line file |
| 2026-03-07 | Markdown commands (not executable) | Commands are AI prompts, not code — markdown is the natural format |
| 2026-03-07 | Agent-agnostic unified commands   | One source of truth, copied to 4 agent directories |
| 2026-03-07 | YAML for state                    | Human-readable, AI-parseable, no dependencies needed |
| 2026-03-07 | CommonJS (not ESM)                | Broader Node.js compatibility, simpler for a CLI tool |
| 2026-03-07 | SPEC mandatory, SRS/PRD suggested  | Technical rationale must always be documented; product/requirements docs are contextual |
| 2026-03-07 | Context stored in filesystem       | `.tyrex/context/` (project) + `.tyrex/features/NNN-context.md` (demand) — consistent with state-via-filesystem pattern |
| 2026-03-07 | Command count: 17 (was 16)        | Added `/tyrex-context` for context ingestion — keeps all workflow in slash commands |
| 2026-03-07 | Skills as markdown personas (ADR-002) | Flat files in `.tyrex/skills/`, not subdirectories. Persona format over tech-stack format for natural agent consumption |
| 2026-03-08 | Agent mode as first-class concept     | `agent_mode` field in cursor.yml (`plan`/`build`) enforced via triple layer (state + constitution + command instructions). Prevents agents from writing code during review/plan/discuss commands |
| 2026-03-08 | Security audit with tracking          | `security-audit.md` uses `Status` column (`[ ]`/`[x]`) for finding resolution tracking. Consumed by `/tyrex-status` and `/tyrex-review` |
| 2026-03-08 | Review scopes: PR vs Full             | `/tyrex-review` defaults to PR scope (branch diff only); `/tyrex-review full` re-scans entire codebase. PR scope is faster and focused; Full scope updates the audit file |
| 2026-03-08 | OpenCode plugin for mode enforcement   | Native plugin using OpenCode SDK hooks provides mechanical guardrails — plan agent literally cannot write files. Triple-layer: cursor.yml + constitution + native permissions |

## CI/CD

Not yet configured. Recommended pipeline:
1. `npm test` (once test framework is set up)
2. `npm run lint` (once ESLint is configured)
3. Security scan (no vulnerable deps to scan currently)
4. npm publish (manual for now)

## Post-Implementation Checklist

- [ ] Tests passing
- [ ] Lint clean
- [ ] Security scan clean
- [ ] CHANGELOG updated
- [ ] Documentation updated (if applicable)
- [ ] TYREX.md updated (if new patterns emerged)
