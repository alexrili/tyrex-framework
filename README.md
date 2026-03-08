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

### 1. Install

**Option A – npx (recommended)**

```bash
# In your project directory
npx tyrex-framework
```

**Option B – npm Git/HTTP install (no registry release needed)**

```bash
npm install git+https://github.com/tyrex-framework/tyrex.git
npx tyrex-framework
```

The interactive installer asks:
1. Which AI agent? (Claude Code, OpenCode, Cursor, Codex, or all)
2. Local or global install?
3. Configuration (commit mode, branch mode, documentation level)

### 2. Initialize

Open your AI agent and run:

```
/tyrex-init
```

This maps your codebase, detects your stack, runs a security audit, and generates `TYREX.md` (your project's living context document).

For **new/empty projects**, Tyrex creates a minimal structure and suggests `/tyrex-discuss` to brainstorm before building.

### 3. Start building

```
/tyrex-discuss    # Explore the project or brainstorm architecture
/tyrex-new        # Define a new feature
/tyrex-plan       # Break it into tasks with dependencies
/tyrex-do         # Implement with TDD, commits, and docs
/tyrex-review     # Review, finalize docs, ship
```

## Commands

### Workflow

| Command | Purpose |
|---------|---------|
| `/tyrex-init` | Map codebase, configure project, generate TYREX.md |
| `/tyrex-discuss` | Explore project interactively, brainstorm architecture |
| `/tyrex-new` | Start a new feature (requirements, docs, skills, branch) |
| `/tyrex-plan` | Plan tasks with dependencies, parallelism, and SPEC per task |
| `/tyrex-do` | Execute tasks (TDD, skill-aware, parallel sub-agents) |
| `/tyrex-review` | Review implementation, finalize docs, evolve TYREX.md |

### Shortcuts

| Command | Purpose |
|---------|---------|
| `/tyrex-quick` | Fast task without full ceremony (bug fixes, tweaks) |
| `/tyrex-handoff` | Autopilot: chains new -> plan -> do -> review |

### Management

| Command | Purpose |
|---------|---------|
| `/tyrex-status` | Dashboard: features, roadmap, health, docs coverage |
| `/tyrex-resume` | Resume from last session (fast recovery via cursor.yml) |
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

**Quick fix:**
```
/tyrex-quick  (skip spec/plan, just fix and commit)
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

### Roadmap — Forward Visibility

`.tyrex/roadmap.yml` tracks planned, in-progress, and completed features. The `/tyrex-status` command shows what's done, what's active, and what's next. `/tyrex-new` checks the roadmap before asking for a new demand.

### Documentation Layers

| Document | Scope | When |
|----------|-------|------|
| **SPEC** | Per task | Generated during `/tyrex-plan` (mandatory) |
| **SRS** | Per feature | Generated during `/tyrex-new` (suggested) |
| **PRD** | Per feature | Provided or generated during `/tyrex-new` (suggested) |
| **ADR** | Per decision | Generated when architecture choices arise |
| **Context** | Project or feature | Ingested via `/tyrex-context` at any time |

## Supported Agents

| Agent | Commands Directory | Rules File |
|-------|-------------------|------------|
| Claude Code | `.claude/commands/` | `CLAUDE.md` |
| OpenCode | `.opencode/commands/` | `AGENTS.md` |
| Cursor | `.cursor/rules/tyrex/` | `CLAUDE.md` |
| Codex | `.codex/skills/tyrex/` | `CLAUDE.md` |

All agents receive the same 18 command definitions from a single source of truth (`templates/commands/unified/`).

## Project Structure

After installation, your project gets:

```
your-project/
  .tyrex/
    tyrex.yml            # Configuration
    TYREX.md             # Living project context
    constitution.md      # Inviolable guardrails
    roadmap.yml          # Feature roadmap and backlog
    state/
      cursor.yml         # Session pointer (fast recovery)
      tasks/             # Individual task states
    features/            # Feature specs
    skills/              # Reusable AI personas
    context/             # Project context files
    templates/           # Document templates (SPEC, SRS, PRD, ADR, etc.)
    map/                 # Codebase analysis results
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

## CLI Options

```bash
npx tyrex-framework                          # Interactive setup
npx tyrex-framework --claude --local         # Claude Code, current project
npx tyrex-framework --all --local            # All agents, current project
npx tyrex-framework --all --local -d         # All agents, default config
npx tyrex-framework --all --global           # All agents, home directory
npx tyrex-framework --uninstall --claude     # Remove Claude commands
npx tyrex-framework --force                  # Re-install, overwrite core files
```

| Flag | Description |
|------|-------------|
| `--claude` | Install for Claude Code |
| `--opencode` | Install for OpenCode |
| `--cursor` | Install for Cursor |
| `--codex` | Install for Codex |
| `--all` | Install for all agents |
| `--local`, `-l` | Install in current directory |
| `--global`, `-g` | Install in home directory |
| `--defaults`, `-d` | Skip config questions, use defaults |
| `--force`, `-f` | Overwrite core files on re-install |
| `--uninstall` | Remove agent commands |

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
