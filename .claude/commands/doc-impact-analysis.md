## Doc Impact Analysis

**Commands that modify code or configuration MUST run this analysis to detect documentation drift.**

Integrated into: `/tyrex-plan` (predictive), `/tyrex-do` (post-implementation), `/tyrex-review` (Lens 6).

### When to Include

- `/tyrex-plan` — after task decomposition, before execution graph. Mode: **predictive** (scan planned files).
- `/tyrex-do` — after all tasks complete, before completion summary. Mode: **actual** (scan real diffs).
- `/tyrex-review` — as Lens 6: Documentation Consistency. Mode: **actual** (scan branch diff).
- `/tyrex-quick` — inherits from plan/do/review since it delegates to them.

### Scan Targets (3 categories)

**Category 1 — Project docs:**
- `README.md` (and `README*.md` variants)
- `docs/wiki/*`
- OpenAPI/Swagger files: `openapi.yml`, `openapi.yaml`, `openapi.json`, `swagger.*`, `docs/api/*`
- `docs/diagrams/*`

**Category 2 — Framework docs:**
- `.tyrex/TYREX.md`
- `.tyrex/constitution.md`

**Category 3 — Config files:**
- `docker-compose*.yml`, `docker-compose*.yaml`
- `.env.example`, `.env.sample`, `.env.template`
- `Dockerfile`, `Dockerfile.*`
- `nginx.conf`, `nginx/*.conf`
- `Makefile`
- Any file explicitly referenced in README setup/install instructions

### Match Patterns

For each file in `files_changed`, extract values that may appear in documentation:

| Category | Pattern | Example |
|----------|---------|---------|
| Ports | Numeric port values that changed (old → new) | `3000` → `3008` |
| Routes | URL path patterns that changed | `/api/v1/users` → `/api/v2/users` |
| Env vars | `UPPER_SNAKE_CASE` names added, removed, or renamed | `DATABASE_URL` → `DB_URL` |
| CLI commands | Command-line invocations that changed | `tyrex init` → `tyrex setup` |
| Config values | Key-value pairs with changed values | `port: 3000` → `port: 3008` |
| Function/class names | Public API names that changed (renamed, removed) | `createUser()` → `registerUser()` |

### Algorithm

**Step 1: Extract changes** — from `files_changed` diffs, build a list of `{old_value, new_value, category}` tuples.

**Step 2: Scan docs** — for each scan target file that exists, grep for `old_value` occurrences.

**Step 3: Report** — for each match, emit: `{doc_file, line_number, matched_value, category, suggestion}`.

**Step 4: Action** — depends on the calling command:

| Command | Action when inconsistencies found |
|---------|----------------------------------|
| `/tyrex-plan` | Add a "Documentation consistency update" task as the LAST task. Quality: optional. |
| `/tyrex-do` | Create and execute fix task(s) automatically before completion summary. |
| `/tyrex-review` | Report as findings. Severity: `medium` (docs) or `high` (config files). Feed into --do-all/--do-critical. |

### Predictive Mode (for /tyrex-plan)

In predictive mode, exact diffs are not available. Instead:
1. Read the list of `Files` from each proposed task
2. Read the current content of those files
3. Based on the task SPEC, identify likely changes (ports, routes, env vars mentioned in the SPEC)
4. Scan docs for those values
5. If matches found, the doc update task covers them

### Important Rules

- NEVER block the workflow — inconsistencies are actionable, not blockers (except in /tyrex-do where fix tasks run before closing)
- NEVER fuzzy-match — only grep for exact values from the diff
- Config file drift (Category 3) is HIGH severity — these break deployments
- Doc drift (Categories 1-2) is MEDIUM severity — these cause confusion
- If no scan targets exist (no README, no wiki, no OpenAPI), skip silently
- Scan MUST complete in under 5 seconds — no deep AST parsing, just grep
