# SPEC: Refactor bin/tyrex.js — Global-only install logic

## Feature
Feature 005 — Global-Only Installation

## Date
2026-03-12

## Project
tyrex-framework

## Objective
Restructure `bin/tyrex.js` so installation is always global (home directory). Remove local/global choice. Split project initialization into a separate `init` subcommand.

## Technical Approach

1. Remove `--local`/`-l` and `--global`/`-g` flags from `flags` object
2. Remove "Where to install?" question (the `choose` call for location)
3. Set `targetDir = require("os").homedir()` unconditionally
4. Refactor `installTyrexStructure()` to install only global assets:
   - Commands to agent directories (unchanged — already installs to `targetDir/<agent>/commands/`)
   - Templates to `~/.tyrex/templates/` (new global templates location)
   - Rules files (CLAUDE.md, AGENTS.md) to `~/` (unchanged)
5. Remove `.tyrex/state/`, `.tyrex/features/`, `docs/` creation from the global install — these are project-specific
6. Add `init` subcommand:
   - When user runs `tyrex init`, create project-local `.tyrex/` structure (state, features, context, map, skills)
   - Create `docs/` structure (adrs, rfcs, wiki, diagrams, specs, srs, prd)
   - Copy (not symlink) core config files: `tyrex.yml`, `TYREX.md`, `constitution.md`, `cursor.yml`, `roadmap.yml` — these are interpolated with project-specific values
   - Copy rules files (CLAUDE.md, AGENTS.md) — customizable per project
   - Symlink `.tyrex/templates/` → `~/.tyrex/templates/` (stub — full symlink logic in Task 2)
   - Create `docs/CHANGELOG.md` if it doesn't exist
7. Update `printHelp()` to reflect new model
8. Update `handleUninstall()` — only cleans global

## Acceptance Criteria
- [ ] `npx tyrex-framework` installs to `~/` without asking local/global
- [ ] `tyrex init` creates `.tyrex/` and `docs/` in current directory
- [ ] No `--local`/`-l` or `--global`/`-g` flags exist
- [ ] Global install does NOT create `.tyrex/state/`, `.tyrex/features/`, `docs/` in `~/`
- [ ] Help text reflects new model

## Constraints & Trade-offs
- Must remain a single-file CLI (no splitting bin/tyrex.js)
- Must remain zero-dependency
- `init` subcommand reuses existing `copyTemplate()`/`copyTemplateIfNew()` functions
- Core config files (tyrex.yml, TYREX.md, etc.) are COPIED, not symlinked — they contain project-specific data

## Dependencies
- Node.js fs, path, os (already used)

## Files Affected
- `bin/tyrex.js` (modify)

## Edge Cases
- User runs `tyrex init` without global install → detect and warn ("Run `tyrex` first to install globally")
- User runs `tyrex` twice → re-install overwrites commands/templates (safe, they're generic)
- User runs `tyrex init` twice → `copyTemplateIfNew` protects project config, symlinks are updated

## Testing Strategy
- Manual testing: run `tyrex` and verify global install
- Manual testing: run `tyrex init` in a test directory and verify structure + symlinks
- Verify `--help` output matches new model

## Rollback Plan
- Revert this commit. No data migration involved.
