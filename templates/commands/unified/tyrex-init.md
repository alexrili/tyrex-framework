---
description: "Initialize Tyrex in a project"
---

# /tyrex-init - Initialize Tyrex in a project

You are the Tyrex Framework orchestrator. The user is initializing Tyrex in their project.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may create/modify only `.tyrex/`, `docs/`, and configuration files.

## Behavior

### If `.tyrex/` already exists:
1. Read `.tyrex/state/cursor.yml`
2. Display current state summary to the user
3. **Security migration check:** If `.tyrex/map/security-audit.md` exists but `.tyrex/security/audit.md` does NOT, offer to migrate:
   - Create `.tyrex/security/` if it doesn't exist
   - Copy content from `.tyrex/map/security-audit.md` to `.tyrex/security/audit.md`, preserving all `[x]` and `[ ]` statuses
   - Do NOT delete the original file
   - Inform the user: "Migrated security audit to `.tyrex/security/audit.md`. Run `/tyrex-security-review` for a fresh scan."
4. Ask: "Tyrex is already initialized. Resume from where you left off? [Y/n]"
5. If yes: behave like `/tyrex-resume`
6. If no: ask if they want to re-initialize (this will overwrite settings, NOT state)

### If `.tyrex/` does NOT exist (fresh project):

**Step 0: Create Project Structure**

If `.tyrex/` doesn't exist, create it now. Do NOT ask the user to leave and run a CLI command — handle everything inline.

Create the following directories:
```
.tyrex/state/tasks/
.tyrex/features/
.tyrex/skills/
.tyrex/map/
.tyrex/context/
.tyrex/security/
docs/adrs/
docs/rfcs/
docs/wiki/
docs/diagrams/
docs/specs/
docs/srs/
docs/prd/
```

If `docs/CHANGELOG.md` doesn't exist, create it with the standard Keep a Changelog header.

Then proceed with the mapping below. Configuration files (`tyrex.yml`, `TYREX.md`, `constitution.md`, `cursor.yml`) will be generated in Steps 2-3.

> **Tip:** For future projects, you can run `tyrex init` in the terminal first to pre-configure the structure with symlinks to global templates. But it's not required — `/tyrex-init` handles everything.

If `.tyrex/` exists but `.tyrex/map/` is empty (i.e., the structure was created but `/tyrex-init` hasn't mapped the codebase yet), skip Step 0 and proceed with the mapping below.

Perform a COMPLETE project mapping. This is the ONE phase where spending tokens is justified — it saves tokens in every subsequent interaction.

**Step 1: Codebase Analysis** (use parallel sub-agents if the project is large)
- Detect language, framework, dependencies, package manager
- Analyze directory structure and identify patterns (MVC, services, etc.)
- Identify test framework and existing test coverage
- Identify CI/CD configuration
- Check for existing documentation and its freshness
- Scan for security issues (hardcoded secrets, vulnerable deps, common vulnerabilities)
- **Detect test framework presence and suggest quality strategy:**
  - If test framework found (jest, rspec, pytest, go test, etc.): suggest `default: "required"`
  - If test framework partially set up: suggest `default: "recommended"` and offer to help set up
  - If no test framework: suggest `default: "optional"` and ask if they want to set one up
  - Identify project areas (API, frontend, mobile, workers, infra) and set per-area strategy
- **Scan for existing skills:**
  - Check `.claude/skills/`, `.opencode/skills/`, `.agents/skills/`, `.cursor/rules/`
  - Report any found and offer to sync to `.tyrex/skills/`
  - Suggest running `/tyrex-skills suggest` for auto-detection
- Save results to `.tyrex/map/`:
  - `architecture.md` - detected architecture
  - `tech-stack.md` - complete stack with versions
  - `security-audit.md` - vulnerabilities found (with tracking)
  - `codebase-summary.md` - structural summary

**Security audit format:** The `security-audit.md` findings table MUST include a `Status` column for tracking resolution:

```markdown
| # | Status | Severity   | Category         | File           | Line | Description |
|---|--------|------------|------------------|----------------|------|-------------|
| 1 | [ ]    | **MEDIUM** | Environment      | `.gitignore`   | —    | .env files not excluded |
| 2 | [ ]    | **LOW**    | Code Patterns    | `bin/tyrex.js` | 102  | Unescaped regex |
```

- `[ ]` = pending (unresolved)
- `[x]` = resolved (fixed)
- This format is consumed by `/tyrex-status` (to show pending findings) and `/tyrex-review` (to cross-reference with changes)

**Step 1b: Security Directory Setup & Migration**

After the codebase analysis, set up the dedicated security directory:

1. **Create `.tyrex/security/`** if it doesn't already exist.
2. **Migrate existing audit data:** If `.tyrex/map/security-audit.md` exists, copy its content to `.tyrex/security/audit.md`.
   - Preserve all `[x]` (resolved) and `[ ]` (pending) statuses exactly as they are.
   - Do NOT delete the original file — the user can clean it up manually.
   - If `.tyrex/security/audit.md` already exists, do NOT overwrite it — skip migration and note it in the summary.
3. **Save initial scan results** from Step 1 to `.tyrex/security/audit.md` (if no migration occurred) and `.tyrex/security/SECURITY-001.md` (the first scan report).
   - The initial scan during init should be lightweight — not a full deep scan.
4. **Note in summary:** Inform the user that a full security scan can be run anytime with `/tyrex-security-review`.

**Step 2: Generate Core Documents**
- Generate `.tyrex/TYREX.md` based on the mapping (fill in the template with real data)
- Generate `.tyrex/constitution.md` with project-appropriate guardrails
- Verify `CLAUDE.md` exists and has Tyrex instructions; update if needed
- Initialize `.tyrex/state/cursor.yml`
- Ensure `docs/CHANGELOG.md` exists

**Step 3: Interactive Configuration**
Ask the user these questions (use the question tool when available, otherwise ask in text):

1. "Commit mode: automatic after each task, or review and approve each one?"
   - Options: `auto` | `approve` (default: approve)

2. "Branch creation: automatic or you approve the branch name?"
   - Options: `auto` | `approve` (default: approve)

3. "Documentation level: always generate full docs, suggest per feature, or minimal?"
   - Options: `always` | `suggest` | `minimal` (default: suggest)

4. "Allow parallel execution of independent tasks?"
   - Options: yes | no (default: yes)

5. "Maximum parallel agents?"
   - Options: 1-10 (default: 5)

Save answers to `.tyrex/tyrex.yml`.

**Step 4: Context Ingestion**
After the automated mapping is complete, offer the user a chance to provide additional project context that the codebase analysis cannot detect:

1. Ask: "Add project context? (business rules, constraints, integrations) [y/N]"
2. If yes: follow the `/tyrex-context add` flow with scope set to `project`
   - Accept free text, file paths, or URLs
   - Store in `.tyrex/context/`
   - This context will be read by `/tyrex-plan` and `/tyrex-do` for informed decisions
3. If no: proceed to summary
4. The user can always add more context later with `/tyrex-context`

**Step 5: Summary**
Present a summary of:
- Stack detected
- Architecture detected
- Security issues found (if any)
- Configuration chosen
- Context files ingested (if any)
- Next step: "Run /tyrex-new to start your first feature"

### For empty/new projects (greenfield):
If the directory is empty or has minimal files (only config, README, or scaffold):

1. **Skip codebase analysis** — no source code to analyze.
2. **Create minimal structure** — scaffold `.tyrex/`, `docs/`, and core files with placeholder content.
3. **Run interactive configuration** (Step 3) — same questions as existing projects.
4. **Offer context ingestion** (Step 4) — the user may have specs, wireframes, or docs to provide.
5. **Summary with adapted next steps:**
   ```
   Tyrex initialized (greenfield project).
   
   No code to analyze — project context will be built as you go.
   
   Suggested next steps:
     /tyrex-discuss   Brainstorm architecture, stack, and scope interactively
     /tyrex-new       Jump straight into defining your first feature
     /tyrex-context   Provide project context (specs, docs, constraints)
   ```
6. **Recommend `/tyrex-discuss`** — for greenfield projects, explicitly suggest the discuss command as the natural first step: "For new projects, we recommend starting with `/tyrex-discuss` to brainstorm your architecture and stack before defining features."

## Important Rules
- NEVER skip the security audit on existing projects
- ALWAYS generate `.tyrex/map/` files for existing projects
- For greenfield projects, recommend `/tyrex-discuss` before `/tyrex-new`
- Keep TYREX.md under 300 lines — be concise
- The constitution.md should be adapted to the detected stack (e.g., Ruby projects get Brakeman in CI, Node projects get npm audit, etc.)
