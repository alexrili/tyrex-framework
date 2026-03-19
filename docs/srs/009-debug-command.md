# SRS: /tyrex-debug — Interactive Debug Command

## Feature
Feature 009 — Debug Command

## Date
2026-03-19

## Project
tyrex

## 1. System Context
The `/tyrex-debug` command operates as a plan-mode slash command within the Tyrex framework. It interacts with:
- **User's project infrastructure** — Docker containers, services, log files
- **Tyrex state system** — `.tyrex/bugs/` for bug reports, `cursor.yml` for session state
- **Tyrex skills** — loads `debugger` skill as context persona
- **Other commands** — `/tyrex-new` reads bug registry, `/tyrex-status` shows bug summary

## 2. Functional Requirements

FR-001: The command shall set `agent_mode: "plan"` as its first action — no source code writes allowed.

FR-002: The command shall ask the user to describe the problem or choose automatic analysis mode.

FR-003: The command shall present diagnostic depth as structured choices:
  - Quick: logs + code-source only
  - Standard: logs + stack traces + code-source + test output
  - Deep: all above + health checks + metrics endpoints

FR-004: The command shall check infrastructure status (docker containers, services) and offer to start them if not running, with user permission before executing any command.

FR-005: The command shall analyze logs by filtering ERROR/WARN/FATAL levels and identifying the root error in the chain.

FR-006: The command shall analyze stack traces, mapping them to source files in the project.

FR-007: The command shall classify each finding with severity: critical, high, medium, or low.

FR-008: The command shall generate a session report at `.tyrex/bugs/DEBUG-NNN.md` with all findings in structured format (title, severity, status, symptom, root cause, evidence, affected area, suggested fix, reproduction steps).

FR-009: The command shall update `cursor.yml` with `last_action: "debug_session"` after completion.

FR-010: `/tyrex-new` shall check `.tyrex/bugs/` for open bugs (status: open) and present them before Step 1 with the choice "Fix bugs first?" or "Start new feature."

FR-011: The command shall suggest creating the `debugger` skill if not found in `.tyrex/skills/`.

FR-012: In automatic analysis mode, the command shall start services, read all available logs, run tests if available, and generate a comprehensive diagnostic report without step-by-step user guidance.

FR-013: The command shall allow the user to mark bugs as resolved within the session or defer to later.

## 3. Non-Functional Requirements

NFR-001: Security — All shell commands (docker, service start) must be presented to user for approval before execution. No unsanitized input in shell commands.

NFR-002: Performance — Log analysis should handle files up to 10MB without blocking.

NFR-003: Compatibility — Must work without Docker installed (gracefully skip container features).

## 4. Data Requirements

**Bug report schema (.tyrex/bugs/DEBUG-NNN.md):**
```
# Debug Session DEBUG-NNN
- Date: YYYY-MM-DD
- Scope: [user description or "automatic analysis"]
- Depth: quick | standard | deep
- Skills: [loaded skills]

## Findings

### BUG-001: [Title]
- Severity: critical | high | medium | low
- Status: open | resolved
- Symptom: ...
- Root Cause: ...
- Evidence: ...
- Affected Area: ...
- Suggested Fix: ...
- Reproduction: ...
```

**Bug status lifecycle:** open -> resolved (manually by user or via /tyrex-do fix)

## 5. Interface Requirements

**CLI command:** `/tyrex-debug` (no flags for v1)

**Interaction flow:**
1. User invokes `/tyrex-debug`
2. Agent sets plan mode, loads debugger skill
3. User describes problem OR chooses automatic mode
4. User selects diagnostic depth
5. Agent checks/starts infrastructure (with permission)
6. Agent collects evidence (logs, traces, test output)
7. Agent forms and tests hypotheses interactively
8. Agent documents findings in bug report
9. Agent presents summary and next steps

## 6. User Stories

- As a developer, I want to describe a bug symptom and have the AI guide me through diagnosis, so that I can find the root cause faster.
- As a developer, I want to request an automatic broad analysis, so that I can find issues I haven't noticed yet.
- As a developer, I want bugs documented persistently, so that I can fix them in a future feature.
- As a developer, I want to see open bugs when starting a new feature, so that I can prioritize fixes.

## 7. Constraints
- Plan mode only — the command must never write source code
- All infrastructure commands require explicit user approval
- Bug reports must be markdown files (consistent with Tyrex filesystem-based state)
- No new runtime dependencies

## 8. Assumptions
- User's project has some form of logs accessible (file-based or container-based)
- Docker is optional — the command works without it
- The user can describe the problem well enough to guide investigation (or chooses auto mode)

## 9. Acceptance Testing

| FR | Test Scenario | Expected Result |
|----|---------------|-----------------|
| FR-001 | Invoke /tyrex-debug | cursor.yml shows agent_mode: "plan" |
| FR-002 | Start session | User prompted for problem description or auto mode |
| FR-004 | Docker not running | Agent offers to start containers with user approval |
| FR-008 | Complete debug session | DEBUG-NNN.md created in .tyrex/bugs/ |
| FR-010 | Run /tyrex-new with open bugs | Open bugs shown before feature description |
| FR-011 | No debugger skill installed | Agent suggests creating it |
| FR-012 | Choose automatic mode | Agent runs broad analysis autonomously |
