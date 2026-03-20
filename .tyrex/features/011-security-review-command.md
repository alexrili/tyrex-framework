# Feature 011 — /tyrex-security-review command

## Objective
Create a dedicated security scanning command that performs comprehensive vulnerability analysis, generates persistent reports, and integrates findings into the framework's development lifecycle.

## Acceptance Criteria
- Command `/tyrex-security-review` scans codebase for secrets, logical vulns, OWASP Top 10, unprotected endpoints
- Plan mode only — reads code, generates reports, never modifies source
- Session reports saved to `.tyrex/security/SECURITY-NNN.md`
- Consolidated audit in `.tyrex/security/audit.md` with `[ ]`/`[x]` tracking
- `/tyrex-new` reads `audit.md` and shows pending findings before feature creation
- `/tyrex-plan` cross-references `audit.md` when proposing security tasks
- `/tyrex-do` marks findings `[x]` when completing security `rc-*` tasks
- `/tyrex-status` reads from `.tyrex/security/audit.md`
- `/tyrex-init` generates initial scan to `.tyrex/security/`
- Migrates existing `.tyrex/map/security-audit.md` to new path

## Out of Scope
- Auto-fixing vulnerabilities
- External dependency scanning (npm audit, etc.)
- Build mode / code modification

## Skills
- devsec

## Configuration
- Docs: CHANGELOG, SPEC per task, ADR-009
- Branch: feat/011-security-review-command
- Commit mode: approve each

## Tasks
1. Create /tyrex-security-review command template [devsec] (large)
2. Update /tyrex-init — initial scan + migration [devsec] (medium) ‖
3. Integrate audit.md into /tyrex-new + /tyrex-status (small) ‖
4. Integrate audit.md into /tyrex-plan + /tyrex-do [devsec] (medium) ‖
5. Sync commands + update CLI, CHANGELOG, TYREX.md (small)

Wave 1: T1 → Wave 2: T2‖T3‖T4 → Wave 3: T5

## Status
in_progress
