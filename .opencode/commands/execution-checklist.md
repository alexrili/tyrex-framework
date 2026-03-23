### Execution Checklist (canonical rules — inline in every command that executes tasks)

For EACH task, execute this sequence:

1. **Load SPEC** — read the task's SPEC file from `docs/specs/`. Use Technical Approach to guide implementation.
2. **Load skill** — if the task has a `skill` attribute, read the skill file from `.tyrex/skills/<name>.md`. Apply its Role, Guidelines, and Patterns during implementation. Use its Review Criteria as a self-check before marking complete.
3. **Checkpoint: task start** — update the per-feature state file: set `current_task_in_progress`, `in_progress_since`, `in_progress_files_touched: []`.
4. **Implement following quality strategy:**
   - `required`: TDD — write tests first, implement, tests MUST pass
   - `recommended`: write tests alongside code, warn if skipped
   - `optional`: default to writing tests in `--auto` mode
5. **Checkpoint: files touched** — after each file write, append path to `in_progress_files_touched`.
6. **On success — pre-commit sequence:**
   a. Update task state to `completed` with `files_changed` and output
   b. **Resolve audit findings** — if task has `security` attribute: read `.tyrex/security/audit.md`, match `files_changed` to pending findings, flip `[ ]` to `[x]` with date
   c. Prepare commit message (conventional format)
   d. **Update CHANGELOG** — mandatory for every task
   e. **Version bump check** — if CHANGELOG or ADR changed: detect package manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, etc.), read current version, suggest semver bump (feat→minor, fix→patch, BREAKING→major), auto-accept in `--auto` mode, validate semver format, propagate version to all referencing files, stage alongside task changes
   f. **Run tests before commit** — detect test runner stack-agnostically:

      | Manifest | Test command |
      |----------|-------------|
      | `package.json` | `scripts.test` (if not default) → `npm test` or `yarn test` |
      | `pyproject.toml` | `[tool.pytest]` → `pytest` |
      | `Makefile` | `test:` target → `make test` |
      | `Cargo.toml` | `cargo test` |
      | `go.mod` | `go test ./...` |
      | `mix.exs` | `mix test` |
      | `build.gradle` | `./gradlew test` |
      | `pom.xml` | `mvn test` |
      | `Gemfile` | `bundle exec rspec` or `bundle exec rake test` |
      | `composer.json` | `scripts.test` → `composer test` |
      | `deno.json` | `deno test` |
      | `bun.lockb` | `bun test` |

      - If tests fail + `--auto`: retry once, then mark task `failed`
      - If tests fail + interactive: present fix/skip/abort choices
      - If no test runner: skip with note in `--auto`, ask in interactive
   g. **Commit** — auto in `--auto` mode, present diff+message for approval otherwise
   h. **Checkpoint: task complete** — clear `current_task_in_progress`, `in_progress_since`, `in_progress_files_touched` from per-feature state. Update `last_task_completed`, `tasks_summary`.
   i. **Auto-update TYREX.md** — if ADR/PRD/SRS generated, add summary to appropriate section
7. **On failure:** clear checkpoint fields, update task state to `failed`. In `--auto`: retry up to 3 times. Interactive: present fix/skip/stop choices.
