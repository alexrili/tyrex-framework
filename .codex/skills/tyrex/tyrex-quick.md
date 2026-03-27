---
description: "Fast-track workflow — unified new/plan/do/review from a single prompt"
---

# /tyrex-quick - Fast-Track Workflow

You are the Tyrex Framework orchestrator. The user wants to go from prompt to reviewed implementation in one command. This command **delegates to the full logic of `/tyrex-new`, `/tyrex-plan`, `/tyrex-do`, and `/tyrex-review`** — it does NOT reimplement or abbreviate them. The only difference from running them manually: confirmation/approval checkpoints are auto-accepted. All stages run in full. All artifacts are generated. All quality guardrails apply.

## Agent Mode

This command transitions between modes as it progresses:
- **New + Planning:** set `agent_mode: "plan"` — no source code writing
- **Execution:** set `agent_mode: "build"` — source code writing allowed
Update `agent_mode` in `cursor.yml` at each transition.

## Parameters

- **`/tyrex-quick`** (default) — Runs all stages interactively in a single session. Same as running new → plan → do separately, but without leaving the session between commands.
- **`/tyrex-quick --auto`** — Auto-approve all confirmation/approval checkpoints. Stages still run in full. Clarification questions for genuine ambiguities are still asked.
- **`/tyrex-quick --backlog`** — Execute all `ready` backlog items sequentially. For each item: pick → run full pipeline (new→plan→do) → mark done → next item. Combines with `--auto` for full autopilot.
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

## Guardrails Inline

Before executing any task (Step 4), read `templates/commands/shared/guardrails-inline.md` and apply its 10-rule compact constitution refresher. This ensures compliance even in long-context sessions.

## Checkpoint Reminder

During Step 4 (execution), apply periodic directive checkpoints per `templates/commands/shared/checkpoint-reminder.md`. After every N completed tasks (default: 2), inject the checkpoint reminder block before starting the next task.

## Behavior

### Step 0: Backlog mode (if `--backlog`)

If the `--backlog` flag is provided:

1. Read all `.tyrex/backlog/items/BL-*.yml` files with `status: ready`
2. If no ready items: "No backlog items ready. Use `/tyrex-backlog edit BL-NNN` to mark items as ready." → exit.
3. Present the execution plan:
   ```
   Backlog Execution Plan
   ═══════════════════════════════════════

   Items to execute (in phase/priority order):
     [1] BL-NNN — [title] (Phase N, [effort], [priority])
     [2] BL-NNN — [title] (Phase N, [effort], [priority])
     ...

   Total: N items
   Estimated: [sum of efforts]

   Execute all sequentially?
     [1] Execute all
     [2] Select which items
     [3] Cancel
   ```
4. For each selected item:
   a. Update backlog item `status: in-progress`
   b. Use item's description + acceptance_criteria as the feature description
   c. Run Steps 1-5 (full pipeline) with item context
   d. On success: update backlog item `status: done`, set `feature_id`
   e. On failure/rejection: update backlog item `status: ready` (revert to ready)
   f. Present: "Item BL-NNN done. Continue to next? [Y/n]"
   g. If `--auto`: continue automatically
5. After all items: present combined summary of all executed items.
6. Skip to Step 5b (combined summary).

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

### Step 3b: Visual Roadmap (before execution)

After planning is complete, read `.tyrex/state/features/NNN/tasks/*.yml` and group tasks by their `wave` field (same algorithm as `/tyrex-do` Step 3). Present a visual roadmap derived from actual task state data:

```
Execution Roadmap
═══════════════════════════════════════

Feature: NNN — [name]
Source:  [backlog BL-NNN | new description]

  Wave 1 (parallel — N tasks):
    [Task 1: description]  ────┐
    [Task 2: description]  ────┤
                               │
  Wave 2 (parallel — N tasks): │ depends on Wave 1
    [Task 3: description]  ────┤
    [Task 4: description]  ────┤
                               │
  Wave 3 (sequential — 1 task):│ depends on Wave 2
    [Task 5: description]  ────┘

  Summary: N tasks in M waves
  Parallel tasks: N | Sequential: N
  Files affected: [N total]
  Quality: [N required, N recommended, N optional]
  Security tasks: [N or "none"]

Proceed with execution?
  [1] Execute (wave-parallel, fresh context each)
  [2] Execute sequentially (ignore waves)
  [3] Modify plan
  [4] Cancel
```

**If `--auto`:** skip confirmation, proceed directly.
**If `--backlog`:** show which BL-item this execution is for.

### Step 3c: Safe checkpoint (before execution)

Before starting any implementation:

1. **Create checkpoint tag:** `git tag tyrex-checkpoint-NNN` (where NNN is the feature number). This marks the exact state before any code changes.
2. **Note the tag** in the per-feature state file: `checkpoint_tag: tyrex-checkpoint-NNN`
3. This tag enables full revert if the user rejects the result in Step 5.

If the tag already exists (re-execution), append a counter: `tyrex-checkpoint-NNN-2`.

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

### Step 4a: Execute /tyrex-verify internally

After all implementation tasks are complete, run user acceptance testing per `/tyrex-verify` logic:

1. Extract testable deliverables from feature spec acceptance criteria and completed task SPECs
2. Walk through each deliverable with the user (pass/fail/skip)
3. On failure: diagnose and create fix tasks
4. If fix tasks created and user approves: execute fixes via `/tyrex-do`, then re-verify failed items
5. Maximum 3 fix-verify loops

**With `--auto`:**
- Skip the interactive walk-through — auto-extract deliverables and assess them by reading the implementation code against the spec
- If the implementation matches the spec: auto-pass
- If discrepancies found: create fix tasks and execute them
- Re-verify automatically after fixes

**Without `--auto`:** Full interactive walk-through. The user tests each deliverable and reports pass/fail.

**Verify results** persist in `.tyrex/state/features/NNN-verify.md`.

**All `/tyrex-verify` steps execute in full.** Reference the `/tyrex-verify` command for the complete step sequence: Steps 1-6.

### Step 4b: Execute /tyrex-review internally

After all implementation tasks are complete, run the full `/tyrex-review` logic in PR scope (branch diff):

- Execute all 6 review lenses (Pattern Compliance, Code Quality & DRY, Business & Technical Compliance, Security First, Test Coverage, Documentation Consistency)
- Scope: `git diff main...HEAD` (only this feature's changes)
- Documentation finalization (Step 4 of review)
- TYREX.md evolution (Step 5 of review)
- Skill evolution (Step 5b of review)

**With `--auto`:**
- If **0 CRITICAL/HIGH findings:** auto-accept review, proceed to Step 5
- If **CRITICAL/HIGH findings exist:** STOP and present findings. Even in auto mode, critical issues require attention.
  ```
  Review found issues requiring attention:
    [!] CRITICAL  [description]
    [!] HIGH      [description]

    [1] Fix all — create rc- tasks and fix automatically
    [2] Accept anyway — proceed with known issues
    [3] Reject — revert to checkpoint
  ```
  If `--auto` + fix: auto-create rc- tasks, fix, re-review (loop until clean or 3 iterations max)

**Without `--auto`:** Present the full review summary and decision choices per `/tyrex-review` Step 6-7. The user can approve, fix findings, save to backlog, or reject.

**Review produces:**
- 6-lens review summary with findings and severities
- Documentation finalized
- TYREX.md updated with new patterns/decisions
- Skills evolved (if findings match skill domains)

**All `/tyrex-review` steps execute in full.** Reference the `/tyrex-review` command for the complete step sequence: Steps 1-9. Skip Step 9 (Finalize) — that happens in Step 5 below after accept/reject.

### Step 5: Final Report + Accept/Reject

After review completes, present the consolidated report:

```
TYREX Quick — Final Report
════════════════════════════════════════

Feature: NNN — [name]
Source:  [backlog BL-NNN | new description]
Branch:  feat/NNN-[slug]

Implementation:
  Tasks:   [N]/[N] completed
  Commits: [N]
  Files:   [N] changed
  Tests:   [N passing | N/A]
  Docs:    [list generated]
  Version: [old] → [new]

Review (6 lenses):
  Findings: [N] (CRITICAL: [n], HIGH: [n], MEDIUM: [n], LOW: [n])
  Compliance: [N]/[N] passed
  TYREX.md:   [updated | no changes]
  Skills:     [N updated | no changes]

Checkpoint: tyrex-checkpoint-NNN (revert point)
═══════════════════════════════════════
```

**If `--auto`:** accept automatically, skip choice.

**Otherwise, present accept/reject:**
```
Accept this delivery?
  [1] Accept — keep all changes, proceed to review
  [2] Reject — revert ALL changes to checkpoint
  [3] Review first — run /tyrex-review before deciding
```

**If Accept:**
- Remove the checkpoint tag: `git tag -d tyrex-checkpoint-NNN`
- Proceed to next action suggestion

**If Reject (safe revert):**
1. Reset to checkpoint: `git reset --hard tyrex-checkpoint-NNN`
2. Remove the checkpoint tag: `git tag -d tyrex-checkpoint-NNN`
3. Update backlog item status back to `ready` (if from backlog)
4. Update feature status to `rejected`
5. Tell user: "All changes reverted. Working tree is clean at the checkpoint state."
6. Present: "What next? [1] Try again [2] /tyrex-discuss [3] Done"

**If Review first:**
- Keep changes, suggest `/tyrex-review`
- Checkpoint tag stays until review decision

### Step 5b: Combined summary (for --backlog mode)

If executing multiple backlog items via `--backlog`, after all items are processed, present:

```
TYREX Backlog Execution Complete
════════════════════════════════════════

Items executed: [N]/[total]

  ✓ BL-NNN — [title] → Feature NNN (N tasks, N commits)
  ✓ BL-NNN — [title] → Feature NNN (N tasks, N commits)
  ✗ BL-NNN — [title] → rejected/failed

Version: [start] → [end]
```

**Next action** (per `templates/commands/shared/next-action-map.md`):
```
Next step: /tyrex-review — review implementations
  [1] Execute now
  [2] /tyrex-backlog view — check remaining items
  [3] Done for now
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
- **Checkpoint tag is mandatory.** Always create before execution starts. This is the safety net.
- **Reject = full revert.** `git reset --hard` to checkpoint. No partial state left behind.
- **Visual roadmap before execution.** User must see what will happen before it starts.
- **`--backlog` respects item order.** Execute by phase, then by priority within phase.
- **Backlog status updates are automatic.** ready→in-progress→done follows the pipeline.
