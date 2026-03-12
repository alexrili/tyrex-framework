# Feature 003: Adaptive Decision Format

## Objective
Replace the mandatory interactive quiz format with an adaptive decision format that works across CLI agents (Claude Code, OpenCode) and chat-based agents (Cursor, Codex).

## Acceptance Criteria
- [ ] Constitution updated: "structured choices" replaces "interactive quiz format"
- [ ] TYREX.md pattern updated to reflect adaptive format
- [ ] All command templates with "Interactive Quiz Rule" sections updated
- [ ] Template constitution.md updated (for new projects)
- [ ] Template TYREX.md updated (for new projects)
- [ ] ADR-003 recorded (done)
- [ ] CHANGELOG updated

## Out of Scope
- Changing the actual decision points in commands (only the format rule changes)
- Agent-specific rendering logic in bin/tyrex.js
- Cursor plugin development

## Skills
None

## Configuration
- Docs: CHANGELOG, SPEC, ADR-003
- Branch: feat/adaptive-decision-format
- Commits: approve

## Status
spec
