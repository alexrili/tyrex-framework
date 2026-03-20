# SPEC: Task 002 — Update high-interaction commands

## Feature
010 — Interactive Questions UX

## Objective
Strengthen the Adaptive Decision Format section and add "wait for response" markers in the 3 most interactive commands.

## Technical Approach
For each of tyrex-new.md, tyrex-quick.md, tyrex-debug.md:

1. **Update the ADF section** — add this paragraph after the existing text:
   > **One question at a time.** Present a single structured choice, then STOP and wait for the user's response. Do not combine multiple choice blocks in one message. Each step that contains a decision point ends at that choice — the next step begins only after the user responds. Exception: configuration review blocks (e.g., docs bundle + git config in Step 4) may be presented together as a single "review and confirm" action.

2. **Add markers** at key multi-question risk points:
   - tyrex-new: between Step 2 (clarification) and Step 3 (context), between Step 3 (context) and Step 3b (skills), between Step 3b (skills) and Step 4 (config)
   - tyrex-quick: between mode selection and config choices
   - tyrex-debug: between mode selection (Step 2) and depth selection (Step 3)

   Marker format: `<!-- INTERACTION: Present choice above, wait for response before continuing -->`
   Or inline: add "Present and wait for response before proceeding." at the end of each decision step.

## Files Affected
- `templates/commands/unified/tyrex-new.md`
- `templates/commands/unified/tyrex-quick.md`
- `templates/commands/unified/tyrex-debug.md`

## Testing Strategy
- Verify ADF section is updated in all 3 files
- Verify markers are at correct decision points
- Verify no content was accidentally removed
