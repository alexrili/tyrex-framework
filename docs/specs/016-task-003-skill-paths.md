# SPEC: 016-task-003 — Remove Hardcoded Skill Paths

## Objective

Remove hardcoded agent-specific skill directory paths from tyrex-do and tyrex-review, replacing them with generic configuration-driven references.

## Technical Approach

1. Identify all occurrences of hardcoded paths: `.claude/skills/`, `.opencode/skills/`, `.codex/skills/tyrex/`, `.cursor/rules/tyrex/`.
2. Replace with a generic instruction: "Check agent skill directories as configured in the project's supported agents table (see TYREX.md)."
3. If a command needs to reference skill loading, point to the TYREX.md supported agents configuration rather than listing paths inline.
4. Ensure the replacement text is clear enough that any agent can resolve its own skill directory.

## Files Affected

- `templates/commands/unified/tyrex-do.md`
- `templates/commands/unified/tyrex-review.md`

## Testing Strategy

- Grep both files for `.claude/`, `.opencode/`, `.codex/`, `.cursor/` post-edit; expect zero matches.
- Verify skill-loading instructions still convey the correct behavior.
- Confirm TYREX.md contains the supported agents table being referenced.
