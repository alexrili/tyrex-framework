#!/usr/bin/env bash
# ─── Tyrex Hook Library ─────────────────────────────────────
# Shared functions for all Tyrex hooks. Source this file:
#   source "$(dirname "$0")/lib/common.sh"
#
# Zero external dependencies — uses jq if available, Node.js fallback.
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# ─── Constants ───────────────────────────────────────────────

TYREX_DIR=""
TYREX_HOOKS_DIR=""

# ─── JSON Parsing ────────────────────────────────────────────

# Parse a JSON field from a string.
# Usage: tyrex_json_get "$json_string" '.field.path'
tyrex_json_get() {
  local json="$1" path="$2"
  if command -v jq &>/dev/null; then
    echo "$json" | jq -r "$path // empty" 2>/dev/null
    return
  fi
  # Node.js fallback (guaranteed by framework — Node >= 18)
  node -e "
    const d = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
    const keys = process.argv[1].replace(/^\\./, '').split('.');
    let v = d;
    for (const k of keys) { v = v?.[k]; }
    if (v != null) process.stdout.write(String(v));
  " "$path" <<< "$json"
}

# ─── Project Detection ───────────────────────────────────────

# Find the .tyrex directory, searching up from CWD.
# Sets TYREX_DIR and TYREX_HOOKS_DIR. Returns 1 if not found.
tyrex_find_project() {
  local dir="${1:-$(pwd)}"
  while [ "$dir" != "/" ]; do
    if [ -d "$dir/.tyrex" ]; then
      TYREX_DIR="$dir/.tyrex"
      TYREX_HOOKS_DIR="$dir/.tyrex/hooks"
      return 0
    fi
    dir="$(dirname "$dir")"
  done
  return 1
}

# ─── YAML Reading (lightweight) ──────────────────────────────

# Read a simple top-level YAML field (key: value).
# Does NOT handle nested objects or arrays — only flat fields.
# Usage: tyrex_yaml_get "/path/to/file.yml" "field_name"
tyrex_yaml_get() {
  local file="$1" key="$2"
  if [ ! -f "$file" ]; then
    return 1
  fi
  # Match: key: "value" or key: value (strip comments first, then quotes)
  grep -E "^${key}:" "$file" 2>/dev/null \
    | head -1 \
    | sed -E "s/^${key}:[[:space:]]*//" \
    | sed -E 's/[[:space:]]*#.*$//' \
    | sed -E 's/^"(.*)"$/\1/' \
    | sed -E "s/^'(.*)'$/\1/"
}

# ─── Validator Discovery ─────────────────────────────────────

# Run all executable validators in a directory.
# Each validator receives the same stdin and args.
# Returns 0 if all pass, 2 if any blocks.
#
# Usage: tyrex_run_validators "/path/to/validators" "$input" "$@"
tyrex_run_validators() {
  local validators_dir="$1"
  local input="$2"
  shift 2

  if [ ! -d "$validators_dir" ]; then
    return 0
  fi

  local blocked=0
  local block_reasons=""

  for validator in "$validators_dir"/*.sh; do
    [ -x "$validator" ] || continue
    [ -f "$validator" ] || continue

    local output
    local exit_code=0
    output=$(echo "$input" | "$validator" "$@" 2>&1) || exit_code=$?

    if [ "$exit_code" -eq 2 ]; then
      blocked=1
      block_reasons="${block_reasons}${output}\n"
    fi
  done

  if [ "$blocked" -eq 1 ]; then
    echo -e "$block_reasons" >&2
    return 2
  fi

  return 0
}

# ─── Logging ─────────────────────────────────────────────────

tyrex_log() {
  echo "[tyrex-hook] $*" >&2
}

tyrex_warn() {
  echo "[tyrex-hook] WARNING: $*" >&2
}

tyrex_block() {
  echo "[tyrex-hook] BLOCKED: $*" >&2
}

# ─── File Classification ─────────────────────────────────────

# Check if a file path is a source code file (not config/docs/state).
# Returns 0 if source code, 1 if not.
tyrex_is_source_file() {
  local file_path="$1"

  # State/config files — NOT source code
  case "$file_path" in
    */.tyrex/*|*/docs/*|*/.claude/*|*/.opencode/*|*/.cursor/*|*/.codex/*)
      return 1 ;;
    */CLAUDE.md|*/AGENTS.md|*/README.md)
      return 1 ;;
  esac

  # Check by extension
  case "$file_path" in
    *.md|*.yml|*.yaml|*.json|*.toml|*.ini|*.cfg|*.conf)
      return 1 ;;
    *.js|*.ts|*.jsx|*.tsx|*.py|*.go|*.java|*.rb|*.rs|*.c|*.cpp|*.h|*.hpp)
      return 0 ;;
    *.sh|*.bash|*.zsh|*.fish)
      return 0 ;;
    *.css|*.scss|*.less|*.html|*.svelte|*.vue)
      return 0 ;;
    *.sql|*.graphql|*.proto)
      return 0 ;;
  esac

  # Default: treat as source if it has no extension or unknown extension
  return 0
}

# ─── Init ────────────────────────────────────────────────────

# Auto-detect project on source
if [ -n "${CLAUDE_PROJECT_DIR:-}" ]; then
  tyrex_find_project "$CLAUDE_PROJECT_DIR" 2>/dev/null || true
elif [ -n "${CLAUDE_CWD:-}" ]; then
  tyrex_find_project "$CLAUDE_CWD" 2>/dev/null || true
else
  tyrex_find_project 2>/dev/null || true
fi
