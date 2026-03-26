### Next Action Map (command flow suggestions — referenced by all commands at completion)

**Purpose:** Every command, upon completing its work, suggests the next logical action with relevant context pre-loaded. The user confirms or adjusts. This creates a continuous flow where the user never has to remember which command comes next.

**How to use:** At the END of a command (after all steps complete), look up the current command in the map below. Present the suggested next action with context from the current session.

**Format for presenting next actions:**
```
Next step: /tyrex-[command] — [context summary]
  [1] Execute now
  [2] Different command
  [3] Done for now
```

## Command Flow Map

| Current Command | Condition | Suggested Next | Context to include |
|----------------|-----------|---------------|-------------------|
| `/tyrex-new` | Feature spec created | `/tyrex-plan` | "Feature NNN ready for planning — N acceptance criteria defined" |
| `/tyrex-plan` | Plan approved | `/tyrex-do` | "N tasks ready — Wave 1: [task names]" |
| `/tyrex-do` | All tasks completed | `/tyrex-review` | "N/N tasks completed, N commits, N files changed" |
| `/tyrex-do` | Some tasks remain | `/tyrex-do` (continue) | "N/M tasks completed — next: [task name]" |
| `/tyrex-review` | Approved, no findings | `/tyrex-new` or `/tyrex-backlog view` | "Feature NNN done. Backlog: N items ready" |
| `/tyrex-review` | Findings to fix | `/tyrex-review --do-all` | "N findings (C critical, H high) — fix now?" |
| `/tyrex-discuss` | Conclusions reached | `/tyrex-backlog add` or `/tyrex-new` | "Save conclusions to backlog, or start implementing?" |
| `/tyrex-status` | Active feature exists | `/tyrex-do` or `/tyrex-review` | Based on feature progress |
| `/tyrex-status` | No active feature | `/tyrex-backlog view` or `/tyrex-new` | "N backlog items ready. Start one?" |
| `/tyrex-backlog` | Items marked ready | `/tyrex-quick` or `/tyrex-new` | "N items ready for execution" |
| `/tyrex-backlog` | Items still draft | `/tyrex-discuss --backlog BL-NNN` | "Enrich items before marking ready" |
| `/tyrex-quick` | Pipeline complete | `/tyrex-review` | "Feature NNN delivered — N tasks, N commits" |
| `/tyrex-recover` | State recovered | `/tyrex-do` or `/tyrex-status` | Based on recovered state |
| `/tyrex-debug` | Bugs documented | `/tyrex-quick` or `/tyrex-new` | "N bugs found — fix now?" |
| `/tyrex-security-review` | Findings reported | `/tyrex-quick` or `/tyrex-new` | "N security findings — fix now?" |
| `/tyrex-test-review` | Gaps identified | `/tyrex-quick` or `/tyrex-new` | "N coverage gaps — address now?" |
| `/tyrex-init` | Project initialized | `/tyrex-discuss` or `/tyrex-new` | "Explore the project, or start your first feature?" |
| `/tyrex-evolve` | TYREX.md updated | `/tyrex-status` | "Project context updated" |
| `/tyrex-skills` | Skills created/updated | `/tyrex-new` or `/tyrex-status` | "N skills available" |
| `/tyrex-context` | Context ingested | `/tyrex-new` or `/tyrex-plan` | "Context added — ready to use in next feature/plan" |

## Rules
- **Always present next action** — never end a command without suggesting what's next.
- **Include context** — the suggestion must include relevant data from the current session (counts, names, status).
- **Respect the flow** — the map above represents the natural workflow. Deviations are fine (user chooses option 2) but the default should be the logical next step.
- **Backlog awareness** — when suggesting `/tyrex-new`, also mention available backlog items if `.tyrex/backlog/items/` has items with `status: ready`.
