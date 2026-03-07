---
description: "Start a new demand/feature"
---

# /tyrex-new - Start a new demand/feature

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

### Step 3: Context Ingestion
Before configuring or generating documentation, offer the user a chance to provide demand-specific context:

1. Ask: "Do you have additional context for this demand? (legacy system constraints, business rules, external docs, related code, etc.) [y/N]"
2. If yes: follow the `/tyrex-context add` flow with scope set to `demand`
   - Accept free text, file paths, or URLs
   - Store in `.tyrex/features/NNN-context.md`
   - This context will inform documentation generation and planning
3. If no: proceed to configuration
4. Note: the user can always add more context later with `/tyrex-context`

### Step 4: Demand configuration
Read defaults from `.tyrex/tyrex.yml` and present configuration for THIS demand:

Ask the user (suggest based on the nature of the demand):

"Configuration for this demand:"

1. **Documentation bundle:**
   - [x] CHANGELOG (mandatory, always)
   - [x] SPEC - Technical Specification (mandatory, always — generated per task during /tyrex-plan)
   - [ ] SRS - Software Requirements Specification (suggest for features with clear functional requirements)
   - [ ] PRD - Product Requirements Document (suggest if user provides product-level context, or offer to generate)
   - [ ] ADR - Architecture Decision Record (suggest if there's an architecture choice)
   - [ ] RFC - Technical proposal (suggest if it's a complex system)
   - [ ] Wiki update
   - [ ] Flow diagram
   
   "Use full documentation bundle? Or select individually? Or use defaults from tyrex.yml?"

2. **Git:**
   - Suggest branch name based on the description (e.g., `feat/oauth-system`)
   - "Commits: approve or auto for this demand?"
   
3. "Use defaults from tyrex.yml for everything else? [Y/n]"

### Step 5: Documentation First
Generate documentation BEFORE any code, in this order:

1. **PRD** (if configured): If user provided a PRD document, use it. Otherwise, generate from the demand description and context. Save to `docs/prd/NNN-feature-name.md`. Present for review.
2. **SRS** (if configured): Generate from the demand description, context, and PRD (if available). Save to `docs/srs/NNN-feature-name.md`. Present for review.
3. **ADR** (if configured): Create in `docs/adrs/`. Present for review.
4. **RFC** (if configured): Create in `docs/rfcs/`. Present for review.
5. **Diagrams** (if configured): Create in `docs/diagrams/`. Present for review.

Wait for approval of all generated docs before proceeding.

Note: SPEC documents are NOT generated here — they are generated per task during `/tyrex-plan`.

### Step 6: Generate feature spec
Determine the next feature number (read `.tyrex/features/` directory).
Create `.tyrex/features/NNN-feature-name.md` with:
- Objective (1-2 sentences)
- Acceptance criteria (concise list)
- Out of scope
- Configuration for this demand (including which docs were generated)
- Status: `spec`

### Step 7: Create branch (if configured)
If branch mode is `approve`: show suggested branch name, wait for approval.
If branch mode is `auto`: create it automatically.

### Step 8: Update state
Update `.tyrex/state/cursor.yml`:
- `active_feature`: feature ID
- `active_feature_file`: path to feature spec
- `last_action`: "feature_created"

### Step 9: Next step
Tell the user: "Feature spec created. Run /tyrex-plan to plan the implementation."

## Important Rules
- Feature spec MUST be under 50 lines
- ALWAYS generate CHANGELOG entry (even if just "Feature X started")
- Documentation is generated BEFORE code — the human reviews docs first
- SPEC is always mandatory — it is generated per task during `/tyrex-plan`, not here
- SRS and PRD are suggested based on demand nature — not forced
- Context ingestion happens BEFORE documentation to inform doc generation
- If the user says "use defaults" or "just go", use tyrex.yml defaults without asking each question
- The user can override ANY default for this specific demand
