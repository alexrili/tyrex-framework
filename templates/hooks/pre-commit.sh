#!/usr/bin/env bash
# ─── Tyrex Pre-Commit Hook ───────────────────────────────────
# Git hook: runs before each commit.
# Discovers and executes validators from .tyrex/hooks/validators/.
# Each validator that supports "pre-commit" event is called.
#
# Install: symlink from .git/hooks/pre-commit → .tyrex/hooks/pre-commit.sh
# ─────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/lib/common.sh"

# ─── Graceful skip if no .tyrex/ ─────────────────────────────

if [ -z "$TYREX_DIR" ]; then
  exit 0
fi

# ─── Gather staged files ─────────────────────────────────────

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null || echo "")

if [ -z "$STAGED_FILES" ]; then
  exit 0  # Nothing staged — allow
fi

# ─── Run validators ──────────────────────────────────────────

VALIDATORS_DIR="$TYREX_HOOKS_DIR/validators"

export TYREX_DIR
export TYREX_HOOK_EVENT="pre-commit"
export TYREX_STAGED_FILES="$STAGED_FILES"

# Pass staged files as input, event type as arg
if ! tyrex_run_validators "$VALIDATORS_DIR" "$STAGED_FILES" "pre-commit"; then
  tyrex_block "Commit blocked by Tyrex validators. Fix issues above or use --no-verify to bypass."
  exit 1
fi

exit 0
