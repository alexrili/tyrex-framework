# Demand: Automatic versioning as framework directive

> Discussed on 2026-03-20. Ready for implementation.

## Summary

General framework directive: before committing changes that generate CHANGELOG/ADR, the framework must detect the package manager, suggest a semver bump, propagate the version across all files, and include the version change in the same atomic commit.

## Behavior

1. **Detect package manager** — `package.json`, `composer.json`, `pyproject.toml`, `Cargo.toml`, `mix.exs`, etc.
2. **Suggest semver bump** based on change type:
   - New command/feature = minor
   - Bug fix = patch
   - Breaking change = major
3. **Human confirms or overrides** the suggestion
4. **Propagate version** to all files that reference it — README, docs, badges, configs, lock files
5. **Include in commit** — version bump is part of the same atomic commit

## Where this lives in the framework

- **Directive in `constitution.md`** — inviolable rule
- **Instruction in `/tyrex-do`** — before committing, check and bump version
- **Verification in `/tyrex-review`** — check if version was updated when CHANGELOG changed
- **Pattern in `TYREX.md`** — documented as project pattern

## Integration with existing commands

| Command | Change |
|---------|--------|
| `/tyrex-do` | Before commit: detect package manager, suggest bump, propagate, include in commit |
| `/tyrex-review` | Verify: if CHANGELOG/ADR changed but version didn't, flag as finding |
| `constitution.md` | Add versioning rule |
| `TYREX.md` | Document pattern |

## Design decisions

- Framework suggests version, human decides — never auto-bumps without confirmation
- Scans all files for version references (not just the package manifest)
- Applies to ANY project with a package manager, not just Node.js
