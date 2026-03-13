---
description: "Show available commands, workflow guide, and contextual suggestions"
---

# /tyrex-help - Command Reference & Workflow Guide

You are the Tyrex Framework orchestrator. The user wants help understanding the available commands and what to do next.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write or modify any files. Read-only information display only.

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

  Core Workflow:
    /tyrex-init       Initialize Tyrex in a project (map codebase, configure)
    /tyrex-new        Start a new feature (structured choices)
    /tyrex-plan       Plan tasks with security-first approach
    /tyrex-do         Execute tasks [--auto-approve]
    /tyrex-review     Senior code review with 4 lenses [--do-all | --do-critical] [full]

  Exploration:
    /tyrex-discuss    Explore the project, ask questions, brainstorm architecture

  Fast Track:
    /tyrex-quick      Unified new→plan→do from a single prompt [--auto-approve]

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

  Deprecated:
    /tyrex-handoff    → Use /tyrex-quick --auto-approve instead
```

#### Step 3: Show workflow diagram

```
  Typical workflow:

    /tyrex-init → /tyrex-new → /tyrex-plan → /tyrex-do → /tyrex-review
                  (choices)    (security)    [--auto]     (4 lenses)
                                                ↑              │
                                                └── fix tasks ─┘

  Fast track (from single prompt):
    /tyrex-quick [--auto-approve]
      = /tyrex-new + /tyrex-plan + /tyrex-do in one command

  Review with auto-fix:
    /tyrex-review --do-all       (fix everything)
    /tyrex-review --do-critical  (fix only HIGH/CRITICAL)

  Exploration (anytime):
    /tyrex-discuss  (explore the project, ask questions at any point)
```

#### Step 4: Contextual suggestion

Based on the current state, suggest the next action. Use EXACTLY ONE of these:

- **No `.tyrex/` directory exists:**
  > "You haven't initialized Tyrex in this project yet. Run `tyrex init` in your terminal to create the project structure, then `/tyrex-init` to map your codebase."

- **`.tyrex/` exists but no active feature (or last feature is `done`):**
  > "Tyrex is initialized. Use `/tyrex-new` to start a new feature, or `/tyrex-quick` for a fast-track task."

- **Active feature with status `spec` (no plan yet):**
  > "You have a feature spec ready. Run `/tyrex-plan` to plan the implementation tasks."

- **Active feature with status `planned` (plan approved, no tasks started):**
  > "Your plan is approved. Run `/tyrex-do` to start implementing, or `/tyrex-do --auto-approve` for autopilot."

- **Active feature with tasks `in_progress` or `pending`:**
  > "You have tasks in progress. Run `/tyrex-do` to continue, or `/tyrex-resume` if this is a new session."

- **Active feature with ALL tasks `completed`:**
  > "All tasks are done! Run `/tyrex-review` to review, or `/tyrex-review --do-all` to review and auto-fix."

- **Unable to read session state.:**
  > "Run `/tyrex-status` to view current state, or `/tyrex-init` to start fresh."

---

### With argument: `/tyrex-help <command>`

The user wants detailed help for a specific command. The argument can be in any format:
- `/tyrex-help plan`
- `/tyrex-help tyrex-plan`
- `/tyrex-help /tyrex-plan`

All resolve to the same command.

#### Step 1: Identify the command

Strip any `/tyrex-` or `tyrex-` prefix from the argument. Match against the known commands:
`init`, `new`, `plan`, `do`, `review`, `quick`, `status`, `resume`, `settings`, `evolve`, `skills`, `context`, `discuss`, `readme`, `openapi`, `wiki`, `help`

Also match deprecated: `handoff` → redirect to `quick`.

If no match: show "Command not found" and list all available commands.

#### Step 2: Present humanized summary

For the matched command, present a structured summary:

```
/tyrex-[command] — [title]
═══════════════════════════════════════

  What it does:
    [1-2 sentence description of purpose]

  Flags:
    [list of flags and their effects, or "None"]

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
- What: Maps your codebase, detects stack/architecture/security issues, and generates TYREX.md. Requires `tyrex init` (CLI) to have been run first to create the `.tyrex/` project structure.
- Flags: None
- When: First time using Tyrex in a project, or re-initializing after major changes.
- Steps: Check `.tyrex/` exists → Codebase analysis → Generate TYREX.md + constitution → Interactive config → Summary
- Prerequisites: `tyrex init` (CLI command) must be run first to create project structure
- Next: `/tyrex-new`

**discuss:**
- What: Interactive exploration and technical discussion. In codebase mode, answers questions about existing code with file references. In greenfield mode, brainstorms architecture, stack, and scope. Loads relevant skills as perspective automatically.
- Flags: None
- When: You're new to a project and want to understand it, or starting from scratch and want to brainstorm before building. Can be used anytime for Q&A.
- Steps: Detect mode (codebase/greenfield/hybrid) → Load skills → Multi-turn conversation → Save conclusions on demand (user-initiated only)
- Prerequisites: `.tyrex/` initialized (recommended but not required for basic Q&A)
- Next: `/tyrex-new` (to act on what was discussed) or `/tyrex-evolve` (to record decisions)

**new:**
- What: Starts a new feature. All decisions use structured choices adapted to the agent's interface. Checks the roadmap, captures requirements, analyzes required skills (including DevSec), configures docs/git, generates feature spec, and updates TYREX.md.
- Flags: None
- When: You have something to build and want to go through the full workflow.
- Steps: Check roadmap (choices) → Describe feature → Clarification (choices) → Context ingestion (choices) → Skill analysis with DevSec check (choices) → Config docs/git (choices) → Generate docs first → Create feature spec → Create branch → Update TYREX.md
- Prerequisites: `.tyrex/` initialized (`/tyrex-init`)
- Next: `/tyrex-plan`

**plan:**
- What: Breaks the feature into tasks with dependencies, parallelism, skill assignments, quality strategy, and security-first analysis. Every task gets a SPEC draft. Security-sensitive tasks get the devsec skill auto-assigned.
- Flags: None
- When: After creating a feature spec with `/tyrex-new`.
- Steps: Load context → Security-first analysis → Propose tasks with security attributes → Generate SPECs → Show execution graph → Human approval (choices) → Save plan
- Prerequisites: Active feature in `spec` status
- Next: `/tyrex-do`

**do:**
- What: Executes tasks from the plan. Handles TDD, parallelization, commits, and state updates. Auto-updates TYREX.md when macro docs are generated.
- Flags: `--auto-approve` (skip ALL human checkpoints, full autopilot)
- When: After the plan is approved with `/tyrex-plan`.
- Steps: Load state → Find ready tasks → Parallelization (choices or auto) → Execute with TDD → Commit (choices or auto) → Update state + TYREX.md → Repeat
- Prerequisites: Active feature with approved plan
- Next: `/tyrex-review` (when all tasks done)

**review:**
- What: Senior code review through 4 lenses: Pattern Compliance, Code Quality & DRY, Business & Technical Compliance, Security First. Can auto-create fix tasks and enter the plan/do loop.
- Flags: `--do-all` (fix all findings), `--do-critical` (fix HIGH/CRITICAL only), `full` (codebase-wide review instead of branch diff)
- When: All implementation tasks are complete.
- Steps: Automated checks → 4-lens review → TYREX.md evolution → Present findings (choices) → Requested changes loop (if needed) → Finalize
- Prerequisites: All tasks in active feature completed
- Next: `/tyrex-new` (next feature) or done

**quick:**
- What: Fast-track workflow — unified new/plan/do from a single prompt. Same quality guardrails, fewer steps. All decisions via structured choices.
- Flags: `--auto-approve` (full autopilot from prompt to implementation)
- When: Bug fixes, config tweaks, small features — anything that doesn't need extensive ceremony but still needs quality.
- Steps: Capture feature (choices) → Quick config (choices) → Skill + security check → Quick plan (choices) → Execute (same as /tyrex-do) → Update TYREX.md
- Prerequisites: `.tyrex/` initialized
- Next: `/tyrex-review` (optional) or done

**status:**
- What: Shows a comprehensive dashboard: features, active tasks, project roadmap, health diagnostics, documentation coverage, and actionable suggestions.
- Flags: None
- When: You want a full overview of where things stand.
- Steps: Read state + roadmap + health checks → Display comprehensive summary
- Prerequisites: `.tyrex/` initialized
- Next: Whatever the status suggests

**resume:**
- What: Recovers session state from cursor.yml with minimal token usage. Picks up where you left off.
- Flags: None
- When: Starting a new agent session and wanting to continue previous work.
- Steps: Read cursor.yml → Show resume summary → Continue from last state
- Prerequisites: Previous Tyrex session with state saved
- Next: Continues automatically (usually `/tyrex-do`)

**settings:**
- What: Shows and lets you modify Tyrex configuration (commit mode, branch mode, docs, quality, parallelism, git).
- Flags: None
- When: You want to change how Tyrex behaves.
- Steps: Display current settings → Ask what to change (choices) → Save
- Prerequisites: `.tyrex/tyrex.yml` exists
- Next: Changes apply from next feature onward

**evolve:**
- What: Updates TYREX.md with new patterns, hurdles, architecture decisions, or context discovered during work.
- Flags: None
- When: You learned something about the project that future sessions should know.
- Steps: Describe discovery → Update TYREX.md → Commit
- Prerequisites: `.tyrex/TYREX.md` exists
- Next: Nothing specific

**skills:**
- What: Manages reusable skills — persona-based agent contexts. Can list, create, and sync skills. DevSec skill is available as a built-in template.
- Flags: `create [name]`, `sync`
- When: You want to improve implementation quality by giving agents specialized perspectives.
- Steps: (list) Scan `.tyrex/skills/` + providers → Display. (create) Gather role/expertise/guidelines (choices) → Generate skill file. (sync) Copy to all providers.
- Prerequisites: `.tyrex/` initialized
- Next: Skills are automatically loaded during `/tyrex-do` when assigned to tasks

**context:**
- What: Ingests and manages project context (business rules, legacy system constraints, external docs) for better AI decisions.
- Flags: None
- When: After `/tyrex-init` to add project background, during `/tyrex-new` for feature-specific context, or anytime.
- Steps: Show existing context → Choose scope (choices) → Choose input type (choices) → Process and save → Confirm
- Prerequisites: `.tyrex/` initialized (`/tyrex-init`)
- Next: Context is automatically read by `/tyrex-plan` and `/tyrex-do`

**readme:**
- What: Generates a comprehensive README.md with architecture diagrams, setup instructions, and API overview.
- Flags: None
- When: Your project needs a README, or the existing one is outdated.
- Steps: Deep project analysis → Generate README → Handle existing (choices) → Commit
- Prerequisites: A project with code to document
- Next: Nothing specific

**openapi:**
- What: Analyzes your API endpoints and generates OpenAPI 3.1 documentation WITHOUT modifying source code.
- Flags: None
- When: Your project has an API and you need documentation for it.
- Steps: Detect framework → Map endpoints (read-only) → Generate openapi.yaml + readable docs → Commit
- Prerequisites: A project with HTTP endpoints
- Next: Nothing specific

**wiki:**
- What: Generates wiki-style documentation pages in docs/wiki/ covering architecture, getting started, domain areas, deployment, and troubleshooting.
- Flags: None
- When: You need internal documentation for the team.
- Steps: Project analysis → Propose wiki structure (choices) → Generate pages → Handle existing (choices) → Commit
- Prerequisites: A project with code to document
- Next: Nothing specific

**handoff (DEPRECATED):**
- What: Replaced by `/tyrex-quick --auto-approve`. See migration guide in the command file.
- When: Never — use `/tyrex-quick --auto-approve` instead.

**help:**
- What: This command. Shows all available commands and suggests what to do next.
- Flags: `<command-name>` for detailed help
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
- ALWAYS mention flags for commands that have them — this is a key differentiator
