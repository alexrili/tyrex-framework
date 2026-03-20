# Feature 009: /tyrex-debug — Interactive Debug Command

## Objective
Create an interactive debug command that systematically diagnoses problems (logs, stack traces, containers), documents findings as a persistent bug registry, and integrates with `/tyrex-new` to suggest bug fixes before new features.

## Acceptance Criteria
- [ ] `/tyrex-debug` command template created and synced to all 4 agents
- [ ] Two investigation modes: user-directed and automatic analysis
- [ ] Diagnostic depth selection (quick/standard/deep)
- [ ] Infrastructure management (docker, services) with user permission
- [ ] Bug reports generated at `.tyrex/bugs/DEBUG-NNN.md` with severity classification
- [ ] `/tyrex-new` checks for open bugs before Step 1
- [ ] `/tyrex-status` shows bug summary
- [ ] Debugger skill template shipped in `templates/skills/debugger.md`
- [ ] Skill auto-suggested when not installed

## Out of Scope
- Automated bug fixing (diagnose only)
- IDE integration or step-through debugging
- Production environment debugging
- Bug assignment or team workflow

## Skills
- debugger
- devsec

## Configuration
- Docs: PRD, SRS, ADR-007, Wiki, D2 Diagram (sequence)
- Branch: feat/debug-command
- Commits: approve
- SPEC: per task (generated during /tyrex-plan)

## Tasks
1. Create `/tyrex-debug` command template (large, sequential, security: full-audit)
2. Create debugger skill template (small, parallel with 1)
3. Update `/tyrex-new` — bug check integration (small, after 1)
4. Update `/tyrex-status` — bug summary section (small, parallel with 3)
5. Update `/tyrex-help` — add debug command (small, parallel with 3,4)
6. Update CLI + templates + sync to agent dirs (medium, after 1-5)
7. Security hardening review (small, after 6, security: full-audit)

## Status
done
