# SPEC: Task 003 — Update Command Templates

## Objective
Replace "Interactive Quiz Rule" sections with "Adaptive Decision Format" in all affected command templates.

## Technical Approach
For each of 5 commands (tyrex-new, tyrex-plan, tyrex-do, tyrex-review, tyrex-quick):
1. Replace the `## Interactive Quiz Rule` section with `## Adaptive Decision Format`
2. New text: structured choices adapted to the agent's interface (CLI: numbered quiz; Chat: numbered list or direct question)
3. Also update tyrex-help.md references and AGENTS.md if it mentions the quiz pattern

## Files Affected
- `templates/commands/unified/tyrex-new.md`
- `templates/commands/unified/tyrex-plan.md`
- `templates/commands/unified/tyrex-do.md`
- `templates/commands/unified/tyrex-review.md`
- `templates/commands/unified/tyrex-quick.md`
- `templates/commands/unified/tyrex-help.md`
- `templates/AGENTS.md`

## Testing Strategy
Quality: optional — manual review. Verify no remaining "interactive quiz" references in templates/.
