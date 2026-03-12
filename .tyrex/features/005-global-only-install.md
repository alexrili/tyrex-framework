# Feature 005 — Global-Only Installation

## Objective
Eliminate local/global install choice. Installation becomes global-only with symlinks for agents that need project-local files.

## Acceptance Criteria
- [ ] `npx tyrex-framework` installs only to `~/` (no local/global question)
- [ ] `tyrex init` creates `.tyrex/` structure + symlinks to global commands/templates
- [ ] Claude Code and OpenCode work from global commands (no symlinks needed)
- [ ] Cursor and Codex get symlinks to global commands
- [ ] `.tyrex/templates/` symlinks to global templates
- [ ] `--local`/`-l` and `--global`/`-g` flags removed
- [ ] `--uninstall` updated for global-only model
- [ ] README and help text reflect new install model
- [ ] Re-running `tyrex` updates global files; projects update via symlinks

## Out of Scope
- Windows symlink compatibility (future feature)
- Migration tool for existing local installs

## Skills
- none

## Configuration
- Docs: CHANGELOG, SPEC (per task), ADR-005
- Commits: approve
- Branch: feat/global-only-install

## Tasks
1. Refactor bin/tyrex.js — global-only + init subcommand [medium, required]
2. Full symlink logic in init [medium, required, depends: 1]
3. Update README [small, optional, depends: 1, parallel with 2]
4. Update commands, CHANGELOG, TYREX.md, sync [small, optional, depends: 2,3]

## Status
done
