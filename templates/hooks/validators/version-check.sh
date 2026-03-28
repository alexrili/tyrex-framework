#!/usr/bin/env bash
# ─── Version Bump Validation Validator ───────────────────────
# Pre-commit validator: warns when CHANGELOG.md or ADR files are
# staged without a version bump in the package manifest.
#
# WARN ONLY — never blocks (exit 0 always). Human decides version.
#
# Protocol:
#   - Called by hook runners with args: $1=event_type
#   - Reads TYREX_STAGED_FILES env var (newline-separated)
#   - Exit 0 = allow (always — this validator only warns)
# ─────────────────────────────────────────────────────────────

# ─── Only run for pre-commit events ─────────────────────────

EVENT="${1:-$TYREX_HOOK_EVENT}"
if [ "$EVENT" != "pre-commit" ]; then
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

# ─── Check if CHANGELOG or ADR files are staged ─────────────

HAS_CHANGELOG=0
HAS_ADR=0

while IFS= read -r file; do
  [ -z "$file" ] && continue
  case "$file" in
    *CHANGELOG.md|*CHANGELOG.MD) HAS_CHANGELOG=1 ;;
    *adrs/*.md|*adrs/*.MD)       HAS_ADR=1 ;;
  esac
done <<< "$STAGED"

# No CHANGELOG or ADR changes — nothing to check
if [ "$HAS_CHANGELOG" -eq 0 ] && [ "$HAS_ADR" -eq 0 ]; then
  exit 0
fi

# ─── Check if a manifest is staged ──────────────────────────

HAS_MANIFEST=0

while IFS= read -r file; do
  [ -z "$file" ] && continue
  case "$file" in
    *package.json|*composer.json|*pyproject.toml|*Cargo.toml|*setup.py|*setup.cfg|*build.gradle*|*pom.xml)
      HAS_MANIFEST=1
      break
      ;;
  esac
done <<< "$STAGED"

if [ "$HAS_MANIFEST" -eq 1 ]; then
  exit 0  # Manifest staged — version bump likely included
fi

# ─── Find project manifest and current version ──────────────

PROJECT_DIR="$(dirname "$TYREX_DIR")"
MANIFEST=""
VERSION=""

for manifest in package.json composer.json pyproject.toml Cargo.toml; do
  local_path="$PROJECT_DIR/$manifest"
  if [ -f "$local_path" ]; then
    MANIFEST="$manifest"
    case "$manifest" in
      package.json|composer.json)
        VERSION=$(grep -E '"version"' "$local_path" 2>/dev/null \
          | head -1 \
          | sed -E 's/.*"version"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')
        ;;
      pyproject.toml)
        VERSION=$(grep -E '^version' "$local_path" 2>/dev/null \
          | head -1 \
          | sed -E 's/version[[:space:]]*=[[:space:]]*"([^"]+)".*/\1/')
        ;;
      Cargo.toml)
        VERSION=$(grep -E '^version' "$local_path" 2>/dev/null \
          | head -1 \
          | sed -E 's/version[[:space:]]*=[[:space:]]*"([^"]+)".*/\1/')
        ;;
    esac
    break
  fi
done

# No manifest found — skip silently (AC5)
if [ -z "$MANIFEST" ]; then
  exit 0
fi

# ─── Warn: CHANGELOG/ADR changed without version bump ───────

TRIGGER=""
[ "$HAS_CHANGELOG" -eq 1 ] && TRIGGER="CHANGELOG.md"
[ "$HAS_ADR" -eq 1 ] && TRIGGER="${TRIGGER:+$TRIGGER + }ADR"

tyrex_warn "Version bump may be needed — $TRIGGER changed but $MANIFEST not staged"
tyrex_log "Current version: $VERSION (in $MANIFEST)"
tyrex_log "Consider bumping: feat→minor, fix→patch, BREAKING→major"

# Always allow — warn only
exit 0
