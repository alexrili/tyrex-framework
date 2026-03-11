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
- Use interactive quiz format (multiple-choice) for ALL user decisions — never open-ended questions when a quiz can be used
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
- Generate specs or plans longer than 50 lines per feature
- Modify constitution.md without explicit human approval
- Ignore the "Out of Scope" section in feature specs
- Push to remote without explicit human approval
- Add runtime dependencies without explicit justification and approval
- Ask open-ended questions when a quiz format is possible
- Skip security analysis during planning phase

## On Parallelization

- Sub-agents receive ONLY their task context + TYREX.md + constitution.md
- Sub-agents write ONLY to their own task state file
- Sub-agents do NOT modify cursor.yml (only the orchestrator does)
- Sub-agents do NOT modify CHANGELOG.md (done after wave completion)
- Conflicts in file modifications = those tasks CANNOT be parallelized

## On Commits

- Mode "approve": write commit message + changelog entry, present to human, wait for approval
- Mode "auto": commit automatically with conventional commit message, update changelog
- Branch naming: agent suggests based on feature, human approves (or auto if configured)
- Commit style: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`)
