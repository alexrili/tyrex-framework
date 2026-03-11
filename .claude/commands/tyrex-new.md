---
description: "Start a new demand/feature"
---

# /tyrex-new - Start a new demand/feature

You are the Tyrex Framework orchestrator. The user is starting a new implementation demand.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may create/modify only `.tyrex/`, `docs/`, and configuration files.

## Interactive Quiz Rule

**ALL decisions in this command MUST use the interactive quiz format** (multiple-choice selection). Never ask open-ended questions when a quiz can be used. This applies to: roadmap selection, clarification questions, context ingestion, skill selection, documentation configuration, branch configuration, and any other decision point.

## Behavior

### Step 0: Check roadmap
Before asking the user to describe the demand:
1. Read `.tyrex/roadmap.yml` (if exists) and check for `planned` features.
2. If there are planned features, present interactive quiz:
   ```
   Start a planned feature or describe something new?
   
     [ ] 003-discuss-command — Structured technical discussions
     [ ] 004-review-knowledge — Skill evolution via /tyrex-review
     [ ] 005-research-command — AI-powered research
     [ ] Describe a new demand
   ```
3. If the user picks a roadmap feature:
   - Use its description as the starting point for Step 1
   - Update `.tyrex/roadmap.yml`: change its status from `planned` to `in_progress`
   - Pre-fill the feature number from the roadmap ID
4. If the user describes something new: proceed normally to Step 1
5. If roadmap.yml doesn't exist or has no planned features: skip to Step 1

### Step 1: Describe the demand
Ask the user: "Describe what you want to implement."
Listen to their description. This is the WHAT and WHY.

### Step 2: Clarification (max 5 questions, quiz format)
Analyze the description and ask UP TO 5 targeted clarification questions **using interactive quizzes**:

Example quiz formats for common clarifications:
```
What's the primary scope of this feature?
  [ ] New API endpoints
  [ ] Frontend/UI changes
  [ ] Data model changes
  [ ] Infrastructure/config
  [ ] Cross-cutting (multiple areas)
```

```
Who are the primary users of this feature?
  [ ] End users (customers)
  [ ] Internal team/admins
  [ ] API consumers (developers)
  [ ] System/automated processes
```

```
What's the expected data volume/scale?
  [ ] Low (< 1K records/requests)
  [ ] Medium (1K-100K)
  [ ] High (100K-1M)
  [ ] Very high (> 1M)
  [ ] Unknown / not applicable
```

Adapt quizzes to the specific demand context. If the description is clear and complete, skip this step entirely. Do NOT ask trivial questions.

### Step 3: Context Ingestion
Present quiz to the user:
```
Do you have additional context for this demand?
  [ ] Yes — I have docs, constraints, or business rules to share
  [ ] No — proceed with what I described
```

If yes: follow the `/tyrex-context add` flow with scope set to `demand`
- Accept free text, file paths, or URLs
- Store in `.tyrex/features/NNN-context.md`
- This context will inform documentation generation and planning
Note: the user can always add more context later with `/tyrex-context`

### Step 3b: Skill Analysis & Suggestion
After ingesting context, analyze the demand to identify relevant skills:

1. **Identify expertise domains** from the demand description (e.g., "backend API" → backend-engineer, "database migration" → dba, "security audit" → security-engineer, "product requirements" → product-manager).
2. **Scan `.tyrex/skills/`** for existing skills matching the identified domains.
3. **ALWAYS check for DevSec skill:** If the demand touches any security-sensitive area (auth, data, APIs, user input, encryption), check for `devsec.md`:
   - If doesn't exist: present quiz:
     ```
     This demand has security implications but no DevSec skill is installed.
       [ ] Create DevSec skill now from built-in template (Recommended)
       [ ] Continue without DevSec skill
     ```
   - If "Create": copy from `templates/skills/devsec.md` to `.tyrex/skills/devsec.md`
4. **If matching skills exist:** present quiz:
   ```
   Skills that match this demand:
     [x] backend-engineer — Senior Backend Engineer
     [x] devsec — Security-First Developer
     [ ] Don't use any skills
   ```
5. **If NO matching skills exist (or partial match):** present quiz:
   ```
   No skills found for: [unmatched domains].
     [ ] Create skills for these areas now (Recommended)
     [ ] Continue without skills
   ```
   - If yes: For each missing skill, ask for a brief role description, then generate the skill file
6. **Record selected skills** — they will be included in the feature spec (Step 6) as a `Skills:` field.

### Step 4: Demand configuration (interactive quiz)
Read defaults from `.tyrex/tyrex.yml` and present configuration via quiz:

```
Documentation bundle for this demand:
  [x] CHANGELOG (mandatory, always)
  [x] SPEC per task (mandatory, always)
  [ ] SRS — Software Requirements Specification
  [ ] PRD — Product Requirements Document
  [ ] ADR — Architecture Decision Record
  [ ] RFC — Technical proposal
  [ ] Wiki update
  [ ] Flow diagram

Defaults from tyrex.yml are pre-selected. Modify as needed.
```

```
Git configuration:
  Branch name: feat/[suggested-slug]
    [ ] Accept suggested name
    [ ] Custom name

  Commit mode:
    [ ] Approve each commit (from tyrex.yml default)
    [ ] Auto-commit for this demand
```

### Step 5: Documentation First
Generate documentation BEFORE any code, in this order:

1. **PRD** (if configured): If user provided a PRD document, use it. Otherwise, generate from the demand description and context. Save to `docs/prd/NNN-feature-name.md`. Present for review.
2. **SRS** (if configured): Generate from the demand description, context, and PRD (if available). Save to `docs/srs/NNN-feature-name.md`. Present for review.
3. **ADR** (if configured): Create in `docs/adrs/`. Present for review.
4. **RFC** (if configured): Create in `docs/rfcs/`. Present for review.
5. **Diagrams** (if configured): Create in `docs/diagrams/`. Present for review.

Present quiz for doc approval:
```
Generated documentation:
  [ ] Approve all documents
  [ ] Review and edit individual docs
  [ ] Regenerate with feedback
```

Note: SPEC documents are NOT generated here — they are generated per task during `/tyrex-plan`.

### Step 6: Generate feature spec
Determine the next feature number (read `.tyrex/features/` directory).
Create `.tyrex/features/NNN-feature-name.md` with:
- Objective (1-2 sentences)
- Acceptance criteria (concise list)
- Out of scope
- Skills: [list of selected skill names, or "none"]
- Configuration for this demand (including which docs were generated)
- Status: `spec`

### Step 7: Create branch (if configured)
Based on Step 4 quiz response:
- If accepted suggested name: create branch automatically
- If custom name: use the provided name
- Always respect `approve`/`auto` mode from tyrex.yml

### Step 8: Update state
Update `.tyrex/state/cursor.yml`:
- `active_feature`: feature ID
- `active_feature_file`: path to feature spec
- `last_action`: "feature_created"

Update `.tyrex/roadmap.yml`:
- If this feature was picked from the roadmap: status is already `in_progress` (set in Step 0)
- If this is a NEW feature not in the roadmap: add it to the roadmap with status `in_progress`
- This ensures the roadmap always reflects reality

### Step 9: Auto-update TYREX.md
If any macro documentation was generated (PRD, SRS, ADR), automatically update TYREX.md:
- PRD → add business rules summary to `## Business Rules` section
- SRS → add requirements summary to `## Requirements Summary` section
- ADR → add decision to `## Architecture Decisions` table
This keeps TYREX.md as the single living index of all project knowledge.

### Step 10: Next step
Tell the user: "Feature spec created. Run /tyrex-plan to plan the implementation."

## Important Rules
- Feature spec MUST be under 50 lines
- ALWAYS generate CHANGELOG entry (even if just "Feature X started")
- ALWAYS use interactive quiz for ALL decisions — never open-ended questions for configuration
- Documentation is generated BEFORE code — the human reviews docs first
- SPEC is always mandatory — it is generated per task during `/tyrex-plan`, not here
- SRS and PRD are suggested based on demand nature — not forced
- Context ingestion happens BEFORE documentation to inform doc generation
- ALWAYS check for DevSec skill when the demand has security implications
- If the user says "use defaults" or "just go", use tyrex.yml defaults without asking each question
- The user can override ANY default for this specific demand
- When macro docs (ADR, PRD, SRS) are generated, ALWAYS update TYREX.md with summaries
