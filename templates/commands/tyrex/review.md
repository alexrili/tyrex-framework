# /tyrex.review - Review completed implementation

You are the Tyrex Framework orchestrator. The user wants to review the implementation of the active feature.

## Behavior

### Step 1: Load context
Read:
1. `.tyrex/state/cursor.yml` → active feature
2. Active feature spec → acceptance criteria
3. `.tyrex/templates/review-checklist.md` → review checklist
4. `.tyrex/tyrex.yml` → documentation configuration for this demand

### Step 2: Automated checks
Run and report:
- [ ] All tests passing
- [ ] Lint clean (if configured)
- [ ] Security scan clean (if configured)
- [ ] All acceptance criteria addressed (map each criterion to implementation)

### Step 3: Code review
Review the implementation against the review checklist:
- Code quality (DRY, file sizes, naming)
- Test coverage (critical paths, edge cases)
- Security basics
- Consistency with TYREX.md patterns

Present findings. Suggest refactoring if needed.

### Step 4: Documentation finalization
Ensure all required documentation is complete:
- [ ] `docs/CHANGELOG.md` is up to date with all changes from this feature
- [ ] ADR files are complete (if configured for this demand)
- [ ] RFC files are complete (if configured for this demand)
- [ ] Wiki updated (if configured for this demand)
- [ ] Diagrams updated (if configured for this demand)

If any docs are missing or incomplete, generate/complete them now.

### Step 5: TYREX.md evolution
Ask: "Did any new patterns, hurdles, or architecture decisions emerge during this implementation?"
If yes:
- Update `.tyrex/TYREX.md` with new patterns/hurdles
- Update Architecture Decisions table if applicable

### Step 6: Human approval
Present the complete review:
```
Review Summary - Feature: [name]
═══════════════════════════════════
Acceptance Criteria: 5/5 met
Tests: 24 passing, 0 failing
Lint: clean
Security: clean

Code Quality:
- [suggestion if any]

Documentation:
- CHANGELOG: updated
- ADR-003: created
- Wiki: updated

New patterns documented in TYREX.md: [yes/no]
```

Ask: "Approve and mark feature as done? Or request changes?"

### Step 7: Finalize
If approved:
- Update feature spec status to `done`
- Final commit with documentation updates (if any docs were updated during review)
- Update cursor.yml: clear active feature, update last_action
- Tell user: "Feature complete. Run /tyrex.new for the next feature, or /tyrex.status for overview."

If changes requested:
- Note the requested changes
- Go back to `/tyrex.do` mode to implement the changes
- Return to review when done

## Important Rules
- ALWAYS check CHANGELOG.md is updated — it's mandatory
- The review phase is where documentation gets FINALIZED, not skipped
- Refactoring suggestions should be actionable and specific
- Never skip the security check
