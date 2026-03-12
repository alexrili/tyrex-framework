# ADR-005: Global-Only Installation with Symlinks

## Status
Accepted

## Date
2026-03-12

## Participants
- Alex (maintainer)

## Context
Tyrex currently offers two install modes: local (copies commands/templates into the project directory) and global (installs to home directory). The local mode copies 18+ command files and 10+ template files into every project, creating duplication. When Tyrex is updated, each project must be re-installed individually. Additionally, the duplicated files clutter project directories and git history with framework files that aren't project-specific.

Agents like Claude Code and OpenCode support global commands natively (`~/.claude/commands/`, `~/.opencode/commands/`). Agents like Cursor and Codex require commands in the project directory (`.cursor/rules/tyrex/`, `.codex/skills/tyrex/`).

## Decision
Installation becomes **global-only**. The `--local`/`--global` choice is removed.

- `npx tyrex-framework` (or `tyrex` if installed globally) installs commands, templates, and rules files to `~/` (home directory)
- `tyrex init` in a project creates only the project-specific `.tyrex/` structure and `docs/` directories
- For agents that require project-local commands (Cursor, Codex), `tyrex init` creates **symlinks** from the project directory to the global installation (e.g., `.cursor/rules/tyrex/ → ~/.cursor/rules/tyrex/`)
- For agents with native global support (Claude Code, OpenCode), no symlinks needed — they read from `~/` directly
- `.tyrex/templates/` in the project becomes a symlink to the global templates directory
- Rules files (CLAUDE.md, AGENTS.md) remain as copies (not symlinks) because they may be customized per project
- `npm update -g tyrex-framework` + `tyrex` re-run updates all global templates/commands automatically; projects get updates via symlinks without re-installation

## Consequences

### Positive
- Zero duplication — commands and templates exist in one place
- Automatic updates — `npm update -g` updates all projects via symlinks
- Cleaner project directories — only project-specific state in `.tyrex/`
- Simpler mental model — one install mode, one command
- Smaller git footprint — no framework files committed to project repos

### Negative
- Symlinks may not work on all Windows filesystems (requires Developer Mode or admin privileges)
- If global install is removed, symlinks break — `tyrex init` must detect and warn
- Rules files (CLAUDE.md, AGENTS.md) are still copied (not linked) since they're customizable per project

## Alternatives Considered

1. **Keep local+global with a default** — Still causes duplication for the common case
2. **Global-only without symlinks (Cursor/Codex lose commands)** — Breaks agents that require project-local command files
3. **Git submodule for shared commands** — Too heavy for markdown files, requires git knowledge

## Related ADRs
- ADR-004: Documentation System (templates affected by this change)
