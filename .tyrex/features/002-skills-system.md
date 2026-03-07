# Feature 002: Skills System — Reusable AI Agent Personas

## Status: planned

## Objective
Implement a skills system that allows AI agents to operate with specialized personas (e.g., backend engineer, product manager), auto-suggested during `/tyrex-new` based on demand analysis, and loaded as context during planning and execution.

## Acceptance Criteria
- [ ] Skill markdown format defined and documented (Role, Expertise, Guidelines, Patterns, Review Criteria)
- [ ] `/tyrex-skills` command: create, list skills
- [ ] `/tyrex-new` analyzes demand description and suggests relevant skills
- [ ] `/tyrex-new` prompts skill creation when no matching skill exists
- [ ] Selected skills recorded in feature spec
- [ ] Skills loaded as additional context during `/tyrex-do` task execution
- [ ] `/tyrex-plan` references selected skills when generating task breakdown
- [ ] Skill template added to `templates/` and scaffolded by `bin/tyrex.js`
- [ ] All 4 agent directories synced with updated commands
- [ ] ADR-002 finalized, wiki page created, CHANGELOG updated

## Out of Scope
- External skill registry / `tyrex-skills install` from remote
- Skill evolution via `/tyrex-review` (deferred to Feature 004)
- Skill versioning or diffing
- Skills for `/tyrex-discuss` or `/tyrex-research` (Features 003, 005)

## Plan (8 tasks, 5 waves)
1. Skill template + scaffold in bin/tyrex.js
2. Update /tyrex-skills command (create, list)
3. Update /tyrex-new — skill analysis & suggestion (parallel w/ 4,5)
4. Update /tyrex-plan — skill-aware task assignment (parallel w/ 3,5)
5. Update /tyrex-do — skill loading during execution (parallel w/ 3,4)
6. Sync commands to all 4 agent directories
7. Update help, status, settings commands
8. Wiki + CHANGELOG + ADR finalize

## Configuration
- Docs: CHANGELOG (mandatory), ADR-002 (done), Wiki (yes), Diagrams (no)
- Branch: `feat/skills-system`
- Commits: approve
- Quality: recommended (no test framework)

## Related
- ADR: `docs/adrs/002-skills-system.md`
- Depends on: Feature 001 (done)
- Feeds into: Feature 004 (review knowledge base + skill evolution)
