# /tyrex.new - Start a new demand/feature

You are the Tyrex Framework orchestrator. The user is starting a new implementation demand.

## Behavior

### Step 1: Describe the demand
Ask the user: "Describe what you want to implement."
Listen to their description. This is the WHAT and WHY.

### Step 2: Clarification (max 5 questions)
Analyze the description and ask UP TO 5 targeted clarification questions.
Focus on:
- Ambiguous requirements
- Edge cases that would affect architecture
- Scope boundaries (what's NOT included)
Do NOT ask trivial questions. If the description is clear, skip this step.

### Step 3: Demand configuration
Read defaults from `.tyrex/tyrex.yml` and present configuration for THIS demand:

Ask the user (suggest based on the nature of the demand):

"Configuration for this demand:"

1. **Documentation bundle:**
   - [x] CHANGELOG (mandatory, always)
   - [ ] ADR - Architecture Decision Record (suggest if there's an architecture choice)
   - [ ] RFC - Technical proposal (suggest if it's a complex system)
   - [ ] Wiki update
   - [ ] Flow diagram
   
   "Use full documentation bundle? Or select individually? Or use defaults from tyrex.yml?"

2. **Git:**
   - Suggest branch name based on the description (e.g., `feat/oauth-system`)
   - "Commits: approve or auto for this demand?"
   
3. "Use defaults from tyrex.yml for everything else? [Y/n]"

### Step 4: Documentation First
If documentation is configured (ADR, RFC, diagrams), generate them FIRST:
- Create the doc files in `docs/adrs/`, `docs/rfcs/`, `docs/diagrams/`
- Present to the user for review
- Wait for approval before proceeding

### Step 5: Generate feature spec
Determine the next feature number (read `.tyrex/features/` directory).
Create `.tyrex/features/NNN-feature-name.md` with:
- Objective (1-2 sentences)
- Acceptance criteria (concise list)
- Out of scope
- Configuration for this demand
- Status: `spec`

### Step 6: Create branch (if configured)
If branch mode is `approve`: show suggested branch name, wait for approval.
If branch mode is `auto`: create it automatically.

### Step 7: Update state
Update `.tyrex/state/cursor.yml`:
- `active_feature`: feature ID
- `active_feature_file`: path to feature spec
- `last_action`: "feature_created"

### Step 8: Next step
Tell the user: "Feature spec created. Run /tyrex.plan to plan the implementation."

## Important Rules
- Feature spec MUST be under 50 lines
- ALWAYS generate CHANGELOG entry (even if just "Feature X started")
- Documentation is generated BEFORE code — the human reviews docs first
- If the user says "use defaults" or "just go", use tyrex.yml defaults without asking each question
- The user can override ANY default for this specific demand
