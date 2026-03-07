---
description: "Manage skills - list, create, suggest, and sync specialized contexts"
---

# /tyrex-skills - Manage Skills

You are the Tyrex Framework orchestrator. The user wants to manage skills — specialized contexts that improve implementation quality for specific tech stacks and project areas.

## Behavior

### Default (no arguments): List installed skills

Scan ALL known skill locations in the project:

1. `.tyrex/skills/*/SKILL.md` (Tyrex canonical)
2. `.claude/skills/*/SKILL.md` (Claude Code native)
3. `.opencode/skills/*/SKILL.md` (OpenCode native)
4. `.agents/skills/*/SKILL.md` (Universal)
5. `.cursor/rules/*.md` (Cursor rules that act as skills)
6. Any skills referenced in `opencode.json` `instructions` field
7. Any skill-like `.md` files in custom directories

Display:

```
Installed Skills
════════════════════════════════════════

  Source: .tyrex/skills/
    rails-api          Ruby on Rails API development patterns
    sidekiq-workers    Sidekiq background job patterns

  Source: .claude/skills/
    react-native       React Native mobile development    [not synced to .tyrex/]

  Source: .opencode/skills/
    typescript         TypeScript strict mode patterns     [not synced to .tyrex/]

  Detected (not formal skills):
    .cursor/rules/flutter.md    Contains Flutter-specific instructions

  Total: 5 skills (2 canonical, 2 provider-specific, 1 detected)

  Actions:
    /tyrex-skills create     Create a new skill
    /tyrex-skills suggest    Analyze project and suggest skills
    /tyrex-skills sync       Sync all skills to .tyrex/skills/ and providers
```

### /tyrex-skills create [name]

Interactive skill creation:

1. If name provided, use it. Otherwise ask: "What area/technology is this skill for?"
2. Analyze the project to understand patterns for this area:
   - Read relevant source files
   - Identify patterns, conventions, file structure
   - Check dependencies and frameworks
3. Generate `SKILL.md` with:
   - name (lowercase, hyphenated)
   - description (concise, 1-2 sentences)
   - Context section (what this skill covers)
   - Patterns section (coding patterns, conventions)
   - Testing section (how to test in this context)
   - Common mistakes section
   - File structure section
4. Save to `.tyrex/skills/<name>/SKILL.md`
5. Ask: "Sync to provider directories? [Y/n]"
6. If yes: copy to `.claude/skills/`, `.opencode/skills/`, `.agents/skills/`

### /tyrex-skills suggest

Analyze the project and suggest skills that should be created:

1. Scan project for:
   - `package.json` → detect JS/TS frameworks (React, React Native, Next.js, Express, NestJS)
   - `Gemfile` → detect Ruby frameworks (Rails, Sinatra, Sidekiq)
   - `requirements.txt` / `pyproject.toml` → detect Python frameworks (Django, FastAPI, Flask)
   - `Podfile` → detect iOS (CocoaPods)
   - `pubspec.yaml` → detect Flutter/Dart
   - `go.mod` → detect Go frameworks
   - `Cargo.toml` → detect Rust
   - `docker-compose.yml` → detect infrastructure patterns
   - CI config files → detect CI/CD patterns
   - Existing test frameworks → detect testing patterns

2. Cross-reference with installed skills

3. Present suggestions:

```
Project Analysis - Suggested Skills
════════════════════════════════════════

  Detected tech stack:
    - TypeScript (tsconfig.json)
    - React Native (react-native in package.json)
    - Express API (express in package.json)
    - Jest (jest in devDependencies)
    - PostgreSQL (pg in dependencies)

  Suggested skills:
    [x] react-native      Mobile UI development patterns
    [x] express-api        Express.js API patterns
    [x] jest-testing       Jest testing patterns and conventions
    [ ] postgresql         Database query and migration patterns

  Already installed:
    typescript             (up to date)

  Create selected skills? [Y/n]
```

4. For each selected skill: run the `create` flow automatically

### /tyrex-skills sync

Synchronize skills across all provider directories:

1. Read all skills from `.tyrex/skills/`
2. For each provider directory that exists:
   - `.claude/skills/` → copy
   - `.opencode/skills/` → copy
   - `.agents/skills/` → copy
3. Also check for provider-specific skills NOT in `.tyrex/skills/`:
   - Offer to import them to canonical location
4. Report what was synced

## SKILL.md Format

```markdown
---
name: skill-name
description: "Concise description of what this skill covers"
---

# [Skill Name] Skill

## Context
[What area/technology this covers. When to use this skill.]

## Patterns
[Coding patterns, conventions, architecture decisions for this area]

## File Structure
[Expected file organization for this area]

## Testing
[How to test code in this context. Frameworks, patterns, what to cover.]

## Common Mistakes
[Things to avoid. Known gotchas.]

## Dependencies
[Key libraries/frameworks and their versions]
```

## Rules
- Skills in `.tyrex/skills/` are the canonical source of truth
- Provider-specific directories are copies/syncs
- Skill names MUST be lowercase, hyphenated, 1-64 chars
- A skill's description should be specific enough for the agent to decide when to load it
- Skills should be concise (under 200 lines) — they're loaded into context, so token efficiency matters
