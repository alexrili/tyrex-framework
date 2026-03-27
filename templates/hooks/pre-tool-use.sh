#!/usr/bin/env bash
# ─── Tyrex PreToolUse Hook ───────────────────────────────────
# Claude Code hook: intercepts Write/Edit tool calls.
# Reads JSON from stdin, routes to validators, returns decision.
#
# Configured in .claude/settings.json:
#   "hooks": {
#     "PreToolUse": [{
#       "matcher": "Edit|Write",
#       "hooks": [{"type": "command", "command": ".tyrex/hooks/pre-tool-use.sh"}]
#     }]
#   }
# ─────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/lib/common.sh"

# ─── Graceful skip if no .tyrex/ ─────────────────────────────

if [ -z "$TYREX_DIR" ]; then
  exit 0
fi

# ─── Read hook input ─────────────────────────────────────────

INPUT=$(cat)

TOOL_NAME=$(tyrex_json_get "$INPUT" '.tool_name')
FILE_PATH=$(tyrex_json_get "$INPUT" '.tool_input.file_path')

if [ -z "$TOOL_NAME" ] || [ -z "$FILE_PATH" ]; then
  exit 0  # Can't determine tool/file — allow
fi

# ─── Run validators ──────────────────────────────────────────

VALIDATORS_DIR="$TYREX_HOOKS_DIR/validators"

# Pass context to validators via environment
export TYREX_DIR
export TYREX_TOOL_NAME="$TOOL_NAME"
export TYREX_FILE_PATH="$FILE_PATH"
export TYREX_HOOK_EVENT="PreToolUse"

# Run all validators — any exit 2 = block
if ! tyrex_run_validators "$VALIDATORS_DIR" "$INPUT" "pre-tool-use" "$TOOL_NAME" "$FILE_PATH"; then
  # At least one validator blocked — return structured deny
  cat <<DENY_JSON
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Blocked by Tyrex hook validator"
  }
}
DENY_JSON
  exit 0
fi

# All validators passed — allow
exit 0
