### Git Semantic Commits & Tags (shared — referenced by plan-mode and milestone commands)

**Purpose:** All plan-mode commands that modify `.tyrex/` files auto-commit with semantic prefixes. Milestone events auto-create git tags. This makes git the audit trail for all project decisions.

## Semantic Commit Rules

**When to commit:** After any plan-mode command modifies `.tyrex/` files (backlog items, state, features, roadmap, context). Controlled by `tyrex.yml` `git.auto_commit_state`:

| Setting | Behavior |
|---------|----------|
| `auto` (default) | Commit immediately after each operation |
| `batch` | Stage changes, commit once at command end |
| `off` | Do not auto-commit state files (user manages manually) |

**Commit prefix by command:**

| Command | Prefix | Example |
|---------|--------|---------|
| `/tyrex-backlog add` | `backlog:` | `backlog: add BL-017 — rate limiting exploration` |
| `/tyrex-backlog edit` | `backlog:` | `backlog: edit BL-005 — update acceptance criteria` |
| `/tyrex-backlog remove` | `backlog:` | `backlog: discard BL-012 — absorbed into BL-008` |
| `/tyrex-backlog plan` | `backlog:` | `backlog: replan — reorder phases 3-5` |
| `/tyrex-backlog pick` | `backlog:` | `backlog: pick BL-014 — ready for execution` |
| `/tyrex-discuss` (save) | `discuss:` | `discuss: save conclusions — auth architecture` |
| `/tyrex-discuss --backlog` (enrich) | `discuss:` | `discuss: enrich BL-005 — added 3 acceptance criteria` |
| `/tyrex-plan` | `plan:` | `plan: approve — 7 tasks for feature 026` |
| `/tyrex-new` | `feat:` | `feat: create 026 — git semantic commits` |
| `/tyrex-evolve` | `evolve:` | `evolve: add pattern — discuss↔backlog integration` |
| `/tyrex-context` | `context:` | `context: add — external API constraints` |

**Commit rules:**
- Only stage `.tyrex/` files — NEVER stage source code in these commits
- Use `git add .tyrex/` scoped to the specific files changed
- If `git.auto_commit_state` is `off`, skip silently
- If the working tree has no `.tyrex/` changes, skip silently (no empty commits)
- These commits happen in plan mode — they are state management, not implementation

**How to apply (for command authors):**
At the END of the command (after all operations), check `tyrex.yml` `git.auto_commit_state`:
1. If `auto` or `batch`: stage all modified `.tyrex/` files, commit with semantic prefix
2. If `off`: skip
3. Always use the format: `{prefix} {action} — {summary}`

## Auto-Tag Rules

**Tags are created at milestone events.** Tags are lightweight (not annotated).

| Event | Tag Pattern | Created By |
|-------|-------------|------------|
| Feature approved in review | `tyrex-feature-NNN-done` | `/tyrex-review` Step 9 (Finalize) |
| Version bump committed | `tyrex-vX.Y.Z` | `/tyrex-do` execution checklist, step 6e |
| Phase completed (all items done) | `tyrex-phase-N-done` | `/tyrex-backlog` when last item in phase → done |

**Tag rules:**
- Use `git tag {tag-name}` (lightweight, no annotation)
- Check if tag already exists before creating (`git tag -l {tag-name}`) — skip if exists
- Tags are local only — never auto-push tags (user decides with `git push --tags`)
- Phase completion detected by scanning all backlog items in that phase — if all are `done` or `discarded`, the phase is complete

**How to check progress:**
```bash
git tag --list 'tyrex-*' --sort=-creatordate
```
