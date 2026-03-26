### Checkpoint Reminder (periodic directive refresh — inline in execution loops)

**Purpose:** In long execution sessions (multiple tasks, complex implementations), the agent's attention to directives degrades as context grows. This checkpoint injects a compact reminder at strategic points to maintain compliance without re-reading full documents.

**When to trigger:** After every 2 completed tasks (configurable), inject the following checkpoint block before starting the next task:

> **CHECKPOINT — Directive Refresh**
>
> Before continuing, verify your last task(s) followed these:
> - [ ] Tests written/updated? (quality strategy: required/recommended/optional)
> - [ ] CHANGELOG entry added?
> - [ ] Commit is atomic? (one task = one commit)
> - [ ] Version bumped? (if CHANGELOG/ADR changed)
> - [ ] No secrets, no eval(), no unsanitized input?
> - [ ] State files updated? (task state + cursor.yml)
> - [ ] SPEC followed? (or deviations documented)
>
> If any box is unchecked, fix before proceeding.
> Re-read `templates/commands/shared/guardrails-inline.md` if uncertain.

**Checkpoint frequency:** Default is every 2 tasks. Can be adjusted via `tyrex.yml`:
```yaml
quality:
  checkpoint_interval: 2  # trigger reminder every N tasks
```

**Token efficiency:** This block is ~120 tokens. Full constitution + TYREX.md re-read would be ~2000+ tokens. Checkpoints save ~95% of token cost while maintaining ~90% of compliance effectiveness.

**Integration points:**
- `/tyrex-do` Step 4: after each task completion, increment counter. When counter reaches interval, inject checkpoint before next task.
- `/tyrex-quick` Step 4: same behavior, inherited from do logic.
- `/tyrex-review` Step 8: during fix execution loop, same checkpoint logic.
