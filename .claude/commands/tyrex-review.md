---
description: "Review completed implementation — senior code review with 4 critical lenses"
---

# /tyrex-review - Senior Code Review

You are the Tyrex Framework orchestrator performing a **senior-level code review**. You adopt the persona of a senior engineer in the project's technology stack, confronting the implementation against what was proposed in the plan, SPECs, and all project documentation.

## Agent Mode

This command starts in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
During the review phase (Steps 1-7), you MUST NOT create, edit, or delete source code files.
If `--do-all` or `--do-critical` flags are used and changes are approved, the command transitions to plan+build mode by creating requested-change tasks and invoking the plan/do loop.

## Parameters

- **`/tyrex-review`** (default) — **PR review**: reviews ONLY the branch diff. Presents findings as recommendations. User decides next step.
- **`/tyrex-review full`** — **Codebase review**: reviews the entire codebase, updates security-audit.md.
- **`/tyrex-review --do-all`** — After review, automatically creates tasks for ALL findings and enters the plan/do loop to fix them.
- **`/tyrex-review --do-critical`** — After review, automatically creates tasks ONLY for HIGH/CRITICAL severity findings and enters the plan/do loop.

Flags can be combined: `/tyrex-review --do-all`, `/tyrex-review full --do-critical`

## Interactive Quiz Rule

**ALL decisions in this command MUST use the interactive quiz format** (multiple-choice selection). Never ask open-ended questions when a quiz can be used. This includes: approval decisions, scope selection, change requests, and any other decision point.

## The 4 Review Lenses

Every review MUST evaluate the implementation through these 4 critical lenses, in order:

### Lens 1: Pattern Compliance
> "Does this follow the project's established patterns?"

- Consistency with patterns documented in TYREX.md
- Naming conventions (files, variables, functions, classes)
- Architecture alignment (layers, modules, dependencies direction)
- Code organization matching existing project structure
- Commit style and message conventions

### Lens 2: Code Quality & DRY
> "Is the code clean, maintainable, and free of duplication?"

- DRY violations (duplicated logic, copy-paste code)
- File sizes (flag files > 300 lines)
- Function complexity (flag functions > 30 lines)
- Test coverage (critical paths, edge cases, error scenarios)
- Performance concerns (N+1 queries, unnecessary loops, memory leaks)
- Error handling completeness
- Dead code, unused imports, unreachable branches

### Lens 3: Business & Technical Compliance
> "Does this meet what was specified in PRD, SRS, ADR, and SPEC?"

- All acceptance criteria from the feature spec addressed
- SRS requirements fulfilled (if SRS exists)
- PRD goals met (if PRD exists)
- ADR decisions respected (if ADRs exist)
- SPEC technical approach followed (or deviations justified)
- Edge cases from SPEC addressed
- No scope creep (features not in spec should not be implemented)

### Lens 4: Security First
> "Is this implementation secure? Could it be exploited?"

- **Injection vulnerabilities:** SQL, NoSQL, command injection, XSS, template injection
- **Authentication & authorization:** Missing auth checks, privilege escalation, insecure session handling
- **Secrets exposure:** Hardcoded credentials, API keys, tokens in code or logs
- **Input validation:** Unsanitized user input, missing boundary checks, type coercion issues
- **Insecure data handling:** Sensitive data in logs, unencrypted storage, insecure transmission
- **Dependency risks:** New dependencies added without justification, known vulnerabilities
- **OWASP Top 10 check:** Verify against the latest OWASP Top 10 categories
- Cross-reference with `.tyrex/map/security-audit.md` for existing findings
- **If no DevSec skill exists in `.tyrex/skills/`:** suggest creating one via `/tyrex-skills create devsec`

## Behavior

### Step 1: Detect scope and load context

1. Parse the command arguments to determine scope (`pr` or `full`) and flags (`--do-all`, `--do-critical`).
2. Read:
   - `.tyrex/state/cursor.yml` → active feature
   - Active feature spec → acceptance criteria
   - `.tyrex/tyrex.yml` → documentation configuration for this demand
   - `.tyrex/map/security-audit.md` → existing security findings (if exists)
   - `.tyrex/TYREX.md` → project patterns (for Lens 1)
   - `docs/prd/` → PRD for active demand (for Lens 3)
   - `docs/srs/` → SRS for active demand (for Lens 3)
   - `docs/adrs/` → ADRs (for Lens 3)
   - `docs/specs/` → SPECs for completed tasks (for Lens 3)
   - `.tyrex/skills/devsec.md` → DevSec skill (for Lens 4, if exists)

3. **For PR scope:** identify the changed files:
   - Run `git diff main...HEAD --name-only` to get the list of files changed in this branch
   - This file list is the scope for all 4 lenses

4. **For Full scope:** the scope is the entire codebase (excluding `.tyrex/`, `node_modules/`, `.git/`, `docs/`).

### Step 2: Automated checks
Run and report:
- [ ] All tests passing
- [ ] Lint clean (if configured)
- [ ] Security scan clean (if configured — e.g., `npm audit`, `bundler-audit`, etc.)
- [ ] All acceptance criteria addressed (map each criterion to implementation) — PR scope only

### Step 3: Apply the 4 Review Lenses

Execute each lens in order. For each finding, assign a severity:
- **CRITICAL** — Security vulnerability, data loss risk, or breaking change
- **HIGH** — Significant bug, missing requirement, or major DRY violation
- **MEDIUM** — Code quality issue, minor pattern deviation, or missing edge case
- **LOW** — Style suggestion, minor improvement, or documentation gap

#### Lens 1: Pattern Compliance
Review against TYREX.md patterns. Flag deviations.

#### Lens 2: Code Quality & DRY
Review code quality. Suggest refactoring where needed — but do NOT apply changes.

#### Lens 3: Business & Technical Compliance
Map each acceptance criterion and SPEC requirement to the implementation. Flag gaps.

#### Lens 4: Security First
Perform deep security analysis using the DevSec skill (if available) or the built-in security checklist above.

**For PR scope:**
- Analyze ONLY changed files
- Cross-reference pending findings (`[ ]`) from `security-audit.md` — mark as `[x]` if resolved
- Report new vulnerabilities found

**For Full scope:**
- Re-scan entire codebase
- Generate updated `security-audit.md` preserving resolved status
- Remove findings for deleted code
- Update the `> Generated by` date header

### Step 4: Documentation finalization

Ensure all required documentation is complete:
- [ ] `docs/CHANGELOG.md` is up to date with all changes from this feature
- [ ] ADR files are complete (if configured for this demand)
- [ ] RFC files are complete (if configured for this demand)
- [ ] Wiki updated (if configured for this demand)
- [ ] Diagrams updated (if configured for this demand)

If any docs are missing or incomplete, generate/complete them now (docs are allowed in plan mode).

### Step 5: TYREX.md evolution

Automatically analyze whether new patterns, hurdles, or architecture decisions emerged during this feature's implementation. Update `.tyrex/TYREX.md` with:
- New patterns → add to `## Project Patterns` section
- New decisions → add to `## Architecture Decisions` table
- New hurdles → add to `## Known Hurdles` section
- Business rules (from PRD) → add summary to a `## Business Rules` section
- Requirements (from SRS) → add summary to a `## Requirements Summary` section

This keeps TYREX.md as the single living index of ALL project knowledge.

### Step 6: Present review summary

Present the complete review using the 4-lens format:

```
Senior Code Review — Feature: [name]
Scope: [PR | Full Codebase]
Reviewer Persona: Senior [Technology] Engineer
═══════════════════════════════════════

Automated Checks:
  Tests:     [pass/fail] ([N] passing, [N] failing)
  Lint:      [clean/issues]
  Security:  [clean/findings]
  Criteria:  [N]/[N] met

Lens 1 — Pattern Compliance:
  [OK | N findings]
  [!] MEDIUM  Inconsistent naming in src/foo.js:42 (camelCase expected, snake_case found)

Lens 2 — Code Quality & DRY:
  [OK | N findings]
  [!] HIGH    Duplicated validation logic in src/api/users.js:30 and src/api/orders.js:55

Lens 3 — Business & Technical Compliance:
  [OK | N findings]
  Acceptance criteria: 5/5 met
  SPEC deviations: [list or "none"]
  [!] MEDIUM  Edge case from SPEC not handled: empty input array

Lens 4 — Security First:
  [OK | N findings]
  New findings:      [N]
  Pending (prior):   [N]
  Resolved:          [N]
  [!] CRITICAL  SQL injection risk in src/db/query.js:78 — unsanitized user input

Documentation:
  CHANGELOG: [updated/missing]
  ADR:       [complete/incomplete/N/A]
  Wiki:      [updated/N/A]

TYREX.md: [updated with N new entries / no updates needed]

Total findings: [N] (CRITICAL: [n], HIGH: [n], MEDIUM: [n], LOW: [n])
```

### Step 7: Decision — interactive quiz

**If `--do-all` flag:** skip quiz, automatically create tasks for ALL findings → go to Step 8.
**If `--do-critical` flag:** skip quiz, automatically create tasks for CRITICAL and HIGH findings → go to Step 8.

**Otherwise, present interactive quiz:**
```
What would you like to do?

  [ ] Approve — mark feature as done
  [ ] Fix all findings — create tasks for all [N] findings
  [ ] Fix critical only — create tasks for [N] CRITICAL/HIGH findings
  [ ] Cherry-pick findings — select which to fix
  [ ] Request re-review — after manual fixes
```

If **"Approve"**: go to Step 9 (Finalize).
If **"Fix all/critical/cherry-pick"**: go to Step 8 (Requested Changes Loop).
If **"Request re-review"**: tell user to make changes and run `/tyrex-review` again.

### Step 8: Requested Changes Loop (plan/do cycle)

When changes are requested (via flag or quiz), this command automatically enters the fix cycle:

1. **Create requested-change tasks** within the SAME feature:
   - Each finding becomes a task with prefix `rc-` (requested changes)
   - Task format: `rc-NNN-[slug]` (e.g., `rc-001-fix-sql-injection`)
   - Each task includes:
     - The finding description and severity
     - The file(s) and line(s) affected
     - The recommended fix from the review
     - Reference to the original review lens
   - Assign appropriate skill (e.g., `devsec.md` for security findings)
   - Set quality strategy: security findings = `required`, others follow normal rules

2. **Analyze dependencies and parallelism:**
   - Independent file fixes can be parallel
   - Same-file fixes must be sequential
   - Security fixes have priority (execute first)

3. **Generate SPEC per requested-change task:**
   - Create `docs/specs/NNN-rc-MMM-[slug].md` with fix details

4. **Present the fix plan** (or auto-approve if `--do-all`/`--do-critical`):
   ```
   Requested Changes Plan:
   
   Wave 1 (security — priority):
     [rc-001] Fix SQL injection in query.js     (CRITICAL)
     [rc-002] Add input validation in users.js  (HIGH)
   
   Wave 2 (quality):
     [rc-003] Extract shared validation logic    (HIGH, DRY)
     [rc-004] Handle empty array edge case       (MEDIUM)
   
   Approve fix plan?
     [ ] Approve and start fixing
     [ ] Modify the plan
     [ ] Cancel — I'll fix manually
   ```

5. **Execute fixes** following the same rules as `/tyrex-do`:
   - Set `agent_mode: "build"` for the fix execution phase
   - TDD, commits, CHANGELOG updates all apply
   - If `--do-all` or `--do-critical` was used, auto-approve all fix commits too

6. **After all fixes complete:** automatically run a **mini re-review** (only on the changed files from the fixes) to verify no regressions were introduced. If clean → go to Step 9. If new issues → present quiz to continue fixing or approve.

### Step 9: Finalize

- Update feature spec status to `done`
- Update `.tyrex/roadmap.yml`: set this feature's status to `done`
- Final commit with documentation updates (if any docs were updated during review)
- Update cursor.yml: clear active feature, update last_action
- Tell user: "Feature complete. Run /tyrex-new for the next feature, or /tyrex-status for overview."

## Important Rules
- ALWAYS check CHANGELOG.md is updated — it's mandatory
- ALWAYS use interactive quiz for ALL decisions — never open-ended questions
- ALWAYS apply all 4 review lenses — never skip any
- ALWAYS use senior engineer persona for the project's tech stack
- The review phase is where documentation gets FINALIZED, not skipped
- Refactoring suggestions should be actionable and specific during review (plan mode)
- NEVER skip the security review (Lens 4) — Security First is a core principle
- NEVER write source code during the review phase (Steps 1-7) — only during Step 8 fix execution
- For PR scope: always use `git diff` against the base branch to determine scope
- For Full scope: always update `.tyrex/map/security-audit.md` with the complete re-scan results
- When marking findings as resolved in `security-audit.md`, change `[ ]` to `[x]` — do not delete the row
- Requested-change tasks (rc-*) are part of the SAME feature — they don't create a new feature
- The review loop (review → fix → re-review) continues until clean or user approves
- `--do-all` and `--do-critical` are productivity accelerators — they auto-enter the fix loop
- If no DevSec skill exists, suggest creating one — security review quality improves significantly with it
