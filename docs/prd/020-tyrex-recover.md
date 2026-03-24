# PRD: Tyrex Recover (Crash Recovery & Session Resumption)

## Date
2026-03-24

## Project
tyrex-framework

## 1. Problem Statement
When the LLM session disconnects abruptly (network failure, token expiration, service outage), the AI agent may be mid-task — code partially written, files modified but not committed, `.tyrex/` state not yet updated. The current `/tyrex-resume` relies on `cursor.yml` being up-to-date, but in a crash scenario it reflects the *last completed* task, not the *in-progress* one. The user returns to an orphaned state: uncommitted changes, stale cursor, and no clear path to resume.

## 2. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Recover from any crash | % of crash scenarios with actionable recovery path | 100% |
| No lost work | Uncommitted changes preserved or user-decided | 0 silent data loss |
| Auto-detection | Commands that detect inconsistency before user notices | All /tyrex-* commands |
| Replace /tyrex-resume | Single command for normal resume + crash recovery | 1 command |

## 3. User Personas

- **Solo dev on unstable network** — session drops mid-task, returns minutes later. Needs to pick up exactly where they left off without re-explaining context.
- **Dev switching between machines** — closes laptop mid-session, opens on different machine. Needs to understand partial state.
- **Dev after LLM service outage** — provider goes down during `/tyrex-do`. Returns to find code changes but no commit, no state update.

## 4. Competitive Landscape

| Alternative | Strengths | Weaknesses | Our Differentiation |
|-------------|-----------|------------|---------------------|
| Git stash + manual resume | Simple, universal | No context recovery, manual | Automated forensics + context rebuild |
| IDE session restore | Restores open files | No workflow state, no AI context | Full Tyrex state + task context recovery |
| tmux/screen persistence | Keeps terminal alive | Doesn't survive auth expiry | Works after full session loss |

## 5. Requirements

### Must-Have (P0)
- Forensic analysis: compare git state vs `.tyrex/` state to detect inconsistencies
- Detect uncommitted changes and classify them (which feature/task they belong to)
- Present user with structured choices for uncommitted changes: keep, stash, discard
- Reconstruct "what was happening" from evidence (branch, diff, task states, cursor)
- Auto-detection hook: all `/tyrex-*` commands check for crash signals before proceeding
- Replace `/tyrex-resume` — normal resume is a subset of recovery (no crash detected = resume)
- Offer to continue the interrupted task after recovery

### Should-Have (P1)
- Attempt auto-completion of interrupted task when changes are coherent and tests pass
- Show diagnostic summary of what the agent was likely doing when it crashed
- Handle multi-file partial changes (some files complete, some mid-edit)

### Nice-to-Have (P2)
- Confidence score for auto-fix (high = auto-suggest, low = ask user)
- Recovery history log for debugging recurring disconnection patterns

## 6. User Flow

```
User returns after crash → runs any /tyrex-* command OR /tyrex-recover
  → Crash detection triggers (git dirty + stale cursor)
  → Forensic analysis: branch, diff, task states, last commit
  → Diagnostic: "You were likely working on task 003 of feature 020.
     3 files modified, 0 committed. Tests: not run."
  → Choices: [keep changes + continue] [stash + start fresh] [discard]
  → If keep: validate changes → run tests → offer to commit or continue editing
  → If auto-fix viable: suggest completing the task automatically
  → Update cursor.yml to reflect recovered state
```

## 7. Non-Goals
- Recovering from git corruption (use git reflog)
- Recovering work from a different machine (no remote state sync)
- Persisting LLM conversation context (that's the provider's responsibility)
- Recovery of non-Tyrex work (only features with `.tyrex/` state)
