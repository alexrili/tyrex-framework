#!/usr/bin/env bash
# ─── Semantic Commit Validator ───────────────────────────────
# Commit-msg validator: ensures commit messages follow the
# conventional commits format with Tyrex-specific prefixes.
#
# Protocol:
#   - Called by hook runners with args: $1=event_type
#   - Reads TYREX_COMMIT_MSG env var
#   - Exit 0 = allow, Exit 2 = block
#
# Bypass: TYREX_NO_COMMIT_LINT=1
# ─────────────────────────────────────────────────────────────

# ─── Only run for commit-msg events ─────────────────────────

EVENT="${1:-$TYREX_HOOK_EVENT}"
if [ "$EVENT" != "commit-msg" ]; then
  exit 0
fi

# ─── Bypass check ────────────────────────────────────────────

if [ "${TYREX_NO_COMMIT_LINT:-0}" = "1" ]; then
  exit 0
fi

# ─── Resolve paths ───────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
HOOKS_DIR="$(dirname "$SCRIPT_DIR")"

source "$HOOKS_DIR/lib/common.sh" 2>/dev/null || exit 0

if [ -z "$TYREX_DIR" ]; then
  exit 0
fi

# ─── Read commit message ─────────────────────────────────────

COMMIT_MSG="${TYREX_COMMIT_MSG:-}"
if [ -z "$COMMIT_MSG" ]; then
  # Try reading from stdin (fallback)
  COMMIT_MSG=$(cat 2>/dev/null || echo "")
fi

if [ -z "$COMMIT_MSG" ]; then
  exit 0  # No message — can't validate, allow
fi

# Get first line only (subject)
SUBJECT=$(echo "$COMMIT_MSG" | head -1)

# ─── Skip merge commits and special commits ──────────────────

case "$SUBJECT" in
  Merge*|Revert*|Initial\ commit*|initial\ commit*)
    exit 0 ;;
esac

# ─── Validate conventional commit format ─────────────────────

# Standard prefixes
STANDARD="feat|fix|chore|docs|refactor|test|style|perf|ci|build|revert"

# Tyrex-specific prefixes (from git-semantic-commits.md)
TYREX="backlog|discuss|plan|evolve|context|security|debug|verify|ship|milestone|workstream"

# Combined pattern: type[(scope)][!]: description
PATTERN="^(${STANDARD}|${TYREX})(\(.+\))?\!?: .+"

if echo "$SUBJECT" | grep -Eq "$PATTERN"; then
  exit 0  # Valid format
fi

# ─── Invalid format — block ──────────────────────────────────

tyrex_block "Commit message does not follow conventional commits format"
tyrex_log "Got: $SUBJECT"
tyrex_log ""
tyrex_log "Expected format: type(scope): description"
tyrex_log "  type:  feat | fix | chore | docs | refactor | test | style | perf | ci | build | revert"
tyrex_log "         backlog | discuss | plan | evolve | context | security | debug | verify | ship"
tyrex_log "  scope: optional, e.g. (auth), (api), (040)"
tyrex_log "  !:     optional breaking change indicator"
tyrex_log ""
tyrex_log "Examples:"
tyrex_log '  feat(040): add hook infrastructure'
tyrex_log '  fix: resolve path validation bug'
tyrex_log '  backlog: add BL-028 — hooks infrastructure'
tyrex_log '  feat!: breaking change in API'
tyrex_log ""
tyrex_log "Set TYREX_NO_COMMIT_LINT=1 to bypass"
exit 2
