# SPEC: Task 004 — Re-sync to Agent Directories

## Objective
Copy updated template files from `templates/commands/unified/` to all 4 agent directories.

## Technical Approach
Copy each updated .md file to:
- `.claude/commands/`
- `.opencode/commands/`
- `.cursor/rules/tyrex/`
- `.codex/skills/tyrex/`

Also sync `templates/AGENTS.md` → `.opencode/AGENTS.md` if applicable.

## Files Affected
- `.claude/commands/tyrex-{new,plan,do,review,quick,help}.md`
- `.opencode/commands/tyrex-{new,plan,do,review,quick,help}.md`
- `.cursor/rules/tyrex/tyrex-{new,plan,do,review,quick,help}.md`
- `.codex/skills/tyrex/tyrex-{new,plan,do,review,quick,help}.md`

## Testing Strategy
Quality: optional — grep for "interactive quiz" across all agent dirs to confirm zero matches.
