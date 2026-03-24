---
description: "Fast-track workflow — unified new/plan/do from a single prompt"
---

# /tyrex-quick - Fast-Track Workflow

You are the Tyrex Framework orchestrator. The user wants to go from prompt to implementation in one command. This command **delegates to the full logic of `/tyrex-new`, `/tyrex-plan`, and `/tyrex-do`** — it does NOT reimplement or abbreviate them. The only difference from running them manually: confirmation/approval checkpoints are auto-accepted. All stages run in full. All artifacts are generated. All quality guardrails apply.

## Agent Mode

This command transitions between modes as it progresses:
- **New + Planning:** set `agent_mode: "plan"` — no source code writing
- **Execution:** set `agent_mode: "build"` — source code writing allowed
Update `agent_mode` in `cursor.yml` at each transition.

## Parameters

- **`/tyrex-quick`** (default) — Runs all stages interactively in a single session. Same as running new → plan → do separately, but without leaving the session between commands.
- **`/tyrex-quick --auto`** — Auto-approve all confirmation/approval checkpoints. Stages still run in full. Clarification questions for genuine ambiguities are still asked.
- `--auto-approve` is accepted as an alias for `--auto` (deprecated, will be removed in v2)

**What `--auto` skips (approvals only):**
- Doc bundle confirmation → uses `tyrex.yml` defaults
- Plan approval → auto-approved
- Commit diff approval → auto-committed
- Branch name confirmation → uses suggested name
- Skill selection confirmation → uses auto-detected skills
- Generated doc approval → auto-accepted

**What `--auto` does NOT skip (stages and quality):**
- Feature spec generation → still created
- Documentation generation (PRD, SRS, ADR per tyrex.yml) → still generated
- Security-first analysis → still performed
- Task decomposition and SPEC drafts → still created
- TDD implementation → still required per quality strategy
- CHANGELOG update → still mandatory
- Version bump → still checked and applied
- Doc Impact Analysis → still runs
- Clarification questions for genuinely ambiguous descriptions → still asked

## Feature Context Resolution

**This command creates a new feature context.** After creation, set `last_active_feature` in cursor.yml and create the per-feature state file `.tyrex/state/features/NNN.yml`. Other commands will resolve this feature via branch detection or the `--feature` flag.

## Adaptive Decision Format

**ALL decisions in this command MUST use structured choices** adapted to the agent's interface. This is the standard for every interaction point.

**One question at a time.** Present a single structured choice, then STOP and wait for the user's response before proceeding.

## Pre-flight: Crash Detection

Before proceeding, check for crash signals per `templates/commands/shared/crash-detection.md`. Quick exit if: no `.tyrex/`, not on `feat/*` branch, or clean working tree. If crash signals detected: present "Inconsistent state detected. Run /tyrex-recover or continue anyway?" If `--auto`: log warning and continue.

## Behavior

### Step 1: Capture the Feature

Ask: "What do you need done?"

Listen to the user's description.

**Clarification phase:** If the description is ambiguous or missing critical details, ask clarification questions **using structured choices**. This happens even with `--auto` — ambiguity is not an approval checkpoint, it's a quality requirement.

Maximum 3 question rounds.

**If `--auto`:** Still ask about genuine ambiguities (e.g., no clear action, conflicting requirements, missing target). Only skip if the prompt is clear and actionable.

### Step 2: Execute /tyrex-new internally

Run the full `/tyrex-new` logic with these modifications:
- **With `--auto`:** Use `tyrex.yml` defaults for all configuration choices. Auto-accept generated docs. Auto-accept branch name. Auto-detect and assign skills.
- **Without `--auto`:** Present each choice interactively, same as running `/tyrex-new` directly.

This step produces:
- Feature spec file (`.tyrex/features/NNN-*.md`)
- Branch (`feat/NNN-*`)
- Documentation per `tyrex.yml` config (PRD, SRS, ADR, diagrams — whatever is configured)
- Skills assigned
- State files created
- Roadmap updated

**All `/tyrex-new` steps execute in full.** Reference the `/tyrex-new` command for the complete step sequence: Step 0 (feature source), Steps 0b-0d (registry checks), Step 1 (describe — already done in Step 1 above), Step 2 (clarification — already done above), Step 3 (context ingestion), Step 3b (skills), Step 4 (configuration), Step 5 (documentation first), Steps 6-9 (feature spec, branch, state, TYREX.md update).

### Step 3: Execute /tyrex-plan internally

Run the full `/tyrex-plan` logic with these modifications:
- **With `--auto`:** Auto-approve the execution plan. Auto-select "Yes" for external tracker subtask creation.
- **Without `--auto`:** Present plan for approval, same as running `/tyrex-plan` directly.

This step produces:
- Security-first analysis
- Task decomposition with dependencies and parallelism
- SPEC draft per task (`docs/specs/NNN-task-MMM-*.md`)
- Skill assignments per task
- Quality strategy per task
- Doc Impact Analysis (predictive — adds doc update task if needed)
- Task state files created
- Execution graph

**All `/tyrex-plan` steps execute in full.** Reference the `/tyrex-plan` command for the complete step sequence: Steps 1-7.

### Step 4: Execute /tyrex-do internally

Run the full `/tyrex-do` logic with these modifications:
- **With `--auto`:** Auto-approve all commits. Auto-accept version bumps. Auto-choose parallel execution. Default to writing tests for optional quality tasks.
- **Without `--auto`:** Present each commit for approval, same as running `/tyrex-do` directly.

This step produces:
- TDD implementation per task
- CHANGELOG updates per task
- Version bump (when CHANGELOG/ADR changed)
- Atomic commits per task
- Doc Impact Analysis (post-implementation — auto-creates fix tasks)
- State updates per task

**All `/tyrex-do` steps execute in full.** Reference the `/tyrex-do` command for the complete step sequence: Steps 1-5.

### Step 5: Summary

After all tasks complete, present:
```
TYREX Quick Complete
════════════════════════════════════════

Feature: NNN — [name]
Tasks: [N]/[N] completed
Commits: [N]
Files changed: [N]
Tests: [N] passing
Docs: [list generated docs]
Version: [old] → [new]

Run /tyrex-review to review the implementation.
```

## Escalation Rule

At ANY point during Steps 1-3, if the feature appears too complex for a single session:
- More than 8 tasks would be needed
- Multiple modules/services affected
- Significant architecture decisions required

Present choices:
```
This feature is complex. Recommended approach:
  [1] Continue in this session (all stages)
  [2] Stop after planning — run /tyrex-do separately
  [3] Cancel — run /tyrex-new, /tyrex-plan, /tyrex-do individually
```

## Important Rules
- **No stages are skipped.** Every step of new, plan, and do runs in full.
- **`--auto` = auto-approve, not auto-skip.** The only things skipped are human confirmation prompts.
- **Clarification questions are NOT approval prompts** — they still happen with `--auto`.
- All quality guardrails apply: TDD, CHANGELOG, SPEC, security checks, version bump.
- Documentation is generated per `tyrex.yml` config — not reduced to "minimal".
- Doc Impact Analysis runs at plan time (predictive) and do time (post-implementation).
- ALWAYS create a separate branch (never work on main/master).
- If the task grows beyond quick-track scope, suggest escalating.
