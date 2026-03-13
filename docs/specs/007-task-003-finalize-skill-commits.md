# SPEC: Task 3 — Update Step 9 (Finalize) to Commit Skill Files

## Objective
Ensure that skill files modified or created during Step 5b are included in the final commit when the review is finalized.

## Technical Approach
In Step 9 of `tyrex-review.md`, add an instruction to:
1. Include modified `.tyrex/skills/*.md` files in the final commit
2. Include newly created `.tyrex/skills/*.md` files in the final commit
3. Sync updated skills to provider directories (same pattern as `/tyrex-skills sync`)

## Files Affected
- `templates/commands/unified/tyrex-review.md` — modify Step 9

## Edge Cases
- No skill files changed → nothing to add to commit
- New skill created → must be synced to all 4 agent directories

## Testing Strategy
Quality: optional. Verify by inspection.
