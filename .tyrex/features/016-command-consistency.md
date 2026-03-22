# Feature 016: Command Consistency & Agent-Agnosticism

## Objective
Ensure all commands are agent-agnostic, structurally consistent, support multi-demand workflows, and clearly communicate the two workflow paths (chain vs quick).

## Acceptance Criteria
- ADF sections in 7 commands no longer hardcode agent names (Claude Code, OpenCode, Cursor, Codex)
- tyrex-do and tyrex-review no longer hardcode skill lookup/sync paths
- All 22 commands have consistent section structure (Agent Mode, ADF where applicable, Behavior, Important Rules)
- cursor.yml redesigned: per-feature state in `.tyrex/state/features/NNN.yml`, global cursor retains only cross-feature metadata
- Commands resolve feature context via branch detection (`feat/NNN-*`) with `--feature NNN` override
- Multiple features can be open simultaneously (different branches, different terminals)
- /tyrex-help clearly shows the two paths: chain (new→plan→do→review) vs fast-lane (quick)
- /tyrex-status shows all open features, not just the active one
- ADR-011 documents the multi-demand model

## Out of Scope
- Changes to bin/tyrex.js (CLI scaffolding logic)
- New skill creation
- Changes to skill file content

## Skills
- copywriter (UX text consistency)
- product-manager (workflow clarity)

## Tasks
1. Define multi-demand state model (sequential)
2. Agent-agnostic ADF text — 7 commands (sequential, after 1)
3. Remove hardcoded skill paths — do+review (parallel, after 2)
4. Multi-demand — new+plan (parallel, after 2)
5. Multi-demand — do+resume (sequential, after 3)
6. Multi-demand — status+help (parallel, after 2)
7. Structural audit — all 22 commands (sequential, after 3-6)
8. Sync + CHANGELOG + version (sequential, after 7)

## Status: planned
