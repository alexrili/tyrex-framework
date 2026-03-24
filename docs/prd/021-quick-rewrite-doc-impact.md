# PRD: Quick Rewrite & Doc Impact Analysis

## Date
2026-03-24

## Project
tyrex-framework

## 1. Problem Statement

Two related problems erode the framework's reliability:

**Problem A — `/tyrex-quick` skips stages instead of auto-approving them.** The command was written as a compressed pipeline that reimplements new/plan/do in abbreviated form. Words like "collapses", "fewer steps", and "skip this step" give agents license to be superficial. Result: no SPECs, no ADRs, no proper planning, no version bumps, no clarifying questions — the opposite of what the user expects.

**Problem B — Documentation drifts from code.** When a feature changes a port, route, env var, or CLI arg, nothing in the framework checks whether README, wiki, OpenAPI, diagrams, docker-compose, or .env.example still reflect reality. The framework enforces CHANGELOG and SPEC but ignores consistency with existing documentation. This is the core problem Tyrex was built to solve — yet it has a blind spot here.

## 2. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Quick executes all stages | SPECs, docs, planning, version bump all present after /tyrex-quick | 100% |
| Quick only skips approvals | Number of stages skipped vs auto-approved | 0 skipped |
| Ambiguities still get questions | Clarification questions asked when description is ambiguous | Same as /tyrex-new |
| Doc inconsistencies detected | % of doc-impacting changes flagged before close | 100% |
| Auto-fix doc inconsistencies | Tasks created and executed when drift detected | Automatic |
| Scan covers all doc types | README, wiki, OpenAPI, diagrams, config files, TYREX.md | All scanned |

## 3. User Stories

### Quick Rewrite
- As a dev, I run `/tyrex-quick` and get the same output as `new → plan → do` — just without approval pauses.
- As a dev, I still get asked when something is ambiguous, even in quick mode.
- As a dev, I see SPECs, CHANGELOG, version bump, and docs generated — nothing is cut.

### Doc Impact Analysis
- As a dev, when I change a port from 3000 to 3008, the framework detects that README and docker-compose reference 3000 and creates an update task.
- As a dev, during review, the framework flags that my wiki page still references the old API endpoint.
- As a dev, I cannot close a feature with known doc inconsistencies — the framework blocks and auto-creates fix tasks.

## 4. Scope

### In Scope
- Rewrite `/tyrex-quick` as orchestrator of `new(--auto) → plan(--auto) → do(--auto)`
- Create `doc-impact-analysis.md` shared algorithm
- Integrate into `/tyrex-plan` (add doc update tasks)
- Integrate into `/tyrex-do` (post-implementation scan + auto-fix tasks)
- Integrate into `/tyrex-review` (Lens 6: Documentation Consistency)
- Scan: README, wiki/*, OpenAPI, diagrams, TYREX.md, constitution, config files (.env.example, docker-compose, etc.)

### Out of Scope
- Automated OpenAPI generation (already exists as `/tyrex-openapi`)
- Automated README generation (already exists as `/tyrex-readme`)
- External doc systems (Confluence, Notion, etc.)

## 5. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Quick rewrite is too long for context window | Agent loses instructions mid-execution | Quick delegates to existing commands, doesn't reimplement them |
| Doc scan generates false positives | Noise, user ignores findings | Scan matches specific patterns (ports, URLs, env vars), not fuzzy text |
| Scan slows down the workflow | User frustration | Scan is fast (grep-based), runs only at checkpoints |
