#!/usr/bin/env bash
# ─── CHANGELOG Validation Validator ──────────────────────────
# Pre-commit validator: ensures CHANGELOG.md is updated when
# source code files are committed.
#
# Protocol:
#   - Called by hook runners with args: $1=event_type
#   - Reads TYREX_STAGED_FILES env var (newline-separated)
#   - Exit 0 = allow, Exit 2 = block
#
# Bypass: TYREX_NO_CHANGELOG=1
# ─────────────────────────────────────────────────────────────

# ─── Only run for pre-commit events ─────────────────────────

EVENT="${1:-$TYREX_HOOK_EVENT}"
if [ "$EVENT" != "pre-commit" ]; then
  exit 0
fi

# ─── Bypass check ────────────────────────────────────────────

if [ "${TYREX_NO_CHANGELOG:-0}" = "1" ]; then
  exit 0
fi

# ─── Resolve paths ───────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
HOOKS_DIR="$(dirname "$SCRIPT_DIR")"

source "$HOOKS_DIR/lib/common.sh" 2>/dev/null || exit 0

if [ -z "$TYREX_DIR" ]; then
  exit 0
fi

# ─── Read staged files ───────────────────────────────────────

STAGED="${TYREX_STAGED_FILES:-}"
if [ -z "$STAGED" ]; then
  exit 0
fi

# ─── Check if any source code is staged ──────────────────────

HAS_SOURCE=0
SOURCE_FILES=""

while IFS= read -r file; do
  [ -z "$file" ] && continue
  if tyrex_is_source_file "$file"; then
    HAS_SOURCE=1
    SOURCE_FILES="${SOURCE_FILES}  - $file\n"
  fi
done <<< "$STAGED"

# No source code staged — allow (state/docs/config commits are fine without CHANGELOG)
if [ "$HAS_SOURCE" -eq 0 ]; then
  exit 0
fi

# ─── Check if CHANGELOG is staged ───────────────────────────

if echo "$STAGED" | grep -qE "(^|/)CHANGELOG\.md$"; then
  exit 0  # CHANGELOG is staged — all good
fi

# ─── Block: source code without CHANGELOG ────────────────────

tyrex_block "CHANGELOG.md not updated — source code changes require a CHANGELOG entry"
tyrex_log "Source files staged without CHANGELOG:"
echo -e "$SOURCE_FILES" >&2
tyrex_log "Update docs/CHANGELOG.md or set TYREX_NO_CHANGELOG=1 to bypass"
exit 2
