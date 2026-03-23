# Feature 018: Symlink-First Architecture

## Objective
Ensure all framework-owned files (commands, templates, skills) are symlinks to the global installation, so projects auto-update when `npm install -g tyrex-framework@latest` is run. Only project-specific files remain as local copies.

## Acceptance Criteria
- All 4 agents use symlinks for commands (not just Cursor/Codex)
- `.tyrex/skills/` starts as symlink to global skills; breaks on first local customization
- `bin/tyrex.js` updated: `needsProjectSymlink: true` for all agents
- `tyrex init` creates symlinks for all agent command dirs
- Existing directories handled gracefully (warn, don't overwrite)
- Global install copies skills to `~/.tyrex/skills/` for symlinking
- TYREX.md updated with symlink-first pattern

## Out of Scope
- Agent-specific CLI behavior changes
- New commands

## Skills
- backend-engineer (for Node.js code quality)

## Tasks
1. Update AGENTS config — all agents needsProjectSymlink: true (bin/tyrex.js)
2. Global install — copy skills to ~/.tyrex/skills/ (bin/tyrex.js)
3. Project init — symlink skills + all agent commands (bin/tyrex.js)
4. CHANGELOG + version + TYREX.md + sync

## Status: planned
