# SPEC: Task 1 — Add assumptions mode to tyrex-discuss command

## Objective
Extend the `/tyrex-discuss` command template with a new `--assumptions` mode that
inverts the discuss flow: the system analyzes the codebase first, proposes what it
would do and why, then asks the user to correct what's wrong.

## Technical Approach
1. Add `--assumptions` flag to the Parameters section
2. Add new Step 1c: Assumptions mode detection (if `--assumptions` flag or `workflow.discuss_mode == 'assumptions'` in tyrex.yml)
3. In assumptions mode Step 3, replace the interview flow with:
   - System reads codebase (key files, architecture, patterns)
   - Presents analysis: "Here's what I see and what I'd do" with numbered bullet points
   - Asks user: "What's wrong or missing? Correct any points above."
   - User corrects, system adjusts
4. Assumptions mode only works in Codebase and Hybrid modes (not Greenfield — no code to analyze)
5. Default mode remains 'discuss' (interview-first)
6. Add config reference to tyrex.yml `workflow.discuss_mode`

## Files Affected
- `templates/commands/unified/tyrex-discuss.md`

## Depends On
None

## Wave
1
