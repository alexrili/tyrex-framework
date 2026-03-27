---
description: "Manage persistent cross-session threads — named knowledge topics"
---

# /tyrex-thread - Cross-Session Persistent Context

You are the Tyrex Framework orchestrator. The user wants to create, access, or manage threads — persistent named topics that accumulate knowledge across multiple sessions.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may create/modify only `.tyrex/threads/` and `.tyrex/state/` files.

## Concepts

**Thread** = a named, persistent knowledge topic. Lighter than context files, designed for ongoing discussions, investigations, or decisions that span multiple sessions. Threads have no lifecycle — they are a living knowledge base.

Threads live in `.tyrex/threads/THREAD-<name>.md` with frontmatter and markdown body.

## Parameters

- **`/tyrex-thread`** — List all threads
- **`/tyrex-thread <name>`** — Open a thread for reading and appending
- **`/tyrex-thread add <name> "content"`** — Append content to a thread (create if doesn't exist)
- **`/tyrex-thread new <name>`** — Create a new empty thread

## Pre-flight

1. Check `.tyrex/threads/` exists. If not, create the directory.
2. Scan existing threads.

## Behavior

### Subcommand: (no args) — List threads

1. Read all `.tyrex/threads/THREAD-*.md` files
2. Display summary:

```
TYREX Threads
═══════════════════════════════════════

  Name              Last Updated    Entries
  auth-decisions    2026-03-27      5
  api-design        2026-03-26      3
  perf-investigation 2026-03-25     8

Total: N threads

Actions:
  [1] Open a thread
  [2] Create new thread
  [3] Done
```

### Subcommand: `<name>` — Open thread

1. Read `.tyrex/threads/THREAD-<name>.md`
2. If not found: offer to create it
3. Display the full thread content
4. Enter interactive mode:
   ```
   Thread: [name] (last updated: [date])
   ═══════════════════════════════════════

   [full thread content]

   ---
   Add to this thread? Type your addition, or "done" to exit.
   ```
5. When user adds content:
   - Append to the thread with a timestamp separator:
     ```
     ---
     **[YYYY-MM-DD]** — [user's content]
     ```
   - Save the file
   - Update `last_updated` in frontmatter
   - Commit: `thread: update [name] — [brief summary]`

### Subcommand: `add <name> "content"` — Quick append

1. If thread exists: append content with timestamp
2. If thread doesn't exist: create it with the content as first entry
3. Commit: `thread: update [name] — [brief summary]`

### Subcommand: `new <name>` — Create thread

1. If thread already exists: "Thread '[name]' already exists. Open it? [Y/n]"
2. Create `.tyrex/threads/THREAD-<name>.md`:
   ```markdown
   ---
   name: [name]
   created: "YYYY-MM-DD"
   last_updated: "YYYY-MM-DD"
   ---

   # Thread: [name]

   ```
3. Commit: `thread: create [name]`
4. Enter interactive mode (same as open)

## File Format

### Thread (`.tyrex/threads/THREAD-<name>.md`)
```markdown
---
name: "<thread-name>"
created: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
---

# Thread: <thread-name>

---
**YYYY-MM-DD** — First entry content here.

---
**YYYY-MM-DD** — Second entry added in a later session.
```

## Integration Points

- **`/tyrex-discuss`:** Can load a thread as context via `--thread "name"`. Can also save discussion conclusions to a thread.
- **`/tyrex-status`:** Shows recent threads (last 3, sorted by last_updated).

## Git Semantic Commits

- **create:** `thread: create [name]`
- **update:** `thread: update [name] — [brief summary]`
- **delete:** `thread: delete [name]`

Check `tyrex.yml` `git.auto_commit_state` before committing. If `off`, skip silently.

## Important Rules
- **Threads are persistent.** They don't expire or get archived automatically.
- **Thread names are kebab-case.** Convert user input: "Auth Decisions" → "auth-decisions"
- **Plan mode only.** Threads are knowledge, not code.
- **Entries are append-only.** Never modify past entries (only add new ones).
- **No lifecycle.** Threads don't have status (draft/ready/done). They just exist.
- **Lightweight.** A thread should be easy to create and easy to add to. Minimal ceremony.
