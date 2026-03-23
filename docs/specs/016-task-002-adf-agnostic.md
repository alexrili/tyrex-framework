# SPEC: 016-task-002 — Agent-Agnostic ADF Text

## Objective

Remove hardcoded agent names (Claude Code, OpenCode, Cursor, Codex) from ADF sections across 7 command templates, replacing them with generic capability-based descriptions.

## Technical Approach

1. Search all 7 commands for ADF sections containing hardcoded agent names.
2. Replace "CLI agents (Claude Code, OpenCode): numbered choices..." with "CLI-based agents: numbered choices with explicit selection prompts."
3. Replace "Chat-based agents (Cursor, Codex): numbered list or direct question" with "Chat-based agents: numbered list or direct question to the human."
4. Ensure no agent product names remain in ADF sections — only capability categories (CLI-based, chat-based).
5. Preserve the ADF interaction logic; only change the labeling.

## Files Affected

- `templates/commands/unified/tyrex-new.md`
- `templates/commands/unified/tyrex-plan.md`
- `templates/commands/unified/tyrex-do.md`
- `templates/commands/unified/tyrex-review.md`
- `templates/commands/unified/tyrex-quick.md`
- `templates/commands/unified/tyrex-debug.md`
- `templates/commands/unified/tyrex-resume.md`

## Testing Strategy

- Grep all 7 files for agent product names post-edit; expect zero matches.
- Verify ADF sections still contain both CLI-based and chat-based interaction patterns.
- Confirm no behavioral logic was altered — only label text changed.
