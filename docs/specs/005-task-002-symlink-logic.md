# SPEC: Symlink logic for init subcommand

## Feature
Feature 005 — Global-Only Installation

## Date
2026-03-12

## Project
tyrex-framework

## Objective
Implement full symlink creation logic in the `init` subcommand so project directories reference global agent commands and templates.

## Technical Approach

1. **Auto-detect installed agents:** scan `~/` for agent command directories:
   - `~/.claude/commands/` → Claude Code installed
   - `~/.opencode/commands/` → OpenCode installed
   - `~/.cursor/rules/tyrex/` → Cursor installed
   - `~/.codex/skills/tyrex/` → Codex installed
2. **Create symlinks for agents that need project-local files:**
   - Cursor: `<project>/.cursor/rules/tyrex/` → `~/.cursor/rules/tyrex/`
   - Codex: `<project>/.codex/skills/tyrex/` → `~/.codex/skills/tyrex/`
   - Claude Code: no symlink needed (reads from `~/.claude/commands/` natively)
   - OpenCode: no symlink needed (reads from `~/.opencode/commands/` natively)
3. **Templates symlink:** `<project>/.tyrex/templates/` → `~/.tyrex/templates/`
4. **Symlink implementation:**
   - Use `fs.symlinkSync(target, linkPath)` with type `'dir'` for directories
   - Before creating: check if symlink already exists, if so remove and recreate (handles updates)
   - Before creating: ensure parent directory exists via `ensureDir()`
   - If target doesn't exist: warn user and skip (global install incomplete)
5. **Broken symlink detection:**
   - Use `fs.lstatSync()` to check if path is symlink, then `fs.existsSync()` to check if target exists
   - If broken: warn and offer to recreate

## Acceptance Criteria
- [ ] `tyrex init` auto-detects which agents are globally installed
- [ ] Symlinks created for Cursor and Codex pointing to global dirs
- [ ] `.tyrex/templates/` symlinks to `~/.tyrex/templates/`
- [ ] Re-running `tyrex init` updates symlinks cleanly
- [ ] Missing global dirs produce a warning, not a crash

## Constraints & Trade-offs
- `fs.symlinkSync` on Windows requires Developer Mode or admin — acceptable limitation (ADR-005)
- Directory symlinks only — no individual file symlinks (simpler, fewer syscalls)
- Claude Code and OpenCode don't need symlinks — they support global command directories natively

## Dependencies
- Task 1 (init subcommand skeleton)
- Node.js fs.symlinkSync, fs.lstatSync

## Files Affected
- `bin/tyrex.js` (modify)

## Edge Cases
- Global directory doesn't exist → warn, skip symlink
- Symlink already exists and points to correct target → no-op
- Symlink exists but points to wrong target → remove and recreate
- Regular directory exists where symlink should be → warn user, don't overwrite

## Testing Strategy
- Manual testing: run `tyrex init` with different agents installed globally
- Verify symlinks resolve correctly with `ls -la`
- Test re-init updates symlinks

## Rollback Plan
- Revert this commit. Symlinks can be manually removed with `rm`.
