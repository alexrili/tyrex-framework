# Tyrex Framework

This project uses the Tyrex Framework for human-driven, AI-accelerated pair programming.

## How It Works

1. **Read context first:** Before any action, read `.tyrex/TYREX.md` for project context and `.tyrex/constitution.md` for guardrails.
2. **Check state:** Read `.tyrex/state/cursor.yml` to know where we left off.
3. **Check mode:** Read `agent_mode` from `cursor.yml`. In `plan` mode, NEVER write source code — only `.tyrex/`, `docs/`, and config files. In `build` mode, follow TDD and commit rules.
4. **Use commands:** The `/tyrex-*` slash commands orchestrate the development workflow.
5. **Update state:** After every task, update the cursor and task state files.
6. **Structured choices:** ALL user decisions use structured choices adapted to the agent's interface (CLI: numbered quiz, Chat: numbered list or direct question). Never ask open-ended questions when structured choices are possible.
7. **Security first:** Always consider security implications during planning and review. The DevSec skill (`templates/skills/devsec.md`) is auto-suggested for security-sensitive work.

## Commands Available

| Command | Flags | Purpose |
|---------|-------|---------|
| `/tyrex-init` | | Initialize Tyrex in a project (map codebase, configure) |
| `/tyrex-settings` | | View/modify Tyrex configuration |
| `/tyrex-new` | | Start a new feature/demand (structured choices workflow) |
| `/tyrex-plan` | | Plan tasks with security-first analysis |
| `/tyrex-do` | `--auto-approve` | Execute tasks (sequential or parallel, with TDD) |
| `/tyrex-review` | `--do-all` `--do-critical` `full` | Senior code review with 4 lenses + auto-fix loop |
| `/tyrex-status` | | Show current project and feature status |
| `/tyrex-resume` | | Resume from last session (fast recovery via cursor) |
| `/tyrex-quick` | `--auto-approve` | Fast-track: unified new→plan→do from single prompt |
| `/tyrex-evolve` | | Update TYREX.md with new patterns/knowledge |
| `/tyrex-skills` | `create` `sync` | Manage and apply reusable skills |
| `/tyrex-readme` | | Generate or update project README.md |
| `/tyrex-openapi` | | Generate or update OpenAPI documentation |
| `/tyrex-wiki` | | Generate or update project wiki pages |
| `/tyrex-debug` | | Diagnose problems, analyze logs, document bugs |
| `/tyrex-research` | | Technical research — codebase + web |
| `/tyrex-security-review` | | Comprehensive security scan — secrets, vulns, OWASP Top 10 |
| `/tyrex-test-review` | | Scan for test coverage gaps with argued suggestions |
| `/tyrex-help` | `<command>` | Show commands, workflow guide, and contextual suggestions |
| `/tyrex-handoff` | | **DEPRECATED** — use `/tyrex-quick --auto-approve` |

## Core Rules

1. **Human decides WHAT and WHY. AI decides HOW.** Never invert this.
2. **TDD is mandatory.** Write tests alongside or before code.
3. **Every commit passes CI.** No broken commits, ever.
4. **CHANGELOG is mandatory.** Update `docs/CHANGELOG.md` on every change.
5. **Small commits.** One task = one atomic, revertible commit.
6. **Structured choices for all decisions.** Adapt format to agent interface (CLI: quiz, Chat: list/question). Never open-ended.
7. **Simplicity wins.** Propose the simplest solution first.
8. **Documentation first.** When configured, generate docs before code.
9. **Security first.** Evaluate security implications during planning and review.
10. **Update state.** Always update cursor.yml after completing tasks.
11. **Respect parallelism rules.** Sub-agents only modify their own files and state.
12. **TYREX.md is the living index.** Auto-update when macro docs (ADR, PRD, SRS) are generated.

## File Structure

```
.tyrex/
├── tyrex.yml          # Configuration
├── TYREX.md           # Living project context (READ THIS FIRST)
├── constitution.md    # Inviolable guardrails (READ THIS SECOND)
├── state/
│   ├── cursor.yml     # Session pointer (READ THIS THIRD)
│   └── tasks/         # Individual task states
├── features/          # Feature specs
├── templates/         # Document templates
├── skills/            # Reusable skills (synced across agents)
└── map/               # Project mapping (generated on init)
templates/
├── skills/
│   └── devsec.md      # Built-in DevSec skill template
docs/
├── CHANGELOG.md       # Mandatory changelog
├── adrs/              # Architecture Decision Records
├── rfcs/              # Request for Comments
├── wiki/              # Project wiki
└── diagrams/          # Flow diagrams
```

## Workflow

```
Full workflow:
  /tyrex-init → /tyrex-new → /tyrex-plan → /tyrex-do → /tyrex-review
              (choices)      (security)    [--auto]     (4 lenses)
                                              ↑              │
                                              └── fix tasks ─┘

Fast track:
  /tyrex-quick [--auto-approve]
    = new + plan + do in one command

Review with auto-fix:
  /tyrex-review --do-all       (fix everything)
  /tyrex-review --do-critical  (fix HIGH/CRITICAL only)
```

## On Parallelization

When tasks can run in parallel, ask the human before spawning sub-agents (or auto-decide with `--auto-approve`).
Each sub-agent receives: task description + TYREX.md + constitution.md.
Each sub-agent writes ONLY to its own task state file.
The orchestrator (main agent) handles commits, CHANGELOG, and cursor updates.
