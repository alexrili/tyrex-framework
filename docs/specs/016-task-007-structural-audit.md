# SPEC: 016-task-007 — Structural Audit of All 22 Commands

## Objective

Ensure all 22 command templates have a consistent section structure and include Feature Context Resolution where applicable.

## Technical Approach

1. Read all 22 files in `templates/commands/unified/`.
2. Verify each command contains the required sections in order: YAML frontmatter, `# Title`, intro paragraph, `## Agent Mode`, `## ADF` (where applicable), `## Behavior`, `## Important Rules`.
3. Fix any missing or inconsistent sections — add stubs or reorder as needed.
4. Add the "Feature Context Resolution" section to all commands that read from cursor.yml or per-feature state, referencing the shared algorithm from Task 1.
5. Document any structural deviations that are intentional (e.g., tyrex-init does not need Feature Context Resolution).

## Files Affected

- All files in `templates/commands/unified/*.md` (22 commands)

## Testing Strategy

- Script or manual check: every command file contains the required section headers.
- Grep for Feature Context Resolution in commands that access state; confirm presence.
- Verify no command has duplicate or out-of-order sections.
