# Feature 012 — Automatic versioning as framework directive

## Objective
Make version bumping a mandatory framework behavior: detect package manager, suggest semver bump based on change type, propagate version across all files, and include in the same atomic commit.

## Acceptance Criteria
- Detect package manager manifests (package.json, composer.json, pyproject.toml, Cargo.toml, etc.)
- Suggest semver bump (major/minor/patch) based on change type; human confirms or overrides
- Propagate version to all referencing files (README, docs, badges, configs)
- Version bump included in the same atomic commit
- `/tyrex-do` enforces version check before committing when CHANGELOG/ADR changes
- `/tyrex-review` flags missing version bump as a finding
- `constitution.md` updated with versioning rule
- `TYREX.md` updated with versioning pattern
- Built-in `release-engineer` skill template shipped with framework

## Out of Scope
- Auto-publishing to package registries
- Monorepo versioning
- Pre-release version management

## Skills
- release-engineer

## Configuration
- Docs: CHANGELOG, SPEC per task
- Branch: feat/012-auto-versioning
- Commit mode: approve each

## Tasks
1. Update /tyrex-do — version detection, bump, propagation [release-engineer] (medium)
2. Update /tyrex-review — flag missing version bump [release-engineer] (small) ‖
3. Update constitution + TYREX.md + sync + finalize (small)

Wave 4: T1 → Wave 5: T2‖T3

## Status
done
