# SPEC: Task 001 — Create shared doc-impact-analysis.md algorithm

## Feature
021 — Quick Rewrite & Doc Impact Analysis

## Objective
Create the shared algorithm file `templates/commands/shared/doc-impact-analysis.md` that defines how to scan project documentation for inconsistencies against code changes.

## Technical Approach
Follow the same pattern as `crash-detection.md` and `external-tracker-sync.md` — a reusable algorithm referenced by multiple commands.

The algorithm defines:
1. **Scan targets** (3 categories):
   - Project docs: README.md, docs/wiki/*, OpenAPI/Swagger specs, docs/diagrams/*
   - Framework docs: .tyrex/TYREX.md, .tyrex/constitution.md
   - Config files: docker-compose*, .env.example, Dockerfile, nginx.conf, Makefile

2. **Match patterns** against `files_changed` diffs:
   - Ports: numeric values like `3000`, `8080` that appear in both code and docs
   - Routes/URLs: path patterns `/api/*`, `localhost:*`
   - Env vars: `UPPER_SNAKE_CASE` patterns that appear in code and docs
   - CLI commands: `tyrex *`, `npm *`, `yarn *` etc.
   - Config values: key-value pairs that changed

3. **Input/Output contract:**
   - Input: `files_changed` list with diffs
   - Output: list of `{doc_file, line_number, matched_value, category}` inconsistencies
   - Action directive: create fix task(s) automatically

4. **Integration instructions** — where each command calls this algorithm and what action it takes

## Constraints
- File MUST be under 100 lines (NFR-3 from SRS)
- No fuzzy matching — specific grep-able patterns only
- Must be lightweight (< 5s scan time)

## Files Affected
- `templates/commands/shared/doc-impact-analysis.md` (new)

## Testing Strategy
Not applicable (markdown prompt file, no executable code).
