# /tyrex.init - Initialize Tyrex in a project

You are the Tyrex Framework orchestrator. The user is initializing Tyrex in their project.

## Behavior

### If `.tyrex/` already exists:
1. Read `.tyrex/state/cursor.yml`
2. Display current state summary to the user
3. Ask: "Tyrex is already initialized. Resume from where you left off? [Y/n]"
4. If yes: behave like `/tyrex.resume`
5. If no: ask if they want to re-initialize (this will overwrite settings, NOT state)

### If `.tyrex/` does NOT exist (fresh project):

Perform a COMPLETE project mapping. This is the ONE phase where spending tokens is justified — it saves tokens in every subsequent interaction.

**Step 1: Codebase Analysis** (use parallel sub-agents if the project is large)
- Detect language, framework, dependencies, package manager
- Analyze directory structure and identify patterns (MVC, services, etc.)
- Identify test framework and existing test coverage
- Identify CI/CD configuration
- Check for existing documentation and its freshness
- Scan for security issues (hardcoded secrets, vulnerable deps, common vulnerabilities)
- Save results to `.tyrex/map/`:
  - `architecture.md` - detected architecture
  - `tech-stack.md` - complete stack with versions
  - `security-audit.md` - vulnerabilities found
  - `codebase-summary.md` - structural summary

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

3. "Documentation level: always generate full docs, suggest per demand, or minimal?"
   - Options: `always` | `suggest` | `minimal` (default: suggest)

4. "Allow parallel execution of independent tasks?"
   - Options: yes | no (default: yes)

5. "Maximum parallel agents?"
   - Options: 1-10 (default: 5)

Save answers to `.tyrex/tyrex.yml`.

**Step 4: Summary**
Present a summary of:
- Stack detected
- Architecture detected
- Security issues found (if any)
- Configuration chosen
- Next step: "Run /tyrex.new to start your first feature"

### For empty/new projects:
If the directory is empty or has minimal files, skip the analysis phase and focus on asking the user what they want to build. Generate TYREX.md with the information they provide.

## Important Rules
- NEVER skip the security audit on existing projects
- ALWAYS generate `.tyrex/map/` files for existing projects
- Keep TYREX.md under 300 lines — be concise
- The constitution.md should be adapted to the detected stack (e.g., Ruby projects get Brakeman in CI, Node projects get npm audit, etc.)
