# Constitution - tyrex-framework

> Inviolable principles. The AI agent MUST follow these at all times.
> The human can update this document. The AI cannot ignore it.

## Rules

1. **Every commit passes CI** (lint + tests + security scan)
2. **TDD**: write tests alongside or before code
3. **No hardcoded secrets** in code or commits
4. **No unnecessary dependencies** - justify every addition (currently zero-dep — keep it that way unless justified)
5. **Simplicity > Cleverness** - the simplest solution that works wins
6. **CHANGELOG is mandatory** - every change updates docs/CHANGELOG.md
7. **Small commits** - one task = one commit, atomic and revertible
8. **Documentation first** - when configured, generate docs before code
9. **Version bump is mandatory** — when CHANGELOG or ADR changes are committed, detect the package manager manifest, suggest a semver bump, propagate the version across all referencing files, and include the version change in the same atomic commit

## Stack-Specific Rules (Node.js / JavaScript)

- **No `eval()` or `new Function()`** — never execute dynamic code
- **No `child_process` with unsanitized input** — prevent command injection
- **Use `path.join()` / `path.resolve()`** — never concatenate paths with string operators
- **Validate file paths** — ensure operations stay within expected directories
- **Use `replaceAll()` over `new RegExp()` with dynamic strings** — prevent ReDoS
- **Prefer `fs.promises`** for new async code, `fs.*Sync` acceptable in CLI sequential flows
- **CommonJS (`require`)** — do not switch to ESM without explicit decision
- **Node.js >= 18.0.0** — do not use APIs unavailable in Node 18

## The Agent MUST

- Ask when in doubt instead of assuming
- Present decisions as structured choices adapted to the agent's interface — CLI agents: numbered quiz; Chat agents: numbered list or direct question. Never open-ended questions when structured choices are possible
- **One question at a time** — present a single structured choice, then STOP and wait for the user's response before proceeding to the next question. Never combine multiple choice blocks in a single message. Each step that contains a decision point ends at that choice — the next step begins only after the user responds. Exception: configuration review blocks (e.g., docs bundle + git config) may be presented together as a single "review and confirm" action
- Propose the simplest solution first
- Warn when something seems over-engineered
- Follow patterns documented in TYREX.md
- Update CHANGELOG.md after every change
- Update TYREX.md when macro docs (ADR, PRD, SRS) are generated or updated
- Run tests before considering a task complete
- Respect task dependencies defined in feature specs
- Update cursor.yml after completing each task
- Evaluate security implications during planning (security-first approach)
- Suggest DevSec skill when security-sensitive areas are detected

## The Agent MUST NOT

- Implement without human approval of the plan
- Add features, libraries, or tools not requested
- Make commits that break CI
- Skip tests
- Generate feature specs longer than 50 lines (plans are uncapped — task count scales with complexity)
- Modify constitution.md without explicit human approval
- Ignore the "Out of Scope" section in feature specs
- Push to remote without explicit human approval
- Add runtime dependencies without explicit justification and approval
- Ask open-ended questions when structured choices are possible
- Batch multiple questions or choice blocks in a single message (exception: configuration review blocks that are a single confirm action)
- Skip security analysis during planning phase

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
- Commit style: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`)
