# Tyrex Framework

**Human-driven, AI-accelerated pair programming.**

Tyrex is a workflow orchestrator for AI coding agents. It scaffolds structured commands into your project so that AI agents (Claude Code, OpenCode, Cursor, Codex) follow a disciplined development process: TDD, atomic commits, documentation-first, and shared memory across sessions.

```
npx tyrex-framework
```

Zero dependencies. One CLI. Works with any AI coding agent.

---

## Why Tyrex?

AI coding agents are powerful but chaotic. Without structure, they skip tests, make sprawling commits, forget context between sessions, and ignore your project's patterns.

Tyrex fixes this by giving agents a workflow:

- **Structured commands** (`/tyrex-new`, `/tyrex-plan`, `/tyrex-do`, `/tyrex-review`) enforce a disciplined development cycle
- **Shared memory** (`TYREX.md`, context files, skills) persists knowledge across sessions and agents
- **Guardrails** (`constitution.md`) define inviolable rules the agent must follow
- **Session recovery** (`cursor.yml`) lets you resume exactly where you left off
- **Parallelization** — independent tasks run concurrently with sub-agents
- **Documentation-first** — SPEC, SRS, PRD, ADRs are generated before code

## How It Works

Tyrex doesn't run your AI agent. It installs **markdown command files** into the directories your agent already reads. When you type `/tyrex-new` in Claude Code (or any supported agent), the agent reads the command definition and follows the structured workflow.

```
You (human)          AI Agent              Tyrex
    |                    |                   |
    |--- /tyrex-new ---->|                   |
    |                    |--- reads .md ---->|
    |                    |<-- workflow ------|
    |<-- follows flow ---|                   |
    |--- approves ------>|                   |
    |                    |--- executes ----->|
```

**The human decides WHAT and WHY. The AI decides HOW.**

## Quick Start

### 1. Install globally (once)

```bash
npm install -g tyrex-framework
tyrex --all
```

This installs slash commands and templates to your home directory (`~/`). You only do this once.

### 2. Initialize each project

```bash
cd your-project
tyrex init
```

This creates the `.tyrex/` and `docs/` structure in your project. It auto-detects which agents you installed and creates symlinks for agents that need project-local files (Cursor, Codex). Templates are symlinked to the global install — when you update Tyrex, all projects get the latest templates automatically.

### 3. Map your codebase

Open your AI agent and run:

```
/tyrex-init
```

This maps your codebase, detects your stack, runs a security audit, and generates `TYREX.md` (your project's living context document).

For **new/empty projects**, Tyrex creates a minimal structure and suggests `/tyrex-discuss` to brainstorm before building.

### 4. Start building

```
/tyrex-discuss    # Explore the project or brainstorm architecture
/tyrex-new        # Define a new feature
/tyrex-plan       # Break it into tasks with dependencies
/tyrex-do         # Implement with TDD, commits, and docs
/tyrex-review     # Review, finalize docs, ship
```

## Updating

```bash
npm install -g tyrex-framework@latest
tyrex --all
```

The first command updates the package. The second reinstalls global command files so new or changed commands are available to all agents. Project-level templates are symlinked to the global install, so they update automatically — no need to re-run `tyrex init`.

## Commands

### Workflow

| Command | Purpose |
|---------|---------|
| `/tyrex-init` | Map codebase, configure project, generate TYREX.md |
| `/tyrex-discuss` | Explore project interactively, brainstorm architecture |
| `/tyrex-new` | Start a new feature (requirements, docs, skills, branch) |
| `/tyrex-plan` | Security-first planning with dependencies, parallelism, and SPEC per task |
| `/tyrex-do` | Execute tasks (TDD, skill-aware, parallel sub-agents). Supports `--auto-approve` |
| `/tyrex-review` | 4-lens senior code review. Supports `--do-all`, `--do-critical`, `full` |

### Shortcuts

| Command | Purpose |
|---------|---------|
| `/tyrex-quick` | Fast-track unified `new → plan → do` from a single prompt |
| `/tyrex-quick --auto-approve` | Full autopilot (replaces deprecated `/tyrex-handoff`) |

### Management

| Command | Purpose |
|---------|---------|
| `/tyrex-status` | Dashboard: features, roadmap, health, docs coverage |
| `/tyrex-recover` | Recover from crashed session or resume from last session |
| `/tyrex-settings` | View/modify configuration |
| `/tyrex-evolve` | Record new patterns or decisions in TYREX.md |

### Skills & Documentation

| Command | Purpose |
|---------|---------|
| `/tyrex-skills` | Manage reusable AI personas (create, list, sync) |
| `/tyrex-context` | Ingest project context (text, files, URLs) |
| `/tyrex-readme` | Generate/update README.md |
| `/tyrex-openapi` | Generate OpenAPI docs from code |
| `/tyrex-wiki` | Generate/update project wiki |
| `/tyrex-research` | AI-powered technical research (codebase + web) |
| `/tyrex-help` | Command reference and contextual suggestions |

## Typical Workflow

```
/tyrex-init --> /tyrex-discuss --> /tyrex-new --> /tyrex-plan --> /tyrex-do --> /tyrex-review
                (optional)                            ^                           |
                                                      '--- fix tasks ------------'
```

**Greenfield project:**
```
/tyrex-init --> /tyrex-discuss (brainstorm) --> /tyrex-new --> ...
```

**Quick fix or small feature:**
```
/tyrex-quick              (unified new → plan → do, single prompt)
/tyrex-quick --auto-approve  (full autopilot, no checkpoints)
```

## Key Concepts

### TYREX.md — Living Project Context

Every project gets a `TYREX.md` that captures your stack, architecture, patterns, known hurdles, and decisions. AI agents read this before every interaction, so they understand your project without re-analyzing the codebase.

### Constitution — Inviolable Rules

`constitution.md` defines rules the AI must always follow: TDD, no hardcoded secrets, small commits, CHANGELOG updates. The human writes the constitution. The AI obeys it.

### Skills — Reusable AI Personas

Skills are markdown files that give agents specialized perspectives:

```markdown
# Skill: Backend Engineer
## Role
Senior backend engineer focused on API design and data integrity.
## Expertise
REST APIs, database design, authentication, performance optimization.
## Guidelines
- Always validate input at the boundary
- Use repository pattern for data access
- ...
```

Skills are auto-suggested during `/tyrex-new` and loaded during `/tyrex-do` for specialized implementation quality.

### Security-First Planning

`/tyrex-plan` performs a security assessment before proposing tasks. Security-sensitive tasks automatically get the `devsec` skill assigned and `quality: required`. Features with security implications get a dedicated hardening task.

### 4-Lens Senior Code Review

`/tyrex-review` evaluates through 4 critical lenses:
1. **Pattern Compliance** — does the code follow project patterns from TYREX.md?
2. **Code Quality & DRY** — duplication, complexity, maintainability
3. **Business & Technical Compliance** — does it meet the SPEC and acceptance criteria?
4. **Security First** — OWASP top 10, input validation, secrets management

Use `--do-all` or `--do-critical` to auto-create fix tasks from review findings.

### Adaptive Decision Format

All user decisions across all commands use structured choices adapted to the agent's interface. CLI agents (Claude Code, OpenCode) present numbered quizzes; chat-based agents (Cursor, Codex) use numbered lists or direct questions. The goal is structured choices over open-ended questions — the format adapts, the discipline stays.

### Built-in DevSec Skill

A security engineering skill (`devsec`) ships with the framework. It's auto-suggested when security-sensitive areas are detected during `/tyrex-new` and `/tyrex-plan`, providing OWASP/SANS coverage out of the box.

### Command Flags

| Flag | Commands | Effect |
|------|----------|--------|
| `--auto-approve` | `/tyrex-do`, `/tyrex-quick` | Skip all human checkpoints |
| `--do-all` | `/tyrex-review` | Auto-create fix tasks for all findings |
| `--do-critical` | `/tyrex-review` | Auto-create fix tasks for critical findings only |
| `full` | `/tyrex-review` | Codebase-wide re-scan (default is PR scope) |

### Roadmap — Forward Visibility

`.tyrex/roadmap.yml` tracks planned, in-progress, and completed features. The `/tyrex-status` command shows what's done, what's active, and what's next. `/tyrex-new` checks the roadmap before asking for a new demand.

### Documentation Layers

| Document | Scope | When |
|----------|-------|------|
| **SPEC** | Per task | Generated during `/tyrex-plan` (mandatory) |
| **SRS** | Per feature | Generated during `/tyrex-new` (suggested) |
| **PRD** | Per feature | Provided or generated during `/tyrex-new` (suggested) |
| **ADR** | Per decision | Generated when architecture choices arise |
| **RFC** | Per proposal | Generated for complex technical proposals |
| **Diagram** | Per feature | D2 diagrams (d2lang.com) — always offered during `/tyrex-new` |
| **Context** | Project or feature | Ingested via `/tyrex-context` at any time |
| **Custom** | Configurable | User-defined doc types via `/tyrex-settings` |

### Diagrams with D2

Tyrex uses [D2](https://d2lang.com) for diagrams. Four templates ship with the framework:

- **Architecture** — system components, layers, and connections
- **Sequence** — interaction flow between actors and components
- **Data Flow** — data transformation pipeline
- **ER** — entity-relationship model

Diagrams are always offered during `/tyrex-new` to help visualize the proposed solution. Render with: `d2 input.d2 output.svg`.

### Customizable Documentation

Every company has its own documentation workflow. Tyrex ships with a standard set (SPEC, SRS, PRD, ADR, RFC, diagrams) but lets you add custom doc types via `/tyrex-settings`:

```yaml
# tyrex.yml
docs:
  custom:
    - name: "runbook"
      template: ".tyrex/templates/runbook.md"
      scope: "demand"
      mandatory: false
```

Custom doc types appear in `/tyrex-new` alongside built-in ones.

## Supported Agents

| Agent | Global Commands | Project Symlink | Rules File |
|-------|----------------|-----------------|------------|
| Claude Code | `~/.claude/commands/` | Not needed (reads global) | `CLAUDE.md` |
| OpenCode | `~/.opencode/commands/` | Not needed (reads global) | `AGENTS.md` |
| Cursor | `~/.cursor/rules/tyrex/` | `.cursor/rules/tyrex/` → global | `CLAUDE.md` |
| Codex | `~/.codex/skills/tyrex/` | `.codex/skills/tyrex/` → global | `CLAUDE.md` |

All agents receive the same 19 command definitions from a single source of truth. Commands are installed globally and symlinked into projects for agents that require project-local files.

## Project Structure

### Global (`~/`) — installed once via `tyrex`

```
~/
  .tyrex/
    templates/           # Shared document templates (SPEC, SRS, PRD, ADR, etc.)
    config-templates/    # Core config templates for `tyrex init`
    rules/               # Rules file templates (CLAUDE.md, AGENTS.md)
  .claude/commands/      # Slash commands for Claude Code
  .opencode/commands/    # Slash commands for OpenCode
  .cursor/rules/tyrex/   # Slash commands for Cursor
  .codex/skills/tyrex/   # Slash commands for Codex
```

### Per project — created via `tyrex init`

```
your-project/
  .tyrex/
    tyrex.yml            # Configuration (project-specific)
    TYREX.md             # Living project context
    constitution.md      # Inviolable guardrails
    roadmap.yml          # Feature roadmap and backlog
    state/
      cursor.yml         # Session pointer (fast recovery)
      tasks/             # Individual task states
    features/            # Feature specs
    skills/              # Reusable AI personas
    context/             # Project context files
    templates/ -> ~/.tyrex/templates/   # Symlink to global templates
    map/                 # Codebase analysis results
  .cursor/rules/tyrex/ -> ~/.cursor/rules/tyrex/   # Symlink (if Cursor installed)
  .codex/skills/tyrex/ -> ~/.codex/skills/tyrex/    # Symlink (if Codex installed)
  CLAUDE.md              # Rules file (copied, customizable per project)
  docs/
    CHANGELOG.md         # Mandatory changelog
    adrs/                # Architecture Decision Records
    specs/               # Task specifications
    srs/                 # Software Requirements Specifications
    prd/                 # Product Requirements Documents
    wiki/                # Project wiki pages
    rfcs/                # Technical proposals
    diagrams/            # Flow diagrams
```

## CLI

```bash
tyrex                              # Interactive global setup
tyrex --all                        # Global install for all agents
tyrex --claude                     # Global install for Claude Code only
tyrex init                         # Initialize current project
tyrex init -d                      # Init with default configuration
tyrex init -f                      # Re-init, overwrite core files
tyrex --uninstall --all            # Remove global installation
```

| Command / Flag | Description |
|----------------|-------------|
| `tyrex` | Global install (interactive) |
| `tyrex init` | Initialize project (creates `.tyrex/`, `docs/`, symlinks) |
| `tyrex help` | Show help |
| `tyrex version` | Show version |
| `--claude` | Install for Claude Code |
| `--opencode` | Install for OpenCode |
| `--cursor` | Install for Cursor |
| `--codex` | Install for Codex |
| `--all` | Install for all agents |
| `--defaults`, `-d` | Skip config questions, use defaults |
| `--force`, `-f` | Overwrite core files on re-install/re-init |
| `--uninstall` | Remove global Tyrex installation |

## Core Rules

1. **Human decides WHAT and WHY. AI decides HOW.** Never invert this.
2. **TDD is mandatory.** Write tests alongside or before code.
3. **Every commit passes CI.** No broken commits.
4. **CHANGELOG is mandatory.** Updated on every change.
5. **Small commits.** One task = one atomic, revertible commit.
6. **Ask, don't assume.** When in doubt, ask the human.
7. **Simplicity wins.** Propose the simplest solution first.
8. **Documentation first.** When configured, generate docs before code.

## Requirements

- Node.js >= 18.0.0
- An AI coding agent (Claude Code, OpenCode, Cursor, or Codex)

## License

MIT
