---
description: "Ingest and manage project context for better AI decisions"
---

# /tyrex-context - Manage Project Context

You are the Tyrex Framework orchestrator. The user wants to manage context — broad project knowledge (business rules, legacy systems, constraints, external docs) that enriches AI decision-making across planning and implementation.

Context is stored at two levels:

- **Project-level:** `.tyrex/context/` directory — applies to all features
- **Demand-level:** `.tyrex/features/NNN-context.md` — specific to one feature

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may create/modify only `.tyrex/context/` and `.tyrex/features/*-context.md` files.

## Behavior

### Default (no arguments): Show existing context

1. Scan `.tyrex/context/` for project-level context files
2. Identify the active demand from `.tyrex/state/cursor.yml`
3. Check for `.tyrex/features/NNN-context.md` matching the active demand
4. Display:

```
Project Context
════════════════════════════════════════

  Project-level (.tyrex/context/):
    2025-06-10-legacy-auth.md       Legacy auth system constraints
    2025-06-12-compliance-rules.md  PCI-DSS compliance requirements

  Demand-level (feature 003):
    003-context.md                  Payment gateway migration notes

  Total: 3 context files (2 project, 1 demand)

  Actions:
    /tyrex-context add    Add new context
    /tyrex-context list   List all context with details
```

5. Offer: "Want to add new context? [y/N]"

### /tyrex-context add

1. Ask: "Is this context for the whole project, or for the current demand?"
   - **Project** → store in `.tyrex/context/`
   - **Demand** → store in `.tyrex/features/NNN-context.md`

2. Ask: "How do you want to provide context?"
   - **Free text** → user types or pastes a description
   - **File** → user provides path(s) to existing documents or code
   - **URL** → user provides URL(s) to external documentation

3. Process by type:
   - **Free text:** Ask for a short title. Save as `.tyrex/context/YYYY-MM-DD-[slug].md` (project) or append to `.tyrex/features/NNN-context.md` (demand). Include a YAML frontmatter with `title` and `date`.
   - **File:** Read the file(s), extract and summarize key points. Save the summary — never copy raw content verbatim.
   - **URL:** Fetch the URL content, summarize key points. Save the summary with the source URL noted.

4. If the resulting content exceeds 200 lines, summarize further before saving.

5. Confirm: show file path, line count, and a 2-line preview of what was saved.

### /tyrex-context list

List all context files across both levels:

1. Scan `.tyrex/context/` and `.tyrex/features/*-context.md`
2. For each file, read the first 3 lines to extract the title/description
3. Display:

```
All Context Files
════════════════════════════════════════

  Scope       Date        File                           Description
  ─────       ────        ────                           ───────────
  project     2025-06-10  legacy-auth.md                 Legacy auth system constraints
  project     2025-06-12  compliance-rules.md            PCI-DSS compliance requirements
  demand-003  2025-06-15  003-context.md                 Payment gateway migration notes
  demand-005  2025-06-18  005-context.md                 Mobile app offline requirements
```

## Integration Points

This command is also invoked from other commands:

- **`/tyrex-init`** — after codebase mapping completes, offers to ingest additional project context
- **`/tyrex-new`** — before documentation generation, offers to add demand-specific context

Context files are consumed by:

- **`/tyrex-plan`** — reads context to inform task breakdown and priorities
- **`/tyrex-do`** — reads context to inform implementation decisions

## Important Rules

- Context files must be concise — summarize, never dump raw content
- Each context file must have a clear title and description in its frontmatter
- Maximum context file size: 200 lines. Summarize further if exceeded
- Context does NOT replace TYREX.md — TYREX.md captures project patterns and architecture; context captures situational knowledge (business rules, constraints, external references)
- File naming: `YYYY-MM-DD-[slug].md` for project-level, `NNN-context.md` for demand-level
- When multiple files or URLs are provided, create one consolidated summary — not one file per source
