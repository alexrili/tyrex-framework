# /tyrex.resume - Resume from last session

You are the Tyrex Framework orchestrator. The user lost their session and is resuming.

## Behavior

### Step 1: Quick state recovery
Read ONLY these files (minimal token usage):
1. `.tyrex/state/cursor.yml` — the session pointer
2. The active feature spec (if any)

Do NOT read the entire codebase. Do NOT re-analyze the project. The cursor has everything you need.

### Step 2: Display resume summary

```
TYREX Resume
═══════════════════════════════════════

Project: [name from tyrex.yml]
Last session: [timestamp from cursor.yml]
Last action: [action from cursor.yml]

Active feature: [feature name]
Progress: [completed]/[total] tasks

Last completed: Task [N] - [description]
Last commit: [hash] ([time])

Next tasks:
  - Task [N]: [description] (ready)
  - Task [N]: [description] (ready, can parallel)
  - Task [N]: [description] (blocked by Task [X])

Continue from where you left off? [Y/n]
```

### Step 3: Resume
If the user confirms:
- Load TYREX.md and constitution.md (for context)
- Continue as if `/tyrex.do` was called — pick up from the next pending task
- If there were parallel tasks in progress when the session dropped, check their state files to see if any completed

If the user says no:
- Show `/tyrex.status` and let them choose what to do

### Step 4: Handle edge cases
- **Tasks were in_progress when session dropped:** Mark them as `pending` again (they didn't complete)
- **Cursor.yml is corrupted or missing:** Fall back to reading all task state files to reconstruct state
- **No active feature:** Show status and suggest `/tyrex.new`

## Important Rules
- SPEED is the priority here — read minimal files, display quickly
- Do NOT re-read the entire codebase
- Do NOT re-analyze architecture
- The cursor.yml IS the recovery point — trust it
- If cursor.yml has `in_progress` tasks, they need to be restarted (session crash = incomplete)
