# SPEC: Task 003 — Update /tyrex-new with bug check integration

## Feature
009 — Debug Command

## Objective
Add a bug registry check to `/tyrex-new` so developers see open bugs before starting a new feature, with the option to fix them first.

## Technical Approach
Add a new **Step 0b** (after roadmap check, before "describe the feature") to `templates/commands/unified/tyrex-new.md`:

1. Read `.tyrex/bugs/` directory for `DEBUG-*.md` files
2. Parse each file for findings with `Status: open`
3. If open bugs exist, present structured choices:
   ```
   Open bugs found (N):
     [!] CRITICAL  BUG-001: [title] (DEBUG-003)
     [!] HIGH      BUG-002: [title] (DEBUG-005)
     [!] MEDIUM    BUG-003: [title] (DEBUG-005)

     [1] Fix bugs first — create a fix feature for selected bugs
     [2] Continue to new feature — address bugs later
   ```
4. If "fix bugs first": hand off to `/tyrex-quick` with selected bugs as context
5. If "continue" or no bugs: proceed to Step 1 normally

## Security Considerations
None — read-only file system check.

## Files Affected
- `templates/commands/unified/tyrex-new.md` (modified)

## Edge Cases
- No `.tyrex/bugs/` directory → skip silently
- All bugs resolved → skip silently
- Large number of open bugs → show top 10 by severity, mention "and N more"

## Testing Strategy
- Verify step is added in correct position (after roadmap, before describe)
- Verify structured choices format matches adaptive decision pattern
