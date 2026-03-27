#!/usr/bin/env bash
# ─── TDD Enforcement Validator ───────────────────────────────
# Pre-commit validator: checks that staged source files have
# corresponding test files. Enforcement level per area from
# tyrex.yml quality.strategy.
#
# Protocol:
#   - Called by hook runners with args: $1=event_type
#   - Reads TYREX_STAGED_FILES env var (newline-separated)
#   - Exit 0 = allow, Exit 2 = block
#
# Bypass: TYREX_NO_TDD_CHECK=1 or commit message contains [no-tdd]
# ─────────────────────────────────────────────────────────────

# ─── Only run for pre-commit events ─────────────────────────

EVENT="${1:-$TYREX_HOOK_EVENT}"
if [ "$EVENT" != "pre-commit" ]; then
  exit 0
fi

# ─── Bypass check ────────────────────────────────────────────

if [ "${TYREX_NO_TDD_CHECK:-0}" = "1" ]; then
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

# ─── Test file conventions ───────────────────────────────────
# Given a source file, find possible test file paths.
# Supports: *.test.ext, *.spec.ext, __tests__/file.ext

find_test_candidates() {
  local file="$1"
  local dir base ext name

  dir="$(dirname "$file")"
  base="$(basename "$file")"
  ext="${base##*.}"
  name="${base%.*}"

  # Same directory conventions
  echo "$dir/$name.test.$ext"
  echo "$dir/$name.spec.$ext"
  echo "$dir/${name}_test.$ext"
  echo "$dir/${name}-test.$ext"

  # __tests__ subdirectory
  echo "$dir/__tests__/$base"
  echo "$dir/__tests__/$name.test.$ext"

  # test/ or tests/ sibling directory
  local parent
  parent="$(dirname "$dir")"
  local subdir
  subdir="$(basename "$dir")"
  echo "$parent/test/$subdir/$base"
  echo "$parent/tests/$subdir/$base"
  echo "$parent/test/$subdir/$name.test.$ext"
  echo "$parent/tests/$subdir/$name.test.$ext"
}

# ─── Detect area from file path ──────────────────────────────

detect_area() {
  local file="$1"
  case "$file" in
    */api/*|*/routes/*|*/controllers/*|*/endpoints/*)  echo "api" ;;
    */workers/*|*/jobs/*|*/queue/*|*/consumers/*)       echo "workers" ;;
    */models/*|*/data/*|*/migrations/*|*/db/*|*/schema/*) echo "data" ;;
    */auth/*|*/security/*|*/crypto/*|*/acl/*)           echo "security" ;;
    */frontend/*|*/components/*|*/views/*|*/pages/*|*/ui/*) echo "frontend" ;;
    */mobile/*|*/ios/*|*/android/*)                     echo "mobile" ;;
    */infra/*|*/docker/*|*/ci/*|*/deploy/*)             echo "infra" ;;
    */docs/*|*/documentation/*)                         echo "docs" ;;
    *)                                                  echo "default" ;;
  esac
}

# ─── Read quality strategy for area ──────────────────────────
# Quality strategy is nested: quality.strategy.area in tyrex.yml.
# tyrex_yaml_get only reads top-level, so we grep for indented fields.

get_strategy() {
  local area="$1"
  local config_file="$TYREX_DIR/tyrex.yml"

  if [ ! -f "$config_file" ]; then
    echo "recommended"
    return
  fi

  # Grep for indented field in strategy section (e.g., "    api: required")
  local strategy
  strategy=$(grep -E "^[[:space:]]+${area}:" "$config_file" 2>/dev/null \
    | head -1 \
    | sed -E 's/^[[:space:]]+[^:]+:[[:space:]]*//' \
    | sed -E 's/[[:space:]]*#.*$//' \
    | sed -E 's/^"(.*)"$/\1/' \
    | sed -E "s/^'(.*)'$/\1/")

  if [ -z "$strategy" ]; then
    # Fallback to default strategy
    strategy=$(grep -E "^[[:space:]]+default:" "$config_file" 2>/dev/null \
      | head -1 \
      | sed -E 's/^[[:space:]]+default:[[:space:]]*//' \
      | sed -E 's/[[:space:]]*#.*$//' \
      | sed -E 's/^"(.*)"$/\1/' \
      | sed -E "s/^'(.*)'$/\1/")
  fi

  echo "${strategy:-recommended}"
}

# ─── Check each staged source file ──────────────────────────

MISSING_REQUIRED=""
MISSING_RECOMMENDED=""
BLOCK=0

while IFS= read -r file; do
  [ -z "$file" ] && continue

  # Skip non-source files
  tyrex_is_source_file "$file" || continue

  # Skip test files themselves
  case "$file" in
    *.test.*|*.spec.*|*_test.*|*-test.*|*/__tests__/*|*/test/*|*/tests/*) continue ;;
  esac

  # Check if any test candidate exists (in staged files OR on disk)
  HAS_TEST=0
  while IFS= read -r candidate; do
    # Check staged files
    if echo "$STAGED" | grep -qF "$candidate"; then
      HAS_TEST=1
      break
    fi
    # Check filesystem
    if [ -f "$candidate" ]; then
      HAS_TEST=1
      break
    fi
  done <<< "$(find_test_candidates "$file")"

  if [ "$HAS_TEST" -eq 0 ]; then
    AREA=$(detect_area "$file")
    STRATEGY=$(get_strategy "$AREA")

    case "$STRATEGY" in
      required)
        MISSING_REQUIRED="${MISSING_REQUIRED}  [BLOCK] $file (area: $AREA, strategy: required)\n"
        BLOCK=1
        ;;
      recommended)
        MISSING_RECOMMENDED="${MISSING_RECOMMENDED}  [WARN]  $file (area: $AREA, strategy: recommended)\n"
        ;;
      optional)
        # Skip silently
        ;;
    esac
  fi
done <<< "$STAGED"

# ─── Report results ──────────────────────────────────────────

if [ -n "$MISSING_RECOMMENDED" ]; then
  tyrex_warn "Source files without tests (recommended):"
  echo -e "$MISSING_RECOMMENDED" >&2
fi

if [ "$BLOCK" -eq 1 ]; then
  tyrex_block "Source files without tests (required — TDD mandatory for this area):"
  echo -e "$MISSING_REQUIRED" >&2
  tyrex_log "Create test files or set TYREX_NO_TDD_CHECK=1 to bypass"
  exit 2
fi

exit 0
