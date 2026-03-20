# SPEC: Update /tyrex-do — version detection, bump, propagation

## Task
feat-012-task-001

## Objective
Add version management to `/tyrex-do` so it detects package managers, suggests semver bumps, propagates versions, and includes the bump in the same atomic commit.

## Technical Approach
- Add step before commit (after tests pass, before staging):
  1. **Detect package manager**: scan for `package.json`, `composer.json`, `pyproject.toml`, `Cargo.toml`, `mix.exs`, `go.mod`
  2. **Read current version** from the detected manifest
  3. **Classify change type**: scan CHANGELOG entry and commit message for `feat:` (minor), `fix:` (patch), `BREAKING` (major)
  4. **Suggest bump** with structured choice: "Suggested: minor (1.2.0 → 1.3.0). Confirm or override?"
  5. **Propagate version**: grep for current version string across all project files, update all references
  6. **Include in commit**: version changes are staged with the same commit
- Only triggers when CHANGELOG or ADR changes are detected in the commit
- With `--auto-approve`: auto-accepts the suggested bump

## Security Considerations
- Input validation: validate version string format (semver regex) before writing
- Ensure version propagation doesn't modify files outside the project directory

## Constraints & Trade-offs
- Framework suggests, human decides — never auto-bumps without confirmation (unless --auto-approve)
- Works for ANY package manager, not just Node.js
- Only activates when CHANGELOG/ADR changes are present (not every commit)

## Dependencies
- Feature 011 must be complete (modifies same file)
- Release-engineer skill for domain expertise

## Files Affected
- `templates/commands/unified/tyrex-do.md` (modify)

## Edge Cases
- No package manager detected — skip versioning silently
- Multiple package managers in project — use the first found, note others
- Version string appears in unexpected places (e.g., comments) — pragmatic grep, user confirms propagation targets
- Pre-release versions — follow semver pre-release format

## Testing Strategy
- Quality: required — version bump logic must be correct for all supported manifests
