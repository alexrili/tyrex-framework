# SPEC: tyrex-review — Push Parent to Review

## Task
Feature 019, Task 6

## Objective
On feature completion in `/tyrex-review`, push the parent issue to "review" status in the external tracker (max status, never "done").

## Technical Approach
1. **Step 9 (Finalize)** — After feature status set to "done" locally, check for `external_ref` with `mode: "build"`.
2. **Pull** — Instruct agent to call `getStatus` MCP tool for parent issue.
3. **Compare** — If remote is behind "review", push forward. If already at "review" or beyond, skip.
4. **Push** — Instruct agent to call `setStatus` with "review" equivalent for the provider.
5. **Comment** — Add comment: "All development tasks completed. Ready for review. Updated by {user} — powered by Tyrex Framework".

Reference `external-tracker-sync.md` for provider mapping.

## Constraints
- NEVER push "done" — only "review"
- Forward-only rule applies
- Only in build mode

## Files Affected
- `templates/commands/unified/tyrex-review.md`

## Edge Cases
- Remote already at "QA Passed" or beyond → skip push, add comment noting completion
- No external_ref → skip silently

## Testing Strategy
Quality: optional. Manual test.
