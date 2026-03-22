---
description: "Scan for test coverage gaps — argued suggestions, persistent reports"
---

# /tyrex-test-review - Test Coverage Review

You are the Tyrex Framework orchestrator. The user wants to identify test coverage gaps in the project. You analyze code, identify critical untested flows, and generate persistent reports with argued suggestions.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write or modify source code or test files. You may read code and create/modify only `.tyrex/tests/` files and `cursor.yml`.

## Adaptive Decision Format

**ALL decisions in this command MUST use structured choices** adapted to the agent's interface. CLI-based agents: numbered choices where the user types a number. Chat-based agents: numbered list or direct question where the user responds naturally. Never ask open-ended questions when structured choices are possible.

**One question at a time.** Present a single structured choice, then STOP and wait for the user's response before proceeding to the next question. Never combine multiple choice blocks in one message. Each step that contains a decision point ends at that choice — the next step begins only after the user responds.

## Behavior

### Step 1: Initialize session

1. Set `agent_mode: "plan"` in `cursor.yml`.
2. Read `.tyrex/TYREX.md` for project context (tech stack, patterns, architecture).
3. Check `.tyrex/skills/qa-engineer.md`:
   - If found: load it as your persona for this session.
   - If not found: present choices:
     ```
     No QA Engineer skill installed. The QA Engineer skill improves test analysis quality.
       [1] Create QA Engineer skill from built-in template (Recommended)
       [2] Continue without QA Engineer skill
     ```
   - If "Create": copy from `templates/skills/qa-engineer.md` to `.tyrex/skills/qa-engineer.md`
4. Determine the next session number:
   - Scan `.tyrex/tests/` for existing `TEST-REVIEW-*.md` files
   - Next number = highest existing number + 1 (or 001 if none exist)
   - Create directory `.tyrex/tests/` if it doesn't exist
5. Read existing `.tyrex/tests/coverage-gaps.md` if it exists (to track what was previously identified).

Display session header:
```
TYREX Test Review TEST-REVIEW-NNN
════════════════════════════════════════

Project:  [name from tyrex.yml or directory name]
Stack:    [detected from TYREX.md]
Skill:    [qa-engineer loaded | no skill]
Date:     [today]

How would you like to proceed?
  [1] Full scan (all source files)
  [2] Focused scan (choose areas)
  [3] Re-scan (check previously identified gaps)
```

### Step 2: Detect test infrastructure

Before scanning for gaps, understand what testing exists:

1. **Test framework detection:**
   - Scan for config files: `jest.config.*`, `vitest.config.*`, `.mocharc.*`, `phpunit.xml`, `pytest.ini`, `setup.cfg [tool:pytest]`, `pyproject.toml [tool.pytest]`, `.rspec`, `Cargo.toml [dev-dependencies]`, `*_test.go`
   - Scan for test directories: `test/`, `tests/`, `__tests__/`, `spec/`, `test_*/`
   - Scan for test scripts in package manifest: `test`, `test:unit`, `test:integration`, `test:e2e`

2. **If no test framework detected:**
   ```
   No test framework detected in this project.

   Suggestions based on stack ([stack]):
     [1] [framework suggestion with rationale]
     [2] [alternative framework]
     [3] Continue scan anyway (identify what SHOULD be tested)
   ```

3. **Map existing tests:**
   - Find all test files by convention: `*.test.*`, `*.spec.*`, `*_test.*`, `test_*.*`
   - Map test files to source files they cover
   - Note source files with NO corresponding test file

Display infrastructure summary before proceeding.

### Step 3: Scan scope selection

#### Full scan
Analyze all source files (proceed to Step 4 with all enabled).

#### Focused scan
Present areas based on project structure:
```
Select areas to scan:
  [1] API endpoints / routes
  [2] Business logic / services
  [3] Data layer / models / repositories
  [4] Utilities / helpers
  [5] Authentication / authorization
  [6] All of the above
```

#### Re-scan
Read `coverage-gaps.md`, filter for unresolved gaps, and re-verify only those.

**Present scope choice and wait for response before continuing to Step 4.**

### Step 4: Identify critical flows

Analyze the codebase to identify flows that NEED tests, prioritized by risk:

#### Tier 1: Critical (must test)
- **Payment / financial flows** — any code handling money, transactions, billing
- **Authentication / authorization** — login, registration, token validation, permission checks
- **Data mutation** — create, update, delete operations on persistent data
- **User input processing** — form handlers, API request parsing, file uploads
- **Security-sensitive operations** — encryption, hashing, access control decisions

#### Tier 2: Important (should test)
- **API endpoints** — request/response contracts, error handling
- **Business rules** — domain logic, calculations, state machines
- **External integrations** — API clients, database queries, queue producers/consumers
- **Error handling paths** — what happens when things fail

#### Tier 3: Nice-to-have (could test)
- **Utility functions** — formatters, validators, parsers
- **Configuration loading** — env var parsing, config file reading
- **UI components** — rendering, user interactions (if frontend exists)

### Step 5: Generate argued suggestions

For each identified gap, create a structured suggestion:

```markdown
### GAP-NNN: [Descriptive title]
- **Tier:** [critical | important | nice-to-have]
- **Status:** [ ]
- **File:** [source_file:line_range]
- **Flow:** [What this code does — the behavior that needs testing]
- **Why test this:** [Specific argument — what could go wrong, what has gone wrong, what the impact of a bug would be]
- **Suggested tests:**
  - [Test case 1: description of what to assert]
  - [Test case 2: description of what to assert]
  - [Test case 3: edge case or error path]
- **Test type:** [unit | integration | e2e]
- **Existing coverage:** [none | partial — describe what's covered and what's not]
```

**Rules for suggestions:**
- Every suggestion MUST have a "Why test this" argument. No generic "this should have tests."
- Arguments should reference: business impact, data integrity risk, security implications, or past incidents
- Suggest specific test cases, not vague "test this function"
- Prefer behavior-based test descriptions over implementation-based
- Note when a test requires mocking vs real dependencies

### Step 6: Generate session report

Write the session report to `.tyrex/tests/TEST-REVIEW-NNN.md`:

```markdown
# Test Review TEST-REVIEW-NNN

- **Date:** YYYY-MM-DD
- **Scope:** [full | focused: areas | re-scan]
- **Skill:** [qa-engineer | none]
- **Project stack:** [from TYREX.md]

## Test Infrastructure

- **Framework:** [detected framework or "none"]
- **Test files found:** N
- **Source files without tests:** N
- **Test scripts:** [list from package manifest]

## Summary

[2-3 sentences: what was scanned, how many gaps found, overall assessment]

## Gaps

### GAP-001: [Title]
- **Tier:** ...
- **Status:** [ ]
[... full suggestion ...]

### GAP-002: [Title]
[... additional gaps ...]

## Statistics

| Tier | Gaps found | Existing tests |
|------|-----------|---------------|
| Critical | N | N |
| Important | N | N |
| Nice-to-have | N | N |
| **Total** | **N** | **N** |

## Recommendations

[Prioritized list: what to test first and why]
```

### Step 7: Update consolidated view

Read existing `.tyrex/tests/coverage-gaps.md` (if it exists) and merge new findings:

1. **Preserve existing resolved gaps** — don't re-add gaps marked as resolved
2. **Add new gaps** with `[ ]` status
3. **Update existing gaps** if the analysis changed

Write/update `.tyrex/tests/coverage-gaps.md`:

```markdown
# Test Coverage Gaps — [Project Name]

> Source of truth for identified test gaps. Updated by /tyrex-test-review.
> Consumed by /tyrex-new, /tyrex-plan, /tyrex-do, /tyrex-review.

Last scan: YYYY-MM-DD (TEST-REVIEW-NNN)

## Gaps

| # | Tier | Flow | File | Status |
|---|------|------|------|--------|
| 1 | critical | User registration without email validation | UserService.js:42 | [ ] |
| 2 | important | API error response format inconsistency | routes/api.js:87 | [x] |
| ... | ... | ... | ... | ... |

## Statistics

- Total gaps: N
- Pending: N ([ ])
- Resolved: N ([x])
- Critical: N | Important: N | Nice-to-have: N
```

### Step 8: Session wrap-up

Present the session summary:
```
Test Review TEST-REVIEW-NNN Complete
════════════════════════════════════════

Gaps identified: N total
  [!] CRITICAL     N
  [!] IMPORTANT    N
  [!] NICE-TO-HAVE N

Pending: N | Resolved: N

Report saved: .tyrex/tests/TEST-REVIEW-NNN.md
Gaps updated: .tyrex/tests/coverage-gaps.md

What's next?
  [1] Create feature to address test gaps — run /tyrex-new
  [2] Fix gaps now — run /tyrex-quick for selected gaps
  [3] Run another scan (different scope)
  [4] Done — exit
```

### Step 9: Update state

Update `cursor.yml`:
- `last_action`: "test_review_session"
- Do NOT clear active_feature — test reviews don't change the feature context

## Important Rules

- **This is a SCAN, not a fix.** The goal is identifying gaps with argued suggestions, not writing tests. Never create test files.
- **Argue every suggestion.** "This needs a test" is not enough. Explain WHY — business impact, data risk, security concern, or failure scenario.
- **Be specific.** Every gap must reference specific files and line ranges. Suggest concrete test cases, not vague recommendations.
- **Prioritize ruthlessly.** Not everything needs a test. Critical flows first. Trivial code (getters, config, constants) should NOT be suggested unless there's a specific reason.
- **Stack-aware analysis.** Use TYREX.md to understand the project's stack and apply appropriate testing patterns (Jest for Node.js, pytest for Python, etc.).
- **Apply QA Engineer skill silently.** If loaded, follow its guidelines and review criteria naturally without narrating which skill you're using.
- **Test behavior, not implementation.** Suggest tests that verify WHAT the code does, not HOW it does it. Tests should survive refactoring.
- **No false gaps.** If code is genuinely trivial or already well-tested indirectly, don't flag it. Quality over quantity.
- **Session reports are immutable.** Once written, a TEST-REVIEW-NNN.md report is not modified. New scans create new reports.
- **coverage-gaps.md is the living document.** It's updated on every scan. It's the source of truth consumed by other commands.
- **Path safety.** Never read files outside the project directory. Validate all file paths before reading. Resolve symlinks — if a symlink target resolves outside the project root, skip the file.
- **The core principle:** The framework never lets an implementation pass without at least asking about tests. This command is the proactive arm of that principle.
