# SPEC: Shared External Tracker Sync Algorithm

## Task
Feature 019, Task 2

## Objective
Create a shared reference document that all commands reference for tracker sync behavior — like feature-context-resolution.md but for external tracker operations.

## Technical Approach
Create `templates/commands/shared/external-tracker-sync.md` defining:

1. **Generic status model** — `todo`, `in_progress`, `review`, `done`. Mapping table per provider.
2. **Forward-only rule** — Always pull before push. Only push if local status is ahead of remote. Never regress.
3. **Lifecycle boundary** — Max push is `review`. Tyrex never sets `done`. Document why.
4. **Comment trail format** — `Updated by {user} — powered by Tyrex Framework`
5. **Provider-to-MCP-tool mapping** — Table mapping generic operations (getIssue, assignIssue, setStatus, createSubtask, addComment) to provider-specific MCP tool names for Jira, Linear, GitHub Issues.
6. **Mode behavior** — Read-only: no writes. Build: full sync. Check `external_ref.mode` field.
7. **Graceful degradation** — If MCP tool call fails, warn and continue. Never block the workflow.
8. **Config reading** — How to read `integrations.tracker` from tyrex.yml.

## Constraints
- Document is reference only — not executable
- Must be concise enough for agents to consume in context
- Must cover all three providers (Jira, Linear, GitHub Issues)

## Files Affected
- `templates/commands/shared/external-tracker-sync.md` (new file)

## Testing Strategy
Quality: optional. Review for completeness and clarity.
