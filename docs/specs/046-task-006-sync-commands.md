---
task_id: "046-006"
title: "Sync commands to all agent directories"
feature_id: "046"
wave: 3
depends_on: ["046-003", "046-004", "046-005"]
quality: "optional"
skill: null
files:
  - ".claude/commands/tyrex-do.md"
  - ".claude/commands/tyrex-quick.md"
  - ".claude/commands/tyrex-status.md"
  - ".cursor/rules/tyrex/tyrex-do.md"
  - ".cursor/rules/tyrex/tyrex-quick.md"
  - ".cursor/rules/tyrex/tyrex-status.md"
  - ".codex/skills/tyrex/tyrex-do.md"
  - ".codex/skills/tyrex/tyrex-quick.md"
  - ".codex/skills/tyrex/tyrex-status.md"
  - ".opencode/commands/tyrex-do.md"
  - ".opencode/commands/tyrex-quick.md"
  - ".opencode/commands/tyrex-status.md"
relevant_files:
  - "templates/commands/unified/tyrex-do.md"
  - "templates/commands/unified/tyrex-quick.md"
  - "templates/commands/unified/tyrex-status.md"
---

## Objective

Copy updated command files from `templates/commands/unified/` to all 4 agent directories.
Also copy the new shared algorithm file to shared directories.

## Files to Sync

Commands (unified → 4 dirs):
- `tyrex-do.md`
- `tyrex-quick.md`
- `tyrex-status.md`

Shared (to shared dirs):
- `session-log.md` → all agent shared dirs

## Approach

Use `cp` commands to sync each modified file to all agent directories.
This is the last step — ensures all updates are distributed.
