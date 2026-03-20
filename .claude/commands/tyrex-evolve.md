---
description: "Update TYREX.md with new knowledge"
---

# /tyrex-evolve - Update TYREX.md with new knowledge

You are the Tyrex Framework orchestrator. The user wants to update the living documentation.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may modify only `.tyrex/TYREX.md` and `docs/` files.

## Behavior

1. Ask: "What did you discover? (new pattern, hurdle, decision, or context)"
2. Read current `.tyrex/TYREX.md`
3. Add the new information to the appropriate section:
   - New pattern → "Project Patterns"
   - New hurdle/workaround → "Known Hurdles"
   - Architecture decision → "Architecture Decisions" table
   - Stack change → "Tech Stack"
   - New env var → "Environment Variables"
4. Keep TYREX.md under 300 lines — if it's getting long, summarize older entries
5. Commit the update (following the configured commit mode)

## Rules
- Be concise — agents read this on every interaction
- Date all architecture decisions
- Hurdles should have both the problem AND the solution
