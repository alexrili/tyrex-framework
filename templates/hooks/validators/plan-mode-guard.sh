#!/usr/bin/env bash
# ─── Plan Mode Guard ─────────────────────────────────────────
# Tyrex validator: blocks source code writes when agent_mode is "plan".
#
# Protocol:
#   - Called by hook runners with args: $1=event_type $2=tool_name $3=file_path
#   - Also reads TYREX_* env vars set by the runner
#   - Exit 0 = allow, Exit 2 = block
#
# Only active for "pre-tool-use" events (Write/Edit interception).
# In build mode or non-pre-tool-use events: pass-through (exit 0).
# ─────────────────────────────────────────────────────────────

# ─── Only run for pre-tool-use events ────────────────────────

EVENT="${1:-$TYREX_HOOK_EVENT}"
if [ "$EVENT" != "pre-tool-use" ]; then
  exit 0
fi

# ─── Resolve paths ───────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
HOOKS_DIR="$(dirname "$SCRIPT_DIR")"

# Source common library
source "$HOOKS_DIR/lib/common.sh" 2>/dev/null || exit 0

# ─── Check if .tyrex exists ──────────────────────────────────

if [ -z "$TYREX_DIR" ]; then
  exit 0  # No .tyrex — not a Tyrex project, allow
fi

# ─── Read agent_mode ─────────────────────────────────────────

CURSOR_FILE="$TYREX_DIR/state/cursor.yml"
AGENT_MODE=$(tyrex_yaml_get "$CURSOR_FILE" "agent_mode" 2>/dev/null)

# Default to build if can't determine mode
if [ -z "$AGENT_MODE" ]; then
  exit 0
fi

# ─── Build mode = allow everything ───────────────────────────

if [ "$AGENT_MODE" != "plan" ]; then
  exit 0
fi

# ─── Plan mode: check file path ─────────────────────────────

FILE_PATH="${3:-$TYREX_FILE_PATH}"

if [ -z "$FILE_PATH" ]; then
  exit 0  # No file path — can't determine, allow
fi

# ─── Check if source code ───────────────────────────────────

if tyrex_is_source_file "$FILE_PATH"; then
  tyrex_block "Plan mode — source code writes blocked: $(basename "$FILE_PATH")"
  tyrex_log "Blocked file: $FILE_PATH"
  tyrex_log "agent_mode is 'plan' — only .tyrex/, docs/, .md, .yml files allowed"
  tyrex_log "Switch to build mode via /tyrex-do or /tyrex-quick to write source code"
  exit 2
fi

# File is config/docs/state — allow in plan mode
exit 0
