# SPEC: Update /tyrex-review — flag missing version bump

## Task
feat-012-task-002

## Objective
Add version bump verification to `/tyrex-review` so it flags when CHANGELOG changed but version didn't.

## Technical Approach
- Add check in Lens 1 (Pattern Compliance) or as a dedicated sub-check:
  1. Detect if CHANGELOG.md or any ADR was modified in the branch diff
  2. Detect if any package manifest version was bumped
  3. If CHANGELOG changed but version didn't → flag as finding: "CHANGELOG updated but version not bumped"
  4. Severity: HIGH (versioning is a framework directive after 012)
- Works in both PR scope and full scope

## Security Considerations
- None

## Constraints & Trade-offs
- Simple check: did version change? Yes/No. Doesn't validate correctness of bump type.
- Only applies to projects with a detected package manager

## Dependencies
- Task 1 (versioning pattern must be defined in /tyrex-do first)

## Files Affected
- `templates/commands/unified/tyrex-review.md` (modify)

## Edge Cases
- No package manager → skip check
- Version bumped but CHANGELOG not updated → separate existing check
- Multiple manifests with different versions — flag inconsistency

## Testing Strategy
- Quality: recommended — verify detection logic covers the check
