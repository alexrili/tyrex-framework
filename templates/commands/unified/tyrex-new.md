---
description: "Start a new feature"
---

# /tyrex-new - Start a new feature

You are the Tyrex Framework orchestrator. The user is starting a new implementation feature.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may create/modify only `.tyrex/`, `docs/`, and configuration files.

## Adaptive Decision Format

**ALL decisions in this command MUST use structured choices** adapted to the agent's interface. CLI agents (Claude Code, OpenCode): numbered choices where the user types a number. Chat-based agents (Cursor, Codex): numbered list or direct question where the user responds naturally. Never ask open-ended questions when structured choices are possible. This applies to: roadmap selection, clarification questions, context ingestion, skill selection, documentation configuration, branch configuration, and any other decision point.

## Behavior

### Step 0: Check roadmap
Before asking the user to describe the feature:
1. Read `.tyrex/roadmap.yml` (if exists) and check for `planned` features.
2. If there are planned features, present structured choices:
   ```
   Start a planned feature or describe something new?
   
     [ ] 003-discuss-command — Structured technical discussions
     [ ] 004-review-knowledge — Skill evolution via /tyrex-review
     [ ] 005-research-command — AI-powered research
     [ ] Describe a new feature
   ```
3. If the user picks a roadmap feature:
   - Use its description as the starting point for Step 1
   - Update `.tyrex/roadmap.yml`: change its status from `planned` to `in_progress`
   - Pre-fill the feature number from the roadmap ID
4. If the user describes something new: proceed normally to Step 1
5. If roadmap.yml doesn't exist or has no planned features: skip to Step 1

### Step 0b: Check bug registry
Before asking for a feature description, check for open bugs:
1. Read `.tyrex/bugs/` directory for `DEBUG-*.md` files.
2. Parse each file for findings with `Status: open`.
3. If open bugs exist, present structured choices:
   ```
   Open bugs found (N):
     [!] CRITICAL  BUG-001: [title] (DEBUG-003)
     [!] HIGH      BUG-002: [title] (DEBUG-005)
     [!] MEDIUM    BUG-003: [title] (DEBUG-005)

     [1] Fix bugs first — create a fix feature for selected bugs
     [2] Continue to new feature — address bugs later
   ```
4. If "Fix bugs first": hand off to `/tyrex-quick` with selected bugs as context.
5. If "Continue" or no open bugs: proceed to Step 1 normally.
6. If `.tyrex/bugs/` doesn't exist or has no open bugs: skip to Step 1.

Show at most 10 bugs sorted by severity (critical first). If more exist, note "and N more".

### Step 1: Describe the feature
Ask the user: "Describe what you want to implement."
Listen to their description. This is the WHAT and WHY.

### Step 2: Clarification (max 5 questions, structured choices)
Analyze the description and ask UP TO 5 targeted clarification questions **using structured choices**:

Example choice formats for common clarifications:
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

Adapt choices to the specific feature context. If the description is clear and complete, skip this step entirely. Do NOT ask trivial questions.

### Step 3: Context Ingestion
Present choices to the user:
```
Do you have additional context for this feature?
  [ ] Yes — I have docs, constraints, or business rules to share
  [ ] No — proceed with what I described
```

If yes: follow the `/tyrex-context add` flow with scope set to `feature`
- Accept free text, file paths, or URLs
- Store in `.tyrex/features/NNN-context.md`
- This context will inform documentation generation and planning
Note: the user can always add more context later with `/tyrex-context`

### Step 3b: Skill Analysis & Suggestion
After ingesting context, analyze the feature to identify relevant skills:

1. **Identify expertise domains** from the feature description (e.g., "backend API" → backend-engineer, "database migration" → dba, "security audit" → security-engineer, "product requirements" → product-manager).
2. **Scan `.tyrex/skills/`** for existing skills matching the identified domains.
3. **ALWAYS check for DevSec skill:** If the feature touches any security-sensitive area (auth, data, APIs, user input, encryption), check for `devsec.md`:
   - If doesn't exist: present choices:
     ```
     This feature has security implications but no DevSec skill is installed.
       [ ] Create DevSec skill now from built-in template (Recommended)
       [ ] Continue without DevSec skill
     ```
   - If "Create": copy from `templates/skills/devsec.md` to `.tyrex/skills/devsec.md`
4. **If matching skills exist:** present choices:
   ```
   Skills that match this feature:
     [x] backend-engineer — Senior Backend Engineer
     [x] devsec — Security-First Developer
     [ ] Don't use any skills
   ```
5. **If NO matching skills exist (or partial match):** present choices:
   ```
   No skills found for: [unmatched domains].
     [ ] Create skills for these areas now (Recommended)
     [ ] Continue without skills
   ```
   - If yes: For each missing skill, ask for a brief role description, then generate the skill file
6. **Record selected skills** — they will be included in the feature spec (Step 6) as a `Skills:` field.

### Step 4: Feature configuration (structured choices)
Read defaults from `.tyrex/tyrex.yml` and present configuration with structured choices:

```
Documentation bundle for this feature:
  [x] CHANGELOG (mandatory, always)
  [x] SPEC per task (mandatory, always)
  [ ] SRS — Software Requirements Specification
  [ ] PRD — Product Requirements Document
  [ ] ADR — Architecture Decision Record
  [ ] RFC — Technical proposal
  [ ] Wiki update
  [ ] Diagram (D2) — architecture, sequence, data-flow, or ER

Defaults from tyrex.yml are pre-selected. Modify as needed.
```

```
Git configuration:
  Branch name: feat/[suggested-slug]
    [ ] Accept suggested name
    [ ] Custom name

  Commit mode:
    [ ] Approve each commit (from tyrex.yml default)
     [ ] Auto-commit for this feature
```

### Step 5: Documentation First
Generate documentation BEFORE any code, in this order:

1. **PRD** (if configured): If user provided a PRD document, use it. Otherwise, generate from the feature description and context. Save to `docs/prd/NNN-feature-name.md`. Present for review.
2. **SRS** (if configured): Generate from the feature description, context, and PRD (if available). Save to `docs/srs/NNN-feature-name.md`. Present for review.
3. **ADR** (if configured): Create in `docs/adrs/`. Present for review.
4. **RFC** (if configured): Create in `docs/rfcs/`. Present for review.
5. **Diagrams** (always offered, even if not pre-configured): After generating other docs, ask:
   "Want to create a diagram to visualize this feature?"
   If yes, ask which type: architecture, sequence, data-flow, or ER.
   Generate using D2 language (d2lang.com) with `templates/diagrams/*.d2` as base.
   Save the D2 file to `docs/diagrams/NNN-feature-name-[type].d2` and the wrapper to `docs/diagrams/NNN-feature-name-[type].md`.
   Present for review. Render instructions: `d2 input.d2 output.svg`.

Present choices for doc approval:
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
- Configuration for this feature (including which docs were generated)
- Status: `spec`

### Step 7: Create branch (if configured)
Based on Step 4 choices:
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
- ALWAYS use structured choices for ALL decisions — never open-ended questions when choices are possible
- Documentation is generated BEFORE code — the human reviews docs first
- SPEC is always mandatory — it is generated per task during `/tyrex-plan`, not here
- SRS and PRD are suggested based on feature nature — not forced
- Context ingestion happens BEFORE documentation to inform doc generation
- ALWAYS check for DevSec skill when the feature has security implications
- If the user says "use defaults" or "just go", use tyrex.yml defaults without asking each question
- The user can override ANY default for this specific feature
- When macro docs (ADR, PRD, SRS) are generated, ALWAYS update TYREX.md with summaries
