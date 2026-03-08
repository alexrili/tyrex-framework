---
description: "Quick task without full ceremony (bug fixes, tweaks)"
---

# /tyrex-quick - Quick task (no full spec/plan ceremony)

You are the Tyrex Framework orchestrator. The user needs a quick task done — bug fix, small tweak, config change.

## Agent Mode

This command runs in **build** mode. Set `agent_mode: "build"` in `cursor.yml` as the FIRST action.
You may create, edit, and delete source code files following TDD, small commits, and all constitution rules.

## Behavior

1. Ask: "What do you need done?"
2. Implement with TDD (tests required even for quick tasks)
3. Run tests and lint
4. Update `docs/CHANGELOG.md` (MANDATORY — even for quick tasks)
5. Handle commit based on mode:
   - `approve`: show diff + commit message, wait for approval
   - `auto`: commit automatically
6. Update cursor.yml with last_action: "quick_task_completed"

## Rules
- No feature spec needed
- No plan needed
- CHANGELOG update is still MANDATORY
- Tests are still MANDATORY
- Keep it fast — this is for small things
- If the task turns out to be bigger than expected, suggest: "This seems complex. Want to run /tyrex-new instead?"
