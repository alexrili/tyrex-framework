# Skills System

## Overview

Skills are persona-based agent contexts that specialize AI agent behavior for specific domains. Unlike generic instructions, skills provide a **role**, **expertise areas**, **behavioral guidelines**, **project-specific patterns**, and **review criteria** that shape how an agent approaches implementation and code review.

## How Skills Work

```
/tyrex-new → Skill suggestion → /tyrex-plan → Skill assignment → /tyrex-do → Skill loading
```

1. **Suggestion**: During `/tyrex-new`, the system analyzes the demand description and suggests relevant skills. Missing skills can be created on the spot.
2. **Assignment**: During `/tyrex-plan`, skills are assigned to individual tasks based on expertise match.
3. **Loading**: During `/tyrex-do`, the assigned skill is loaded as additional context before the agent implements each task.

## Skill Format

Each skill is a markdown file at `.tyrex/skills/{name}.md`:

```markdown
# Skill: {Role Name}

## Role
One-line description of the persona and focus area.

## Expertise
- Area of specialization 1
- Area of specialization 2

## Guidelines
- Behavioral rule this persona follows
- How this persona approaches trade-offs

## Patterns
Project-specific conventions. Starts empty, grows via /tyrex-review.

## Review Criteria
- What this persona checks during code review
- Quality gates specific to this domain
```

## Managing Skills

| Command | Action |
|---------|--------|
| `/tyrex-skills` | List all installed skills |
| `/tyrex-skills create [name]` | Create a new skill interactively |
| `/tyrex-skills sync` | Sync skills to all provider directories |

## Skill Locations

| Path | Role |
|------|------|
| `.tyrex/skills/*.md` | Canonical source of truth |
| `.claude/skills/*.md` | Claude Code copies |
| `.opencode/skills/*.md` | OpenCode copies |
| `.cursor/rules/tyrex-skill-*.md` | Cursor copies |
| `.codex/skills/tyrex/skill-*.md` | Codex copies |

## Best Practices

- **Keep skills concise** (under 150 lines) — they are loaded into agent context
- **Start with Role and Guidelines** — Patterns grow organically after reviews
- **One persona per skill** — don't combine "backend engineer" and "DBA" into one skill
- **Use `/tyrex-new` suggestions** — the system identifies which skills are needed per demand
- **Enrich Patterns after reviews** — when `/tyrex-review` identifies recurring issues, add them to the relevant skill's Patterns section

## Example Skills

Common personas for software projects:
- `backend-engineer.md` — API correctness, performance, error handling
- `security-reviewer.md` — Auth, injection, secrets management
- `product-manager.md` — User stories, acceptance criteria, business logic
- `dba.md` — Query optimization, migrations, data integrity
- `frontend-engineer.md` — UI consistency, accessibility, state management
