# SPEC: Sync Commands to Agent Directories

## Task
Feature 020, Task 6 — Sync commands to agent directories

## Date
2026-03-24

## Objective
Sync all modified, created, and deleted commands to all 4 agent directories, ensuring consistency. This is always the LAST task per project pattern.

## Technical Approach
1. **Copy new command:** `tyrex-recover.md` → all 4 agent command directories
2. **Remove old command:** delete `tyrex-resume.md` from all 4 agent command directories
3. **Sync updated commands:** copy all modified `tyrex-*.md` files to agent directories
4. **Sync shared files:** copy `crash-detection.md` to shared directories
5. **Sync CLAUDE.md template:** copy updated `templates/CLAUDE.md` to project root CLAUDE.md equivalent locations

Agent directories (from TYREX.md):
- `.claude/commands/` (Claude Code)
- `.opencode/commands/` (OpenCode)
- `.cursor/rules/tyrex/` (Cursor)
- `.codex/skills/tyrex/` (Codex)

## Constraints & Trade-offs
- Must be the LAST task — any changes after sync will be missed
- Shared files go to a shared/ subdirectory within each agent's command dir

## Dependencies
- All previous tasks (1–5)

## Files Affected
- All 4 agent command directories (copy/delete operations)

## Edge Cases
- Agent directory doesn't exist: skip silently (agent not installed)
- Symlinks already in place: check if project uses symlink architecture (per ADR-005)

## Testing Strategy
Quality: optional (file copy verification via ls/diff)
