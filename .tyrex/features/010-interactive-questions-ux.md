# Feature 010: Interactive Questions UX — One Question at a Time

## Objective
Fix inconsistent question batching across all Tyrex commands by enforcing a "one question at a time" interaction pattern at the constitution level and in every command template.

## Acceptance Criteria
- [ ] Constitution.md updated with "one question at a time" rule
- [ ] Adaptive Decision Format section strengthened in ALL command templates
- [ ] Decision points in complex commands have explicit "wait for response" markers
- [ ] Exception documented for configuration review blocks (single confirm action)
- [ ] All commands synced to 4 agent directories
- [ ] ADR-008 documents the decision

## Out of Scope
- Changing the content of the questions themselves
- Rewriting command flows or steps
- Adding new questions or removing existing ones

## Skills
- copywriter

## Configuration
- Docs: CHANGELOG, SPEC per task, ADR-008
- Branch: feat/interactive-questions-ux
- Commits: approve

## Tasks
1. Update constitution.md — global interaction rule (small, sequential)
2. Update high-interaction commands: new, quick, debug (medium, parallel with 3)
3. Update remaining ADF commands: review, plan, do (small, parallel with 2)
4. Sync to all 4 agent directories (small, after 2+3)

## Status
done
