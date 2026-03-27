#!/usr/bin/env bash
# ─── Tyrex Commit-Msg Hook ───────────────────────────────────
# Git hook: validates commit message format.
# Discovers and executes validators from .tyrex/hooks/validators/.
# Each validator that supports "commit-msg" event is called.
#
# Install: symlink from .git/hooks/commit-msg → .tyrex/hooks/commit-msg.sh
# ─────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/lib/common.sh"

# ─── Graceful skip if no .tyrex/ ─────────────────────────────

if [ -z "$TYREX_DIR" ]; then
  exit 0
fi

# ─── Read commit message ─────────────────────────────────────

COMMIT_MSG_FILE="${1:-.git/COMMIT_EDITMSG}"

if [ ! -f "$COMMIT_MSG_FILE" ]; then
  exit 0
fi

COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# ─── Run validators ──────────────────────────────────────────

VALIDATORS_DIR="$TYREX_HOOKS_DIR/validators"

export TYREX_DIR
export TYREX_HOOK_EVENT="commit-msg"
export TYREX_COMMIT_MSG="$COMMIT_MSG"
export TYREX_COMMIT_MSG_FILE="$COMMIT_MSG_FILE"

if ! tyrex_run_validators "$VALIDATORS_DIR" "$COMMIT_MSG" "commit-msg"; then
  tyrex_block "Commit message rejected by Tyrex validators. Fix issues above or use --no-verify to bypass."
  exit 1
fi

exit 0
