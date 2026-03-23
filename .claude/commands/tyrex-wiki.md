---
description: "Generate or update project wiki pages in docs/wiki/"
---

# /tyrex-wiki - Generate/Update Project Wiki

You are the Tyrex Framework orchestrator. Generate or update wiki-style documentation for the project in `docs/wiki/`.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may create/modify only `docs/wiki/` and `.tyrex/` files.

## Behavior

### Step 1: Project analysis

Read the project to understand what needs documenting:

1. `.tyrex/TYREX.md` — project context, architecture, patterns
2. `.tyrex/map/` — project mapping (if exists)
3. Source code structure — identify major modules/areas
4. Existing wiki pages in `docs/wiki/` — understand what's already documented
5. ADRs in `docs/adrs/` — architecture decisions that need wiki context
6. Feature specs in `.tyrex/features/` — completed features that may need documentation

### Step 2: Propose wiki structure

Present a proposed wiki structure based on the project:

```
docs/wiki/
├── index.md                    # Wiki home (table of contents)
├── getting-started.md          # Onboarding guide for new developers
├── architecture.md             # System architecture overview with diagrams
├── [area-1].md                 # e.g., authentication.md, payments.md
├── [area-2].md                 # One page per major feature/domain area
├── deployment.md               # Deployment guide
├── troubleshooting.md          # Common issues and solutions
└── glossary.md                 # Project-specific terminology
```

For each proposed page, show:
- Title
- Brief description of what it would cover
- Whether it already exists (update) or is new (create)

Ask: "Generate all pages? [all/select]"

### Step 3: Generate wiki pages

For each selected page, generate content following these rules:

**index.md:**
- Table of contents with links to all wiki pages
- Brief project description
- Quick navigation guide

**getting-started.md:**
- Prerequisites and setup steps
- Key concepts a new developer needs to know
- First tasks / where to start
- Links to relevant wiki pages

**architecture.md:**
- System overview with D2 diagrams (d2lang.com)
- Component descriptions
- Data flow
- Key design decisions (link to ADRs)

**[area].md (domain pages):**
- What this area does
- Key files and their responsibilities
- How to modify / extend this area
- Testing approach for this area
- Common patterns used

**deployment.md:**
- Environment setup
- Deployment steps
- Rollback procedures
- Monitoring / health checks

**troubleshooting.md:**
- Common errors and solutions
- Debugging tips
- Known issues and workarounds

**glossary.md:**
- Project-specific terms and their definitions
- Abbreviations used in the codebase

### Step 4: Handle existing pages

If wiki pages already exist:
1. Compare existing content with generated content
2. For each page, show what would change
3. Ask: "Update? [Y/n/merge]"
   - Y: Replace entirely
   - n: Skip this page
   - merge: Keep user-written sections, update generated sections

### Step 5: Commit

Update CHANGELOG.md with the wiki change.
Handle commit based on configured mode (auto/approve).

## Important Rules
- Every wiki page MUST include D2 diagrams where architecture or flow is described (d2lang.com). Use templates/diagrams/*.d2 as base
- Pages should be self-contained — a developer should be able to read one page and understand that area
- Cross-reference between pages using relative links
- Do NOT document implementation details that change frequently — focus on concepts and patterns
- Keep each page under 200 lines — split into sub-pages if needed
- Do NOT invent features or capabilities — only document what exists in the code
- Include code examples from the actual codebase when illustrating patterns
- Date each page with "Last updated: YYYY-MM-DD" at the bottom
