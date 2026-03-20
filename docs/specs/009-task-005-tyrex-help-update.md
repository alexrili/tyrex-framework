# SPEC: Task 005 — Update /tyrex-help with debug command

## Feature
009 — Debug Command

## Objective
Add `/tyrex-debug` to the command reference in `/tyrex-help`.

## Technical Approach
Edit `templates/commands/unified/tyrex-help.md`:
1. Add a "Debugging" category after "Exploration" with `/tyrex-debug`
2. Update workflow diagram to include debug flow
3. Add `/tyrex-debug` to the per-command help section

## Files Affected
- `templates/commands/unified/tyrex-help.md` (modified)

## Testing Strategy
- Verify command appears in reference listing
- Verify workflow diagram includes debug path
