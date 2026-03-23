---
description: "[DEPRECATED] Use /tyrex-quick --auto instead"
---

# /tyrex-handoff - DEPRECATED

You are the Tyrex Framework orchestrator. This command has been deprecated in favor of `/tyrex-quick --auto`.

## Agent Mode

This command is **deprecated** and does not execute. It redirects to `/tyrex-quick --auto`.

> **This command is deprecated.** Use `/tyrex-quick --auto` instead.

The handoff command was replaced by the redesigned `/tyrex-quick` which now provides a unified `new → plan → do` pipeline with the `--auto` flag for full autopilot mode.

## Migration Guide

| Old command | New equivalent |
|-------------|----------------|
| `/tyrex-handoff` | `/tyrex-quick --auto` |
| `/tyrex-handoff` (with checkpoints) | `/tyrex-quick` (interactive mode) |

## Why deprecated?

- `/tyrex-quick` now covers the entire `new → plan → do` pipeline
- `--auto` flag provides the same autopilot behavior
- `/tyrex-review` now has its own `--do-all` and `--do-critical` flags for the review→fix loop
- Redundant with /tyrex-quick.

## Not sure which command to use?

Run `/tyrex-quick` for the fast-track workflow, or `/tyrex-help` to see all available commands.
