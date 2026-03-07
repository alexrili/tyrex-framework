---
description: "Show available commands, workflow guide, and contextual suggestions"
---

# /tyrex-help - Command Reference & Workflow Guide

You are the Tyrex Framework orchestrator. The user wants help understanding the available commands and what to do next.

## Behavior

### Without arguments: `/tyrex-help`

#### Step 1: Read state (if available)

Try to read `.tyrex/state/cursor.yml`. If it exists, note:
- Whether there's an active feature
- The last action performed
- Current task progress

If `.tyrex/` doesn't exist, that's fine — the user hasn't initialized yet.

#### Step 2: Display command reference

Show ALL commands grouped by category:

```
TYREX Help
═══════════════════════════════════════

  Workflow principal:
    /tyrex-init       Initialize Tyrex in a project (map codebase, configure)
    /tyrex-new        Start a new feature/demand
    /tyrex-plan       Plan tasks with dependencies and parallelism
    /tyrex-do         Execute implementation tasks
    /tyrex-review     Review implementation, finalize docs

  Shortcuts:
    /tyrex-quick      Quick task without full ceremony (bug fix, tweak)
    /tyrex-handoff    Autopilot — chains new→plan→do→review automatically

  Management:
    /tyrex-status     Show current project and feature status
    /tyrex-resume     Resume from last session (fast recovery)
    /tyrex-settings   View/modify Tyrex configuration
    /tyrex-evolve     Update TYREX.md with new patterns/knowledge

  Skills & Documentation:
    /tyrex-skills     Manage reusable skills (list, create, suggest, sync)
    /tyrex-context    Ingest and manage project context
    /tyrex-readme     Generate/update project README.md
    /tyrex-openapi    Generate OpenAPI docs from code (read-only)
    /tyrex-wiki       Generate/update project wiki pages

  Meta:
    /tyrex-help       This command. Use /tyrex-help <command> for details.
```

#### Step 3: Show workflow diagram

```
  Typical workflow:

    /tyrex-init → /tyrex-new → /tyrex-plan → /tyrex-do → /tyrex-review
                                     ↑                         │
                                     └─── fix tasks ───────────┘

  Fast mode:
    /tyrex-handoff  (runs the entire workflow, stops at checkpoints)

  Quick fix:
    /tyrex-quick    (skip spec/plan, just fix and commit)
```

#### Step 4: Contextual suggestion

Based on the current state, suggest the next action. Use EXACTLY ONE of these:

- **No `.tyrex/` directory exists:**
  > "You haven't initialized Tyrex yet. Start with `/tyrex-init` to map your project and configure the framework."

- **`.tyrex/` exists but no active feature (or last feature is `done`):**
  > "Tyrex is initialized. Use `/tyrex-new` to start a new feature, or `/tyrex-handoff` for autopilot mode."

- **Active feature with status `spec` (no plan yet):**
  > "You have a feature spec ready. Run `/tyrex-plan` to plan the implementation tasks."

- **Active feature with status `planned` (plan approved, no tasks started):**
  > "Your plan is approved. Run `/tyrex-do` to start implementing."

- **Active feature with tasks `in_progress` or `pending`:**
  > "You have tasks in progress. Run `/tyrex-do` to continue, or `/tyrex-resume` if this is a new session."

- **Active feature with ALL tasks `completed`:**
  > "All tasks are done! Run `/tyrex-review` to review the implementation."

- **Cannot determine state (cursor.yml missing or corrupted):**
  > "Run `/tyrex-status` to see where things stand, or `/tyrex-init` to start fresh."

---

### With argument: `/tyrex-help <command>`

The user wants detailed help for a specific command. The argument can be in any format:
- `/tyrex-help plan`
- `/tyrex-help tyrex-plan`
- `/tyrex-help /tyrex-plan`

All resolve to the same command.

#### Step 1: Identify the command

Strip any `/tyrex-` or `tyrex-` prefix from the argument. Match against the known commands:
`init`, `new`, `plan`, `do`, `review`, `quick`, `handoff`, `status`, `resume`, `settings`, `evolve`, `skills`, `context`, `readme`, `openapi`, `wiki`, `help`

If no match: show "Command not found" and list all available commands.

#### Step 2: Present humanized summary

For the matched command, present a structured summary:

```
/tyrex-[command] — [title]
═══════════════════════════════════════

  What it does:
    [1-2 sentence description of purpose]

  When to use:
    [Context — when should the user reach for this command]

  What to expect:
    1. [Step 1 summary]
    2. [Step 2 summary]
    3. [Step 3 summary]
    ...

  Prerequisites:
    [What needs to exist before running this command, or "None"]

  Next step:
    [What to do after this command completes]
```

Use the reference below for each command:

#### Command Details

**init:**
- What: Maps your codebase, detects stack/architecture/security issues, configures Tyrex.
- When: First time using Tyrex in a project, or re-initializing after major changes.
- Steps: Codebase analysis → Generate TYREX.md + constitution → Interactive config → Summary
- Prerequisites: None (this is the starting point)
- Next: `/tyrex-new`

**new:**
- What: Starts a new feature/demand. Captures requirements, analyzes required skills, configures docs/git, generates feature spec. Supports documentation types: ADR, RFC, Wiki, SPEC, SRS, PRD.
- When: You have something to build and want to go through the full workflow.
- Steps: Describe demand → Clarification questions → Context ingestion → Skill analysis & suggestion → Config (docs, branch, commits) → Generate docs first → Create feature spec → Create branch
- Prerequisites: `.tyrex/` initialized (`/tyrex-init`)
- Next: `/tyrex-plan`

**plan:**
- What: Breaks the feature into executable tasks with dependencies, parallelism, skill assignments, and quality strategy.
- When: After creating a feature spec with `/tyrex-new`.
- Steps: Load feature → Propose tasks → Show execution graph → Human approval → Save plan
- Prerequisites: Active feature in `spec` status
- Next: `/tyrex-do`

**do:**
- What: Executes tasks from the plan. Handles TDD, parallelization, commits, and state updates.
- When: After the plan is approved with `/tyrex-plan`.
- Steps: Load state → Find ready tasks → Ask about parallelization → Execute with TDD → Commit → Update state → Repeat
- Prerequisites: Active feature with approved plan
- Next: `/tyrex-review` (when all tasks done)

**review:**
- What: Reviews the completed implementation against acceptance criteria, checks quality, finalizes docs.
- When: All implementation tasks are complete.
- Steps: Automated checks → Code review → Documentation finalization → TYREX.md evolution → Human approval
- Prerequisites: All tasks in active feature completed
- Next: `/tyrex-new` (next feature) or `/tyrex-status`

**quick:**
- What: Handles a small task without the full spec/plan ceremony. Still requires tests and CHANGELOG.
- When: Bug fixes, config tweaks, small changes that don't need a feature spec.
- Steps: Describe task → Implement with TDD → Commit
- Prerequisites: `.tyrex/` initialized
- Next: Nothing specific — back to normal flow

**handoff:**
- What: Deterministic autopilot. Chains the entire workflow (new→plan→do→review) automatically, stopping only at defined checkpoints for human decisions.
- When: You want to describe what to build and let Tyrex drive the entire process.
- Steps: Context load → Demand capture [CHECKPOINT] → Config [CHECKPOINT] → Planning [CHECKPOINT] → Execution (with checkpoints per parallel decision and commit approval) → Review [CHECKPOINT]
- Prerequisites: `.tyrex/` initialized
- Next: Nothing — it runs the full cycle

**status:**
- What: Shows a dashboard of the project state: features, tasks, progress, and suggested next actions.
- When: You want a quick overview of where things stand.
- Steps: Read state → Display summary
- Prerequisites: `.tyrex/` initialized
- Next: Whatever the status suggests

**resume:**
- What: Recovers session state from cursor.yml with minimal token usage. Picks up where you left off.
- When: Starting a new agent session and wanting to continue previous work.
- Steps: Read cursor.yml → Show resume summary → Continue from last state
- Prerequisites: Previous Tyrex session with state saved
- Next: Continues automatically (usually `/tyrex-do`)

**settings:**
- What: Shows and lets you modify Tyrex configuration (commit mode, branch mode, docs, quality, parallelism, git).
- When: You want to change how Tyrex behaves.
- Steps: Display current settings → Ask what to change → Save
- Prerequisites: `.tyrex/tyrex.yml` exists
- Next: Changes apply from next demand onward

**evolve:**
- What: Updates TYREX.md with new patterns, hurdles, architecture decisions, or context discovered during work.
- When: You learned something about the project that future sessions should know.
- Steps: Describe discovery → Update TYREX.md → Commit
- Prerequisites: `.tyrex/TYREX.md` exists
- Next: Nothing specific

**skills:**
- What: Manages reusable skills — persona-based agent contexts (Role, Expertise, Guidelines, Patterns, Review Criteria). Can list, create, and sync skills across providers.
- When: You want to improve implementation quality by giving agents specialized perspectives. Also auto-suggested during `/tyrex-new`.
- Steps: (list) Scan `.tyrex/skills/` + providers → Display. (create) Gather role/expertise/guidelines → Generate skill file. (sync) Copy to all providers.
- Prerequisites: `.tyrex/` initialized
- Next: Skills are automatically loaded during `/tyrex-do` when assigned to tasks

**context:**
- What: Ingests and manages project context (business rules, legacy system constraints, external docs) for better AI decisions. Supports free text, file paths, and URLs.
- When: After `/tyrex-init` to add project background, during `/tyrex-new` for demand-specific context, or anytime you have new context to add.
- Steps: Show existing context → Choose scope (project/demand) → Choose input type (text/file/URL) → Process and save → Confirm
- Prerequisites: `.tyrex/` initialized (`/tyrex-init`)
- Next: Context is automatically read by `/tyrex-plan` and `/tyrex-do`

**readme:**
- What: Generates a comprehensive README.md with architecture diagrams, setup instructions, and API overview.
- When: Your project needs a README, or the existing one is outdated.
- Steps: Deep project analysis → Generate README → Handle existing (replace/merge) → Commit
- Prerequisites: A project with code to document
- Next: Nothing specific

**openapi:**
- What: Analyzes your API endpoints and generates OpenAPI 3.1 documentation WITHOUT modifying source code.
- When: Your project has an API and you need documentation for it.
- Steps: Detect framework → Map endpoints (read-only) → Generate openapi.yaml + readable docs → Commit
- Prerequisites: A project with HTTP endpoints
- Next: Nothing specific

**wiki:**
- What: Generates wiki-style documentation pages in docs/wiki/ covering architecture, getting started, domain areas, deployment, and troubleshooting.
- When: You need internal documentation for the team.
- Steps: Project analysis → Propose wiki structure → Generate pages → Handle existing → Commit
- Prerequisites: A project with code to document
- Next: Nothing specific

**help:**
- What: This command. Shows all available commands and suggests what to do next.
- When: You're not sure what command to use.
- Steps: Display command list → Show workflow → Suggest next action
- Prerequisites: None
- Next: Whatever is suggested

## Rules
- Keep the output concise and scannable — this is a help screen, not a manual
- ALWAYS include the contextual suggestion (Step 4) — this is the most valuable part
- When showing details for a specific command, do NOT dump the entire command file — summarize for humans
- The workflow diagram should be ASCII-compatible (no special Unicode beyond box-drawing)
- If the user asks `/tyrex-help` with a command that doesn't exist, be helpful: suggest the closest match
