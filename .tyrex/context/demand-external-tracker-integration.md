# Context: External Tracker Integration (Bidirectional)

## Origin
Discussion session on 2026-03-23. Explored connecting Tyrex features to external issue trackers (Jira, Linear, GitHub Issues).

## Decisions

### Architecture: MCP-only
- Tyrex does NOT make HTTP calls directly
- Markdown commands instruct the agent to use MCP tools for all tracker operations
- Zero new dependencies — consistent with project DNA
- Auth is managed by the MCP server configuration, not by Tyrex
- `tyrex.yml` stores provider config (provider name, project, user) but NOT credentials

### Integration Mode: Two modes
- **Read-only** — pull issue data as context, no sync back
- **Build** — assign issue to user, sync status bidirectionally, create subtasks

### Status Model: Forward-only with lifecycle boundary
- Tyrex defines 4 generic statuses: `todo`, `in_progress`, `review`, `done`
- **Tyrex's maximum push is `review`** — it NEVER sets `done` on the remote tracker
- `done` on the remote is the responsibility of the human/pipeline (QA, code review, deploy, etc.)
- Tyrex local `done` = development complete. Remote `review` = ready for the external pipeline.
- Each provider's MCP tools handle mapping to native statuses (e.g., Jira's "In Progress", "In Review")
- Mapping is implicit in the command instructions, not config-driven

### Status mapping per command
| Tyrex event | Remote status pushed | Who controls |
|---|---|---|
| `/tyrex-new` import (build mode) | `in_progress` (assign) | Tyrex |
| `/tyrex-do` task completion | subtask → `in_progress` or stays | Tyrex |
| `/tyrex-review` feature complete | parent → `review` (max) | Tyrex |
| Actual "Done" | — | Human/pipeline |

### Source of Truth: Forward-only, never regress
- Before any status push, Tyrex pulls current remote status
- **Tyrex only moves status forward, never backward**
- If remote is already ahead (e.g., "QA Passed") and Tyrex would push "In Review", it skips the push and logs a comment instead
- Every status update adds a comment: `Updated by {user} — powered by Tyrex Framework`

### Provider Agnosticism
- `tyrex.yml` has `integrations.tracker.provider` field
- Commands use conditional logic based on provider to call correct MCP tools
- Interface contract (conceptual): `getIssue`, `assignIssue`, `setStatus`, `createSubtask`, `addComment`

## v1 Scope
1. **Import** — fetch issue by ID (project + key), pre-populate feature spec
2. **Assign** — assign issue to configured user (build mode only)
3. **Create subtasks** — mirror /tyrex-plan tasks as subtasks in tracker
4. **Sync status** — forward-only sync during /tyrex-do (subtasks) and /tyrex-review (parent → review, never done)

## v1 NOT in scope
- Comments/attachments beyond status trail
- Bulk import (multiple issues at once)
- Webhook-based real-time sync
- Sprint/board management
- OAuth flow (API token via MCP config only)

## Affected Commands
- `/tyrex-new` — Step 0: "Import from external tracker" option
- `/tyrex-plan` — After task decomposition: "Sync subtasks to tracker?"
- `/tyrex-do` — On task completion: auto-sync subtask status + parent status
- `/tyrex-review` — On feature completion: set parent issue to "Review" (max, never "Done")
- `/tyrex-settings` — Configure tracker integration
- `/tyrex-status` — Show sync status per feature

## Config Shape (tyrex.yml)
```yaml
integrations:
  tracker:
    provider: "jira"        # "jira" | "linear" | "github-issues" | null
    project: "HOT"          # default project (overridable per feature)
    user: "alex@company.com" # user identity for assignments and comments
```

## Feature State Shape (NNN.yml)
```yaml
external_ref:
  source: "jira"
  id: "HOT-1234"
  url: "https://company.atlassian.net/browse/HOT-1234"
  mode: "build"       # "read-only" | "build"
  synced_at: "2026-03-23T10:00:00Z"
```

## Task State Shape (task-NNN.yml)
```yaml
external_task_ref:
  id: "HOT-1235"
  url: "https://company.atlassian.net/browse/HOT-1235"
```
