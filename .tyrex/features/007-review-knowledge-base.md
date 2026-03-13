# Feature 007: Skill Evolution via /tyrex-review

## Objective
Extend `/tyrex-review` to extract patterns from review findings and evolve existing skills (or suggest new ones), creating a continuous learning loop between code review and skill personas.

## Acceptance Criteria
- [ ] After review findings are generated (Step 5b), the agent identifies patterns that match existing skills
- [ ] Matched patterns are appended to the skill's `## Patterns` section with date, description, and code reference
- [ ] New `## Review Criteria` checklist items are added when the review reveals uncovered checks
- [ ] If findings match no existing skill, the agent suggests creating a new skill pre-populated with discovered patterns
- [ ] Pattern additions are presented for user approval before writing (auto-approved with `--do-all`)
- [ ] Skills respect the 150-line limit — older patterns are summarized when approaching it
- [ ] Review summary (Step 6) includes "Skills updated" or "New skills suggested" section
- [ ] Skill files are committed alongside other review changes (Step 9)
- [ ] CHANGELOG updated

## Out of Scope
- External skill registry or sharing
- Automatic skill merging or deduplication
- Skill versioning or history tracking
- Changes to skill format (## Role, ## Expertise, ## Guidelines remain unchanged)

## Skills
- copywriter (for consistency of new user-facing text in /tyrex-review)

## Configuration
- Docs: CHANGELOG + SPEC + ADR-006
- Branch: feat/007-review-knowledge-base
- Commits: auto

## Status
spec
