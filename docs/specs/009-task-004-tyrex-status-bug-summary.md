# SPEC: Task 004 — Update /tyrex-status with bug summary

## Feature
009 — Debug Command

## Objective
Add a bug summary section to the `/tyrex-status` output so developers have visibility into open bugs.

## Technical Approach
Add a **Bugs** section to `templates/commands/unified/tyrex-status.md`:

1. In Step 1 (Gather data): add `.tyrex/bugs/` to the file list to read
2. In Step 2 (Display): add section between Security and Documentation:
   ```
   --- Bugs ----------------------------------------
     Debug sessions: N
     Open bugs:      N (C critical, H high, M medium, L low)

     [!] CRITICAL  BUG-001: [title] (DEBUG-003)
     [!] HIGH      BUG-002: [title] (DEBUG-005)
   ```
3. In Step 4 (Suggestions): if open bugs exist, suggest `/tyrex-debug` or `/tyrex-quick`

## Files Affected
- `templates/commands/unified/tyrex-status.md` (modified)

## Edge Cases
- No `.tyrex/bugs/` directory → omit section
- All bugs resolved → show "No open bugs" one-liner

## Testing Strategy
- Verify section appears in correct position in status output
- Verify severity counts are accurate
