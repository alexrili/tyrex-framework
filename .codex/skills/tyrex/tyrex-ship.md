---
description: "Create PR from verified and reviewed feature work"
---

# /tyrex-ship - Ship Feature as Pull Request

You are the Tyrex Framework orchestrator. The user wants to create a pull request from a completed, verified, and reviewed feature branch.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. PR creation and git operations only.

## Parameters

- **`/tyrex-ship`** (default) — Create PR for the current feature interactively
- **`/tyrex-ship --draft`** — Create PR as draft (not ready for review)
- **`/tyrex-ship --squash`** — Squash all feature commits into one before PR

## Adaptive Decision Format

**ALL decisions MUST use structured choices.** One question at a time.

## Feature Context Resolution

**This command operates on an existing feature.** Resolve using: `--feature` flag → branch detection → `last_active_feature` → prompt user.

## Pre-flight

1. **Check feature status:** Read per-feature state file. The feature should be `reviewed` or at minimum `in_progress` (all tasks completed).
   - If tasks are pending/failed: warn and suggest `/tyrex-do` first
   - If not verified: warn and suggest `/tyrex-verify` first
   - If not reviewed: warn and suggest `/tyrex-review` first
   - The user can override all warnings and ship anyway

2. **Check git state:**
   - Current branch must be a feature branch (not main/master)
   - Branch must have commits ahead of main
   - Working tree should be clean (no uncommitted changes)
   - If dirty: suggest committing or stashing first

3. **Check remote:**
   - If branch is not pushed: will push as part of PR creation
   - If branch is already pushed: check if remote is up to date

## Behavior

### Step 1: Generate PR content

1. **Collect sources for PR body:**
   - Feature spec (`.tyrex/features/NNN-*.md`) — summary and acceptance criteria
   - CHANGELOG entries for this feature's version
   - Task summaries from completed tasks
   - Verification report (`.tyrex/state/features/NNN-verify.md`) if exists
   - Review findings summary (if review was run)

2. **Generate PR title:**
   - Format: `feat(NNN): [feature title]` (conventional commit style)
   - Max 70 characters
   - Extract from feature spec summary

3. **Generate PR body:**
   ```markdown
   ## Summary
   [2-3 sentences from feature spec]

   ## Changes
   - [bullet per task completed]

   ## Verification
   - [N/N deliverables passed | not verified]

   ## Review
   - [N findings: X critical, Y high, Z medium | not reviewed]

   ## Test Plan
   - [ ] [extracted from verification deliverables]

   ## Backlog
   - Source: [BL-NNN — title | new feature]

   ---
   🦖 Shipped with [Tyrex Framework](https://github.com/tyrex-framework/tyrex)
   ```

4. **Present for approval:**
   ```
   PR Preview
   ═══════════════════════════════════════

   Title: feat(NNN): [title]
   Base:  main
   Head:  feat/NNN-[slug]
   Commits: [N]

   Body:
     [generated body preview]

     [1] Create PR
     [2] Create as draft
     [3] Edit title
     [4] Edit body
     [5] Cancel
   ```

### Step 2: Prepare branch

1. **If `--squash`:**
   - Count commits on feature branch (ahead of main)
   - Squash into single commit with comprehensive message:
     ```
     feat(NNN): [feature title]

     [body from CHANGELOG entries]

     Tasks: [N] completed
     Backlog: BL-NNN
     ```
   - Present the squash for confirmation

2. **Push branch:**
   - `git push -u origin feat/NNN-[slug]`
   - If push fails (auth, permissions): present error and suggest manual push

### Step 3: Create PR

Use `gh pr create` (or equivalent git platform CLI) to create the PR:

```bash
gh pr create \
  --title "[title]" \
  --body "[body]" \
  --base main \
  --head feat/NNN-[slug] \
  [--draft if --draft flag]
```

**If `gh` CLI not available:** Present the PR body and instructions for manual creation:
```
gh CLI not found. Create PR manually:
  Branch: feat/NNN-[slug] → main
  Title: [title]
  Body: [copied to clipboard or displayed]
```

### Step 4: Post-ship updates

1. **Update feature state:** set `status: shipped`, `pr_url: [url]`
2. **Update backlog item** (if from backlog): keep as `done` (shipping doesn't change backlog status)
3. **Sync to external tracker** (if configured):
   - Push feature status to `review` (max forward status — never `done`)
   - Add comment with PR URL: "PR created: [url]. Updated by {user} — powered by Tyrex Framework"
4. **Auto-commit state:** `ship: feature NNN — PR created`

### Step 5: Next action

```
PR created: [url]

  [1] /tyrex-backlog view — check remaining items
  [2] /tyrex-status — see project overview
  [3] Done
```

## Git Semantic Commits

After shipping, auto-commit state changes:
- `ship: feature NNN — PR #[number] created`

## Important Rules
- **Never force push.** If the branch needs updating, suggest `git pull --rebase` first.
- **Never push to main/master directly.** Always create a PR.
- **PR body is auto-generated** from existing artifacts — no manual writing needed.
- **Draft PRs are safe.** Suggest `--draft` when the feature isn't fully reviewed.
- **Squash is optional.** Offer but don't force — some teams prefer full commit history.
- **External tracker sync respects the lifecycle boundary.** Max status push: `review`, never `done`.
- **If PR creation fails,** display the error and the PR body so the user can create it manually.
- **Plan mode.** This command never writes source code — only git operations and state updates.
