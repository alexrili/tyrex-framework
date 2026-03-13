# Feature 008: /tyrex-research — AI-powered Technical Research

## Objective
Create a new `/tyrex-research` command that enables structured technical research (codebase + web) with or without an active feature, persisting results on demand.

## Acceptance Criteria
- [ ] Command file `templates/commands/unified/tyrex-research.md` created
- [ ] Works with active feature (research feeds feature context) and without (standalone research)
- [ ] Searches codebase (grep, file exploration) for internal patterns and code
- [ ] Searches web (documentation, articles, GitHub) for external knowledge
- [ ] Presents research results in a structured summary
- [ ] Asks user to save results at the end (not automatic): "Save this research? [y/N]"
- [ ] If saving with active feature: stores in `.tyrex/features/NNN-research-TOPIC.md`
- [ ] If saving without feature: stores in `.tyrex/research/TOPIC.md`
- [ ] Synced to all 4 agent directories
- [ ] CHANGELOG updated

## Out of Scope
- Automatic saving (user must confirm)
- External API integrations (uses agent's built-in web capabilities)
- Research history or search index
- Multi-session research tracking

## Skills
- copywriter (for consistency of command text)

## Configuration
- Docs: CHANGELOG + SPEC
- Branch: feat/008-research-command
- Commits: auto

## Status
spec
