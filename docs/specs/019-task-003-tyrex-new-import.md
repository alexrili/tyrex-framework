# SPEC: tyrex-new — Import from External Tracker

## Task
Feature 019, Task 3

## Objective
Add "Import from external tracker" option to `/tyrex-new` Step 0, enabling users to create features from existing tracker issues.

## Technical Approach
1. **Step 0 modification** — Add option `[3] Import from external tracker` (shown only when `integrations.tracker.provider` is not null in tyrex.yml).
2. **Step 0a: External Reference** — Ask for project key (pre-filled from config) and issue ID.
3. **Step 0b: Fetch & Confirm** — Instruct agent to use MCP tools (per provider mapping from shared doc) to fetch issue details. Display summary for confirmation.
4. **Step 0c: Import Mode** — Structured choice: `[1] Read-only` / `[2] Build`.
5. **Step 0d: Assignment (build only)** — Instruct agent to assign issue to configured user and set status to `in_progress` via MCP.
6. **Pre-populate** — Use issue title as feature name, description as objective, acceptance criteria if present.
7. **State** — Write `external_ref` to per-feature state file (Step 8).

Reference `external-tracker-sync.md` for MCP tool mapping and mode behavior.

## Constraints
- Existing Steps 0b-0d (registry checks) need renumbering to avoid collision
- One question at a time — each sub-step is a separate interaction
- Adaptive decision format for all choices

## Files Affected
- `templates/commands/unified/tyrex-new.md`

## Edge Cases
- Tracker not configured → option not shown
- Issue not found → clear error, ask to retry or describe manually
- Issue already assigned to someone else (build mode) → warn, ask to proceed

## Testing Strategy
Quality: optional. Manual end-to-end test with a real Jira MCP server.
