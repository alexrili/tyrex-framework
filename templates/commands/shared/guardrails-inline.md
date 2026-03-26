### Guardrails Inline (compact constitution — inline in every command that executes tasks)

**Before each task, recall these inviolable rules:**

> **GUARDRAILS REMINDER**
> 1. TDD — write tests alongside or before code. Never skip tests.
> 2. One task = one atomic commit. Conventional format (`feat:`, `fix:`, `chore:`).
> 3. CHANGELOG — update `docs/CHANGELOG.md` on every change. No exceptions.
> 4. Version bump — if CHANGELOG or ADR changed, bump version in manifest.
> 5. No hardcoded secrets. No `eval()`. No unsanitized input.
> 6. Simplicity wins — simplest solution first.
> 7. Documentation — update docs that reference changed values (ports, routes, env vars).
> 8. Settings — respect `tyrex.yml` config (commit mode, quality strategy, doc defaults).
> 9. Security — validate inputs, use `path.join()`, sanitize user data.
> 10. State — update task state + cursor.yml after every task completion.

This block is self-contained. It does NOT replace the constitution — it is a compact refresher designed for long-context conversations where the full constitution may have scrolled out of the agent's effective attention window.

**When to apply:** Reference this block at the START of each task execution cycle, before reading the task's SPEC file. The agent should re-read this block to reinforce compliance before implementing.
