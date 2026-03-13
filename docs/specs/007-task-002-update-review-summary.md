# SPEC: Task 2 — Update Review Summary Format (Step 6)

## Objective
Add a "Skills" section to the review summary output template in Step 6 of `/tyrex-review`, showing which skills were updated and which new skills were suggested.

## Technical Approach
In the Step 6 review summary code block within `tyrex-review.md`, add a new section after the "TYREX.md" line:

```
Skills:
  Updated:   [N] ([list of skill names])
  Suggested: [N] ([list of new skill names])
```

If no skill updates occurred, display:
```
Skills:     no updates
```

## Files Affected
- `templates/commands/unified/tyrex-review.md` — modify Step 6 summary template

## Edge Cases
- Zero skill updates → show "no updates"
- Skills updated but no new suggestions → show updated count only
- New skills suggested but none accepted → show suggested count

## Testing Strategy
Quality: optional. Visual verification of output format.
