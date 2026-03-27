# Constitution - {{PROJECT_NAME}}

> Inviolable principles. The AI agent MUST follow these at all times.
> The human can update this document. The AI cannot ignore it.

## Rules

1. **Every commit passes CI** (lint + tests + security scan)
2. **TDD**: write tests alongside or before code
3. **No hardcoded secrets** in code or commits
4. **No unnecessary dependencies** - justify every addition
5. **Simplicity > Cleverness** - the simplest solution that works wins
6. **CHANGELOG is mandatory** - every change updates docs/CHANGELOG.md
7. **Small commits** - one task = one commit, atomic and revertible
8. **Documentation first** - when configured, generate docs before code

## The Agent MUST

- Ask when in doubt instead of assuming
- Present decisions as structured choices adapted to the agent's interface — CLI agents: numbered quiz; Chat agents: numbered list or direct question. Never open-ended questions when structured choices are possible
- Propose the simplest solution first
- Warn when something seems over-engineered
- Follow patterns documented in TYREX.md
- Update CHANGELOG.md after every change
- Run tests before considering a task complete
- Respect task dependencies defined in feature specs
- Update cursor.yml after completing each task

## The Agent MUST NOT

- Implement without human approval of the plan
- Add features, libraries, or tools not requested
- Make commits that break CI
- Skip tests
- Generate specs or plans longer than 50 lines per feature
- Modify constitution.md without explicit human approval
- Ignore the "Out of Scope" section in feature specs
- Push to remote without explicit human approval
- Ask open-ended questions when structured choices are possible

## On Agent Mode

- The `agent_mode` field in `cursor.yml` controls what the agent can do
- Each `/tyrex-*` command sets `agent_mode` as its FIRST action before any other work
- The agent MUST read `agent_mode` from `cursor.yml` before taking any action
- **`plan` mode**: the agent MUST NOT create, edit, or delete source code files. Only `.tyrex/`, `docs/`, and configuration files may be modified. Analysis, planning, discussion, and documentation only.
- **`build` mode**: the agent may create, edit, and delete source code files following all other rules (TDD, small commits, CI, etc.)
- If the agent detects `agent_mode: "plan"` and is asked to write source code, it MUST refuse and suggest running `/tyrex-do` or `/tyrex-quick` instead

## On Context Engineering

- **Fresh context is the default execution mode.** Each task runs in a sub-agent with a fresh context window.
- The orchestrator stays lightweight — loads only: tyrex.yml, cursor.yml, task list (metadata), TYREX.md summary (first 50 lines), feature summary (first 30 lines).
- Sub-agents receive ONLY targeted context: task SPEC + relevant_files + constitution.md + skill (if assigned) + feature summary.
- Sub-agents do NOT commit, do NOT modify `.tyrex/` state files, do NOT update CHANGELOG.md — the orchestrator handles all post-task work.
- Sub-agents do NOT modify cursor.yml (only the orchestrator does).
- Sub-agents read additional files on demand if needed beyond relevant_files.
- Respect `tyrex.yml` `context_engineering.size_limits` — max files, max lines, TYREX.md summary length.
- When sub-agents are unavailable (runtime limitation), fall back to inline execution silently.

## On Parallelization

- Parallel tasks spawn simultaneous sub-agents, each with fresh context
- Conflicts in file modifications = those tasks CANNOT be parallelized
- The orchestrator commits and updates state sequentially after parallel tasks complete

## On Commits

- Mode "approve": write commit message + changelog entry, present to human, wait for approval
- Mode "auto": commit automatically with conventional commit message, update changelog
- Branch naming: agent suggests based on feature, human approves (or auto if configured)
