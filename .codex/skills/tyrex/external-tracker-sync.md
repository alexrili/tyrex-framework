## External Tracker Sync

**Commands that sync with external trackers MUST follow this algorithm.**

Read `integrations.tracker` from `.tyrex/tyrex.yml`. If `provider` is `null`, skip all tracker operations silently.

### Generic Status Model

Tyrex uses 4 generic statuses. The agent maps them to provider-specific statuses via MCP tools.

| Generic | Jira equivalent | Linear equivalent | GitHub Issues equivalent |
|---------|----------------|-------------------|--------------------------|
| `todo` | To Do | Todo | Open |
| `in_progress` | In Progress | In Progress | Open (assigned) |
| `review` | In Review / Ready for QA | In Review | Open (labeled: review) |
| `done` | Done | Done | Closed |

### Lifecycle Boundary

**Tyrex's maximum push is `review`. It NEVER sets `done` on the remote tracker.**

- Tyrex local `done` = development complete
- Remote `review` = ready for external pipeline (QA, human code review, staging, production)
- The `done` transition is owned by the human or CI/CD pipeline

### Forward-Only Rule

Before any status push:
1. **Pull** current remote status via MCP tool
2. **Compare** — if remote is already at or ahead of the target status, skip the push
3. **Push** only if moving forward (e.g., `todo` → `in_progress`, `in_progress` → `review`)
4. **Never regress** — if remote is "QA Passed" and Tyrex would push "In Review", skip

### Comment Trail

Every status update MUST add a comment to the remote issue:
```
Updated by {user} — powered by Tyrex Framework
```
Where `{user}` is read from `integrations.tracker.user` in `tyrex.yml`.

### Mode Behavior

Check `external_ref.mode` in the per-feature state file:

- **`read-only`** — NO writes to remote tracker. No assignments, no status changes, no subtasks, no comments. Issue data is used as context only.
- **`build`** — Full bidirectional sync: assign, create subtasks, update status, add comments.

### Graceful Degradation

If any MCP tool call fails (server unavailable, auth expired, network error):
1. Log a warning: "Tracker sync skipped — MCP tool call failed: {error}"
2. Continue the command normally — never block the workflow
3. Note the failure in the task state or feature state `output` field

### Provider-to-MCP-Tool Mapping

Commands instruct the agent to use these MCP operations. Actual tool names vary per provider:

| Operation | Jira MCP | Linear MCP | GitHub Issues MCP |
|-----------|----------|------------|-------------------|
| Get issue | `jira_get_issue` or `search_issues` | `linear_get_issue` | `github_get_issue` |
| Assign issue | `jira_update_issue` (assignee field) | `linear_update_issue` | `github_update_issue` |
| Set status | `jira_transition_issue` | `linear_update_issue` (state field) | `github_update_issue` (state/labels) |
| Create subtask | `jira_create_issue` (parent field) | `linear_create_issue` (parent field) | `github_create_issue` (task list) |
| Add comment | `jira_add_comment` | `linear_create_comment` | `github_create_comment` |
| Get status | `jira_get_issue` (status field) | `linear_get_issue` (state field) | `github_get_issue` (state field) |

**Important:** MCP tool names may vary depending on the MCP server implementation. The agent should use the tools available in its MCP context. The table above is a reference — adapt to the actual tool names available.

### Config Reference

```yaml
# .tyrex/tyrex.yml
integrations:
  tracker:
    provider: "jira"              # "jira" | "linear" | "github-issues" | null
    project: "HOT"               # Default project key
    user: "alex@company.com"     # User identity
```

### State Reference

```yaml
# .tyrex/state/features/NNN.yml — external_ref block (optional)
external_ref:
  source: "jira"
  id: "HOT-1234"
  url: "https://company.atlassian.net/browse/HOT-1234"
  mode: "build"                  # "read-only" | "build"
  synced_at: "2026-03-23T10:00:00Z"
```

```yaml
# .tyrex/state/features/NNN/tasks/task-MMM.yml — external_task_ref block (optional)
external_task_ref:
  id: "HOT-1235"
  url: "https://company.atlassian.net/browse/HOT-1235"
```
