# PRD: External Tracker Integration (Bidirectional)

## Date
2026-03-23

## Project
tyrex-framework

## 1. Problem Statement
Tyrex features exist only locally in `.tyrex/features/`. Teams that use project management tools (Jira, Linear, GitHub Issues) must manually duplicate information between Tyrex and their tracker. Status updates, subtask creation, and assignment are done twice — once in Tyrex and once in the tracker. This friction discourages adoption in teams with established PM workflows.

## 2. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Eliminate dual entry | Manual tracker updates needed per feature | 0 |
| Preserve agnosticism | Provider-specific code in Tyrex CLI | 0 lines |
| Zero new dependencies | Runtime dependencies added | 0 |
| Bidirectional sync | Status drift between Tyrex and tracker | None (forward-only) |

## 3. User Personas

- **Solo dev with Jira** — uses Tyrex locally, team tracks work in Jira. Needs features to appear in Jira without leaving the terminal.
- **Tech lead** — reviews progress in Jira board. Expects subtasks and status to reflect development progress automatically.
- **Dev in regulated team** — must have audit trail. Comment trail on tickets proves what happened and when.

## 4. Competitive Landscape

| Alternative | Strengths | Weaknesses | Our Differentiation |
|-------------|-----------|------------|---------------------|
| GitHub Actions + Jira | Automated on push | Requires CI, not local | Works locally, no CI needed |
| Jira CLI (atlas) | Official tool | Manual, no AI workflow | Integrated into AI dev workflow |
| Linear + Git integration | Auto-links PRs | One-way, no subtask sync | Bidirectional, subtask creation |

## 5. Requirements

### Must-Have (P0)
- Import issue by ID from external tracker into `/tyrex-new`
- Two import modes: read-only (context only) and build (assign + sync)
- Create subtasks in tracker during `/tyrex-plan` (build mode)
- Sync subtask status forward on `/tyrex-do` task completion (build mode)
- Set parent issue to "review" on `/tyrex-review` completion (build mode, max status)
- Forward-only status push (never regress remote status)
- Pull remote status before push to detect drift
- Comment trail on every status update
- Tracker configuration via `tyrex.yml` and `/tyrex-settings`
- Provider-agnostic: works with any tracker that has an MCP server

### Should-Have (P1)
- Tracker setup in `tyrex init` interactive flow
- `/tyrex-status` shows sync state per feature

### Nice-to-Have (P2)
- Bulk import (multiple issues)
- Sprint/board awareness

## 6. Out of Scope
- Attachments upload/download
- Webhook-based real-time sync
- OAuth flow management (auth handled by MCP server)
- Tyrex CLI making HTTP calls directly (MCP-only)
- Setting "done" status on remote tracker (human/pipeline responsibility)

## 7. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| MCP server not installed | Med | High | Detect at import time, clear error message with setup instructions |
| Provider MCP tools have different names | Med | Med | Command instructions use conditional blocks per provider |
| Status mapping mismatch | Low | Med | Generic statuses with implicit mapping in command instructions |
| MCP server auth expired | Med | Low | Agent handles auth errors naturally, user re-auths |

## 8. Dependencies
- MCP server for the chosen tracker (Jira: Atlassian Rovo MCP, Linear: Linear MCP, etc.)
- Agent that supports MCP (Claude Code, Cursor, etc.)

## 9. Launch Criteria
- [ ] Import from Jira via MCP works end-to-end
- [ ] Subtask creation syncs during /tyrex-plan
- [ ] Status sync works during /tyrex-do
- [ ] Forward-only rule prevents status regression
- [ ] Comment trail appears on every update
- [ ] Read-only mode works without side effects
- [ ] Config via tyrex.yml and /tyrex-settings
- [ ] Documentation updated (TYREX.md, CHANGELOG, wiki)
