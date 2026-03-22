# ADR-009: Dedicated Security Review Command

## Status
Accepted

## Date
2026-03-20

## Context
The framework's security scanning was embedded in `/tyrex-review` Lens 4 as a lightweight check. Security findings lived in `.tyrex/map/security-audit.md` but were not consumed by `/tyrex-new` or `/tyrex-plan`. Resolved findings were tracked inconsistently — PR scope didn't persist new findings, and completed `rc-*` tasks didn't auto-mark findings as resolved.

## Decision
Create a dedicated `/tyrex-security-review` command that performs comprehensive security scans (secrets, logical vulns, OWASP Top 10, unprotected endpoints). Reports stored in `.tyrex/security/` (session reports + consolidated audit). Integrate `audit.md` consumption into `/tyrex-new`, `/tyrex-plan`, `/tyrex-do`, `/tyrex-status`, and `/tyrex-init`. `/tyrex-review` Lens 4 remains unchanged as an independent lightweight check.

## Consequences
- **Positive:** Full security lifecycle — scan, report, surface findings, track resolution
- **Positive:** Consistent pattern with `.tyrex/bugs/` (session-based reports)
- **Positive:** `/tyrex-new` and `/tyrex-plan` become security-aware
- **Negative:** One more command to maintain; migration from `.tyrex/map/security-audit.md` to `.tyrex/security/audit.md`
- **Migration:** Existing `security-audit.md` content moves to new path on first run
