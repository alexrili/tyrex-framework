---
description: "[DEPRECATED] Use /tyrex-quick --auto-approve instead"
---

# /tyrex-handoff - DEPRECATED

> **This command is deprecated.** Use `/tyrex-quick --auto-approve` instead.

The handoff command was replaced by the redesigned `/tyrex-quick` which now provides a unified `new → plan → do` pipeline with the `--auto-approve` flag for full autopilot mode.

## Migration Guide

| Old command | New equivalent |
|-------------|----------------|
| `/tyrex-handoff` | `/tyrex-quick --auto-approve` |
| `/tyrex-handoff` (with checkpoints) | `/tyrex-quick` (interactive mode) |

## Why deprecated?

- `/tyrex-quick` now covers the entire `new → plan → do` pipeline
- `--auto-approve` flag provides the same autopilot behavior
- `/tyrex-review` now has its own `--do-all` and `--do-critical` flags for the review→fix loop
- Redundant with /tyrex-quick.

## Not sure which command to use?

Run `/tyrex-quick` for the fast-track workflow, or `/tyrex-help` to see all available commands.
