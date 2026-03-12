# SPEC: Task 005 — Re-sync to Agent Directories

## Feature
Feature 004: Documentation System

## Objective
Copy all updated command templates to the 4 agent directories.

## Technical Approach
Copy each updated .md from `templates/commands/unified/` to:
- `.claude/commands/`
- `.opencode/commands/`
- `.cursor/rules/tyrex/`
- `.codex/skills/tyrex/`

Verify zero Mermaid references remain in agent directories.

## Files Affected
- `.claude/commands/tyrex-{new,readme,wiki,review,settings}.md`
- `.opencode/commands/tyrex-{new,readme,wiki,review,settings}.md`
- `.cursor/rules/tyrex/tyrex-{new,readme,wiki,review,settings}.md`
- `.codex/skills/tyrex/tyrex-{new,readme,wiki,review,settings}.md`

## Testing Strategy
Quality: optional — grep for "mermaid" across all agent dirs to confirm zero matches.
