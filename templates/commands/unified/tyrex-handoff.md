---
description: "[DEPRECATED] Use /tyrex-quick --auto-approve instead"
---

# /tyrex-handoff - DEPRECATED

> **This command has been deprecated.** Use `/tyrex-quick --auto-approve` instead.

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
- Having two commands that do the same thing adds confusion without value

## If you're here by accident

Run `/tyrex-quick` for the fast-track workflow, or `/tyrex-help` to see all available commands.
