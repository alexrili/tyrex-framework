# ADR-002: Skills System — Reusable AI Agent Personas

## Status
Accepted

## Date
2026-03-07

## Context

Tyrex orchestrates AI agents for pair programming, but agents currently operate with generic behavior. There is no mechanism to:

1. **Specialize agent behavior per task** — A security-related task benefits from a security engineer's perspective, while a database migration benefits from a DBA's perspective. Currently, agents apply the same generalist approach to all tasks.

2. **Accumulate domain expertise** — When an agent learns patterns specific to a project (e.g., "this codebase uses repository pattern", "always validate UUIDs at the boundary"), there is no structured way to persist and reuse that knowledge.

3. **Suggest relevant expertise at demand time** — When a user describes a new demand via `/tyrex-new`, the system cannot recommend which specialized perspectives should be applied during planning and execution.

The `.tyrex/skills/` directory exists but is empty, and the `/tyrex-skills` command exists but has no supporting infrastructure.

## Decision

Implement a Skills System with the following design:

1. **Skills as Markdown Personas** — Each skill is a `.md` file in `.tyrex/skills/` with a defined structure: role description, expertise areas, review criteria, behavioral guidelines, and known patterns. Markdown is chosen over YAML for readability and because agents naturally produce/consume markdown.

2. **Skill Lifecycle:**
   - **Creation**: Via `/tyrex-skills create` or suggested during `/tyrex-new` when no matching skill exists
   - **Application**: Skills are loaded as additional context when executing tasks that match their expertise area
   - **Evolution**: Skills are enriched after `/tyrex-review` with new patterns and lessons learned (feeds into Feature 004's knowledge base)

3. **Auto-suggestion on `/tyrex-new`:**
   - When a user describes a demand, the system analyzes the description to identify required expertise domains
   - It checks `.tyrex/skills/` for matching skills
   - If no matching skill exists, it suggests creating one before proceeding to `/tyrex-plan`
   - Selected skills are recorded in the feature spec and loaded during `/tyrex-do`

4. **Skill Format** (`.tyrex/skills/{skill-name}.md`):
   ```
   # Skill: {Role Name}
   ## Role — One-line description
   ## Expertise — Areas of specialization
   ## Guidelines — Behavioral rules and patterns
   ## Patterns — Project-specific learned patterns (grows over time)
   ## Review Criteria — What this persona checks during review
   ```

5. **Integration Points:**
   - `/tyrex-new`: Analyze demand → suggest/select skills
   - `/tyrex-plan`: Skills influence task breakdown and SPEC generation
   - `/tyrex-do`: Selected skills loaded as context per task
   - `/tyrex-skills`: Manage (create, list, edit, delete) skills

## Consequences

**Easier:**
- Agents produce higher-quality output by operating with specialized perspectives
- Project-specific knowledge accumulates and persists across sessions
- New team members (human or AI) inherit institutional knowledge via skills
- Demand analysis becomes more structured with skill-based expertise matching

**Harder:**
- More files to maintain in `.tyrex/skills/` (mitigated: skills are suggested, not forced)
- Risk of skill bloat over time (mitigated: `/tyrex-skills` includes cleanup/merge commands)
- Initial setup requires creating foundational skills (mitigated: system suggests creation)

## Alternatives Considered

1. **Skills as YAML** — Rejected: less readable, harder for agents to naturally produce, and skill content (guidelines, patterns) is inherently prose-heavy.
2. **Skills embedded in TYREX.md** — Rejected: would bloat the project context file; skills need independent lifecycle and selective loading.
3. **External skill registry** — Rejected for now: adds network dependency and complexity. Can be added later as an enhancement (e.g., `tyrex-skills install backend-engineer`).
