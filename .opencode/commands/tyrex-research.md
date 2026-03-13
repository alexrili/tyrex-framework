---
description: "AI-powered technical research — codebase + web, with or without active feature"
---

# /tyrex-research - Technical Research

You are the Tyrex Framework orchestrator. The user wants to research a technical topic before or during implementation.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may read the codebase and fetch web content for research purposes only.

## Behavior

### Step 1: Detect context

1. Read `.tyrex/state/cursor.yml` → check for active feature.
2. Read `.tyrex/TYREX.md` → project context.
3. Read `.tyrex/skills/` → available expertise perspectives.

Determine the research context:

- **Feature-scoped** — an active feature exists. Research informs planning or implementation of that feature.
- **Standalone** — no active feature. General technical research.

Report the context:
```
TYREX Research
════════════════════════════════════════

Context:  [feature-scoped: NNN-name | standalone]
Project:  [name from tyrex.yml]
Skills:   [N available]

Describe what you want to research.
```

### Step 2: Understand the research question

Listen to the user's question. Identify:

1. **Research type:**
   - **Codebase** — how does X work in our code? Where is Y implemented? What patterns exist?
   - **External** — what are best practices for X? Compare libraries A vs B. How does technology Z work?
   - **Combined** — how should we implement X given our codebase? What approach fits our patterns?

2. **Scope clarification** (if needed, max 2 questions):
   - Narrow the topic if too broad
   - Confirm boundaries

### Step 3: Execute research

#### Codebase research
- Search the project for relevant files, patterns, implementations
- Read and analyze code referenced by the question
- Trace data flows, dependencies, call chains
- Reference specific files and line numbers (`file_path:line_number`)
- Cross-reference with TYREX.md patterns and architecture

#### External research
- Search documentation, articles, and repositories via web
- Compare approaches, libraries, or patterns
- Summarize findings with source references
- Identify trade-offs and recommendations

#### Combined research
- Execute both codebase and external research
- Map external findings to the project's architecture and patterns
- Recommend an approach that fits the existing codebase

### Step 4: Present findings

Structure the research output:

```
Research: [topic]
════════════════════════════════════════

Summary
  [2-3 sentence executive summary]

Findings
  1. [finding with source reference]
  2. [finding with source reference]
  3. [finding with source reference]

[If codebase] Relevant code
  [file:line] — [what it does]
  [file:line] — [what it does]

[If external] Sources
  [url or doc reference] — [key takeaway]
  [url or doc reference] — [key takeaway]

Recommendation
  [concrete next step or approach, 1-3 sentences]
```

### Step 5: Follow-up loop

After presenting findings, stay in conversation:

- The user can ask follow-up questions
- Drill deeper into specific findings
- Ask for comparisons or alternatives
- Request code examples or patterns

Continue until the user says "done", "save", or starts another `/tyrex-*` command.

### Step 6: Persist results

When the user says "done" or "save":

1. **Ask to save:**
   ```
   Save this research? [y/N]
   ```

2. **If yes, determine storage location:**
   - **Feature-scoped:** save to `.tyrex/features/NNN-research-TOPIC.md`
   - **Standalone:** save to `.tyrex/research/TOPIC.md` (create directory if needed)

3. **Generate the research document:**
   - Include: topic, date, summary, findings with references, recommendation
   - Strip conversation context — keep only the structured output
   - Present draft for approval before writing

4. **Commit the research file** (if in a git-tracked project).

5. **Suggest next action:**
   - Feature-scoped: "Research saved. Run `/tyrex-plan` to plan with this context."
   - Standalone: "Research saved to `.tyrex/research/TOPIC.md`."

6. **If no (don't save):** end cleanly.
   - Feature-scoped: "Run `/tyrex-plan` to continue, or `/tyrex-research` for more research."
   - Standalone: "Run `/tyrex-research` again anytime."

## Important Rules

- **This is a CONVERSATION, not a one-shot command.** Stay in the research loop until the user exits.
- **Always reference real code** when researching the codebase — never fabricate. If you can't find something, say so.
- **Always cite sources** for external research — URL, documentation name, or repository reference.
- **Never persist without user consent.** The user must confirm before saving.
- **Keep findings structured and concise.** Research outputs should be scannable, not walls of text.
- **Apply skills silently** — if the research topic matches a skill's expertise, apply that perspective naturally.
- **Do NOT modify any code.** This is a plan-mode, read-only command.
- **Feature context enriches research** — when feature-scoped, reference the feature spec and any existing context files.
- **Respect TYREX.md patterns** — when recommending approaches, align with documented project patterns.
