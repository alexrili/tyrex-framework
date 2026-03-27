# Context Monitor

> Shared algorithm for estimating context window usage and injecting warnings.
> Referenced by: `/tyrex-do`, `/tyrex-status`, `/tyrex-quick`

## Purpose

Prevents context rot by warning the agent and user when the context window is filling up.
In fresh execution mode, monitors the orchestrator's context only (sub-agents have fresh windows).
In inline mode, monitors the full session context.

## When to Check

Read `context_engineering.monitoring.check_interval` from `tyrex.yml`:
- `after_each_task` — run estimation after every task completion (default)
- `after_each_wave` — run estimation after each wave completes
- `manual` — only when explicitly requested (via `/tyrex-status`)

If `monitoring.enabled` is `false`, skip all checks silently.

## Estimation Heuristics

Exact token counts are not available to prompt-based agents. Use these heuristics to estimate context usage as a percentage:

**Proxy signals (ordered by reliability):**

1. **Task progress ratio** — tasks completed / total tasks. A 10-task feature at task 7 is ~70% through its work, and the orchestrator has accumulated context from 7 task cycles.
2. **Files read count** — count distinct files read in this session. Each file averages ~200-400 tokens. More than 30 files read = likely above 50%.
3. **Conversation turn count** — each user↔agent exchange is ~500-1000 tokens. More than 40 turns = likely above 70%.
4. **Inline execution depth** — in inline mode, each task adds its full SPEC + implementation + tests to context. After 3-4 inline tasks, context is likely above 50%.
5. **Self-assessment** — the agent can assess its own context pressure. If responses are getting shorter, less detailed, or losing track of earlier context, that's a signal.

**Estimation formula (simplified):**
```
In fresh mode (orchestrator only):
  context_pct ≈ 15% (base) + 3% per task cycle completed + 2% per file read by orchestrator

In inline mode (full session):
  context_pct ≈ 15% (base) + 8% per task completed inline + 2% per file read
```

These are rough estimates. The goal is directional awareness, not precision.

## Warning Format

Based on estimated percentage vs configured thresholds:

**Below info threshold (< 50%):** No warning. Continue normally.

**Info threshold (50%):**
```
📊 Context: ~50% — on track. N tasks remaining.
```
Append to the task completion summary. No action needed.

**Warning threshold (70%):**
```
⚠️ Context: ~70% — consider these options for remaining N tasks:
  • Switch remaining tasks to sub-agents (fresh context each)
  • Start a fresh session and run /tyrex-recover to continue
```
Append after the task completion summary. Suggest action but don't interrupt.

**Critical threshold (85%):**
```
🔴 Context: ~85% — quality may degrade. Strongly recommended:
  • Save state now and start a fresh session
  • Run /tyrex-recover in the new session to resume from here
  • Remaining tasks: [list with status]
```
Present as a visible block. In `--auto` mode, log the warning and continue (don't stop).

## Actions by Execution Mode

**Fresh mode (orchestrator):**
- The orchestrator's context grows slowly (only metadata + task results)
- Warning at 70%: suggest completing current wave and starting fresh session for remaining waves
- Warning at 85%: strongly recommend fresh session — save state, the new session will pick up from the current wave

**Inline mode (full session):**
- Context grows fast (full code + tests per task)
- Warning at 50%: suggest switching remaining tasks to fresh sub-agents if available
- Warning at 70%: strongly recommend switching to fresh mode or starting fresh session
- Warning at 85%: stop after current task and recommend fresh session

## Integration Points

- **`/tyrex-do`:** Check after each task (or wave) completion. Inject warning in task summary.
- **`/tyrex-status`:** Show current context health estimate in status output.
- **`/tyrex-quick`:** Inherited from `/tyrex-do` — monitoring runs during execution phase.
- **`/tyrex-recover`:** On resume, reset context estimate to base (15%) — new session = fresh context.
