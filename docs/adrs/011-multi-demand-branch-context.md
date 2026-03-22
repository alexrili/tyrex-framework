# ADR-011: Multi-Demand Branch-Based Context

## Status
Accepted

## Context
The framework currently tracks a single active feature in `cursor.yml`. This forces a single-player, single-task workflow — developers cannot stack multiple features or work in parallel across terminals. Teams need to open features independently without blocking each other.

## Decision
Adopt a **branch-based context detection** model with flag override:

1. **Branch as default context** — commands detect the current git branch and match it to a feature via `.tyrex/features/` specs. The branch naming convention `feat/NNN-*` maps to feature NNN.
2. **Flag as override** — `--feature NNN` on any command forces context to that feature, regardless of branch.
3. **cursor.yml becomes per-feature** — instead of one global cursor, each feature has its own state file: `.tyrex/state/features/NNN.yml`. The global `cursor.yml` retains only cross-feature state (agent_mode, session metadata).
4. **Concurrent `/tyrex-new`** — multiple features can be in `spec` or `planned` state simultaneously. Only `/tyrex-do` modifies source code, and it operates on the current branch's feature.
5. **Lock-free by convention** — no file locking. Features on different branches don't share files. Conflicts are resolved by git merge, not by the framework.

## Consequences
- Commands must resolve feature context on every invocation (branch detection + flag check)
- Task state files move from `.tyrex/state/tasks/` to `.tyrex/state/features/NNN/tasks/`
- `/tyrex-status` shows all open features, not just the active one
- `/tyrex-resume` resolves feature from branch, not from a global pointer
- Backward compatible: single-feature workflow still works (one branch = one feature)

## Alternatives Considered
- **Global lock file** — rejected: blocks parallel work, defeats the purpose
- **Branch-only (no flag)** — rejected: sometimes you need to check status of another feature without switching branches
- **Database/server** — rejected: violates zero-dependency principle
