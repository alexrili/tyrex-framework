# Demand: /tyrex-security-review command

> Discussed on 2026-03-20. Ready for implementation.

## Summary

Create a dedicated `/tyrex-security-review` command for comprehensive security scanning of the codebase. Plan mode only (read-only, generates reports, never fixes code).

## Scan Scope

- Secrets/envs exposed (hardcoded keys, tokens, passwords, .env without gitignore)
- Sensitive data in logs, comments, configs
- Logical vulnerabilities in code (injection, auth bypass, path traversal, etc.)
- Unprotected endpoints (routes without auth/authz)
- OWASP Top 10 applicable to the project's stack

## Output

- `.tyrex/security/SECURITY-NNN.md` — per-session report (sequential numbering like DEBUG-NNN)
- `.tyrex/security/audit.md` — consolidated view (source of truth, `[ ]`/`[x]` status tracking)

## Integration with existing commands

| Command | Change |
|---------|--------|
| `/tyrex-new` | Step 0: read `audit.md`, show pending findings, offer "fix first" |
| `/tyrex-plan` | Cross-reference `audit.md` when planning tasks, pre-populate security tasks from known findings |
| `/tyrex-do` | When completing `rc-*` security tasks, mark corresponding finding as `[x]` in `audit.md` |
| `/tyrex-status` | Read from new path `.tyrex/security/audit.md` |
| `/tyrex-init` | Initial scan saves to `.tyrex/security/` (replaces `.tyrex/map/security-audit.md`) |
| `/tyrex-review` | No changes — Lens 4 continues as independent lightweight check |

## Design decisions

- Mirrors `.tyrex/bugs/` pattern with `DEBUG-NNN.md` for consistency
- Migrates from `.tyrex/map/security-audit.md` to `.tyrex/security/audit.md`
- Finding rows are never deleted, only marked `[x]` when resolved
- Previous report status (`[x]`) is preserved when generating new reports

## What it does NOT do

- Fix code automatically
- Scan external dependencies (npm audit, composer audit, etc.)
- Run in build mode
