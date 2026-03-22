# SPEC: Rewrite release-engineer skill

## Objective
Rewrite release-engineer.md from 42 to ~100 lines with concrete patterns for breaking change detection, rollback, hotfix workflow, and multi-manifest consistency.

## Technical Approach
- Add breaking change detection patterns: API signature diff, schema migration review, config key removal
- Add rollback procedures: version pinning, blue-green checklist, database rollback gates
- Add hotfix workflow: cherry-pick discipline, backport verification, expedited review criteria
- Add pre-release management: alpha/beta/rc naming, feature flag gating, staged rollouts
- Add deprecation notice patterns: timeline communication, migration guides, sunset enforcement
- Add multi-manifest consistency: lockfile sync, cross-package version alignment
- Expand review criteria to 15+ items

## Files Affected
- `templates/skills/release-engineer.md`
- `.tyrex/skills/release-engineer.md`

## Testing Strategy
N/A (markdown documentation)
