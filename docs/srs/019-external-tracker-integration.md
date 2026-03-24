# SRS: External Tracker Integration (Bidirectional)

## Feature
Feature 019 — External Tracker Integration

## Date
2026-03-23

## Project
tyrex-framework

## 1. System Context
This feature adds bidirectional sync between Tyrex features and external issue trackers. It spans 6 existing commands (`/tyrex-new`, `/tyrex-plan`, `/tyrex-do`, `/tyrex-review`, `/tyrex-settings`, `/tyrex-status`) plus `tyrex init`. No new commands are created. All tracker communication happens via MCP tools — the Tyrex CLI and command prompts never make HTTP calls directly.

Components involved:
- `tyrex.yml` — stores tracker configuration
- `.tyrex/state/features/NNN.yml` — stores `external_ref` per feature
- `.tyrex/state/features/NNN/tasks/task-NNN.yml` — stores `external_task_ref` per task
- `bin/tyrex.js` — `tyrex init` flow (config questions)
- `templates/commands/unified/tyrex-*.md` — command prompt modifications

## 2. Functional Requirements

FR-001: The system shall allow configuring a tracker provider (jira, linear, github-issues, or null) in `tyrex.yml` under `integrations.tracker`.

FR-002: The system shall offer "Import from external tracker" as a Step 0 option in `/tyrex-new` when `integrations.tracker.provider` is not null.

FR-003: The system shall fetch issue details (title, description, acceptance criteria, priority, type, assignee, status) via MCP tools when the user provides a project key and issue ID.

FR-004: The system shall present fetched issue details and ask the user to confirm before proceeding.

FR-005: The system shall offer two import modes: read-only (context only, no sync) and build (assign + bidirectional sync).

FR-006: In build mode, the system shall assign the issue to the configured user and set remote status to "in_progress" during `/tyrex-new`.

FR-007: The system shall store `external_ref` (source, id, url, mode, synced_at) in the per-feature state file.

FR-008: During `/tyrex-plan`, when the feature has `external_ref` in build mode, the system shall offer to create subtasks in the tracker for each planned task.

FR-009: The system shall store `external_task_ref` (id, url) in each task state file when subtasks are created.

FR-010: During `/tyrex-do`, when a task with `external_task_ref` completes, the system shall pull current remote status, and if local status is ahead, push the new status forward.

FR-011: The system shall never push a status that would regress the remote status (e.g., pushing "in_progress" when remote is already "in_review").

FR-012: During `/tyrex-review`, when the feature has `external_ref` in build mode, the system shall set the parent issue to "review" status — never "done".

FR-013: Every status update shall add a comment to the remote issue: "Updated by {user} — powered by Tyrex Framework".

FR-014: In read-only mode, no writes shall be made to the remote tracker (no assignment, no status changes, no subtasks, no comments).

FR-015: `/tyrex-settings` shall allow viewing and modifying `integrations.tracker` configuration.

FR-016: `tyrex init` shall ask if the user wants to configure a tracker integration and write the config to `tyrex.yml`.

## 3. Non-Functional Requirements

NFR-001: Zero dependencies — all tracker communication via MCP tools, no HTTP libraries added.

NFR-002: Provider-agnostic — command instructions use conditional logic per provider, no provider-specific code in `bin/tyrex.js`.

NFR-003: Graceful degradation — if MCP server is unavailable, commands skip sync with a warning, never fail the workflow.

NFR-004: Idempotent sync — pushing the same status twice has no adverse effect (comment dedup optional in v2).

## 4. Data Requirements

### tyrex.yml (new section)
```yaml
integrations:
  tracker:
    provider: "jira"              # "jira" | "linear" | "github-issues" | null
    project: "HOT"               # default project key
    user: "alex@company.com"     # user identity for assignments and comments
```

### Per-feature state (NNN.yml, new fields)
```yaml
external_ref:
  source: "jira"
  id: "HOT-1234"
  url: "https://company.atlassian.net/browse/HOT-1234"
  mode: "build"                  # "read-only" | "build"
  synced_at: "2026-03-23T10:00:00Z"
```

### Per-task state (task-NNN.yml, new fields)
```yaml
external_task_ref:
  id: "HOT-1235"
  url: "https://company.atlassian.net/browse/HOT-1235"
```

## 5. Interface Requirements

### MCP Tool Interface (conceptual contract)
Commands instruct the agent to call these MCP operations:
- `getIssue(id)` → issue details
- `assignIssue(id, user)` → assign
- `setStatus(id, status)` → transition
- `createSubtask(parentId, {title, description})` → create child issue
- `addComment(id, text)` → comment trail
- `getStatus(id)` → pull current status (before push)

Actual MCP tool names vary per provider (e.g., `jira_get_issue`, `linear_get_issue`). Command instructions map generic operations to provider-specific tools.

### CLI Interface (tyrex init)
```
Configure external tracker integration? [y/N]
  Provider: [1] Jira  [2] Linear  [3] GitHub Issues  [4] Skip
  Default project key: ___
  User email/handle: ___
```

## 6. User Stories

- As a developer, I want to import a Jira ticket as a Tyrex feature, so that I don't duplicate information.
- As a developer, I want subtasks created in Jira when I plan tasks in Tyrex, so that my tech lead sees the breakdown.
- As a developer, I want task status synced to Jira as I complete work, so that the board reflects reality.
- As a tech lead, I want a comment trail on every status update, so that I know what happened and when.
- As a developer, I want read-only mode, so that I can pull context without modifying the ticket.
- As a developer, I want Tyrex to never mark tickets as "done", so that QA and review processes are respected.

## 7. Constraints
- MCP-only: no HTTP libraries, no API clients
- Zero runtime dependencies (Node.js built-ins only)
- Commands are markdown files, not executable code — logic is expressed as agent instructions
- Forward-only status: Tyrex never regresses remote status
- Maximum status push is "review", never "done"

## 8. Assumptions
- User has an MCP server configured for their tracker in their AI agent
- MCP server handles authentication (API token, OAuth, etc.)
- Tracker supports subtasks (Jira: subtask, Linear: sub-issue, GitHub: task list)
- Tracker has a concept of status transitions (todo → in_progress → review → done)

## 9. Acceptance Testing

| FR | Test Scenario | Expected Result |
|----|---------------|-----------------|
| FR-002 | `/tyrex-new` with tracker configured | Shows "Import from external tracker" option |
| FR-002 | `/tyrex-new` with no tracker configured | No import option shown |
| FR-003 | Import HOT-1234 | Fetches and displays issue details |
| FR-005 | Select read-only mode | No assignment, no sync, issue data used as context |
| FR-006 | Select build mode | Issue assigned, status set to in_progress |
| FR-008 | `/tyrex-plan` with external_ref in build mode | Offers subtask creation, creates in tracker |
| FR-010 | `/tyrex-do` completes task with external_task_ref | Pulls remote status, pushes forward if ahead |
| FR-011 | Remote status is "QA Passed", Tyrex pushes "In Review" | Push skipped, comment logged |
| FR-012 | `/tyrex-review` completes feature | Parent set to "review", not "done" |
| FR-013 | Any status update | Comment added to remote issue |
| FR-014 | Read-only feature, any command | No writes to remote tracker |
