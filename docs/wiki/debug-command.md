# /tyrex-debug — Interactive Debug Command

## Overview

The `/tyrex-debug` command provides structured, AI-assisted debugging within the Tyrex workflow. It helps developers systematically diagnose problems, manage infrastructure, analyze logs and stack traces, and document bugs for later resolution.

## How It Works

1. **Invoke** `/tyrex-debug` — the agent enters plan mode and loads the debugger skill
2. **Describe the problem** or choose automatic analysis mode
3. **Select diagnostic depth:** quick, standard, or deep
4. **Infrastructure check** — the agent verifies containers/services are running and offers to start them (with your approval)
5. **Investigation** — guided log analysis, stack trace interpretation, hypothesis testing
6. **Documentation** — findings are saved as a structured bug report in `.tyrex/bugs/`

## Investigation Modes

### User-Directed
You describe the symptom and guide the investigation. The agent follows your lead, analyzing the areas you point to.

> "Every time I register a user without field X, the API returns a 500 error"

### Automatic Analysis
The agent takes the pilot — starts services, reads all available logs, runs tests if configured, and generates a comprehensive diagnostic report.

> "Run automatic analysis on the user registration service"

## Diagnostic Depth

| Depth | Sources | Best For |
|-------|---------|----------|
| Quick | Logs + code | Known issues, simple errors |
| Standard | + stack traces + test output | Most debugging scenarios |
| Deep | + health checks + metrics | Complex or intermittent issues |

## Bug Reports

Reports are saved in `.tyrex/bugs/DEBUG-NNN.md`. Each report contains:
- Session metadata (date, scope, depth)
- One or more bug findings, each with:
  - **Severity:** critical / high / medium / low
  - **Status:** open / resolved
  - **Symptom, Root Cause, Evidence**
  - **Affected Area** (files, services, endpoints)
  - **Suggested Fix** and **Reproduction Steps**

## Integration with Other Commands

- **`/tyrex-new`** — shows open bugs before starting a new feature, offering "fix bugs first?"
- **`/tyrex-status`** — includes bug summary (open count by severity)
- **`/tyrex-do`** — fixes bugs planned as tasks from the bug registry

## Debugger Skill

The command uses the `debugger` skill (`.tyrex/skills/debugger.md`) for structured diagnosis. If the skill is not installed, the command offers to create it.

## Examples

```
> /tyrex-debug
Describe the problem or choose a mode:
  [1] Describe a specific problem
  [2] Automatic analysis (broad scan)

> 1
Describe the symptom:
> Users receive a 500 error when registering without an email

Select diagnostic depth:
  [1] Quick — logs + code
  [2] Standard — + stack traces + tests
  [3] Deep — + health checks + metrics

> 2
Checking infrastructure...
  docker-compose: 3 containers (2 running, 1 exited)
  Container "api" is not running. Start it?
    [1] Yes
    [2] No, skip
```
