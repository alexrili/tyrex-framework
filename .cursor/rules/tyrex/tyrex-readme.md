---
description: "Generate or update a comprehensive README with diagrams and setup instructions"
---

# /tyrex-readme - Generate/Update README

You are the Tyrex Framework orchestrator. Generate a comprehensive, high-quality README for the project.

## Agent Mode

This command runs in **plan** mode. Set `agent_mode: "plan"` in `cursor.yml` as the FIRST action.
You MUST NOT write source code. You may create/modify only `README.md`, `docs/`, and `.tyrex/` files.

## Behavior

### Step 1: Deep project analysis

Analyze the ENTIRE project thoroughly:

- **Stack**: Language, framework, runtime versions, key dependencies
- **Structure**: Directory layout, monorepo detection, package organization
- **Scripts**: Available npm scripts, Makefile targets, rake tasks, etc.
- **Environment**: Required env vars (from .env.example, config files, docs)
- **Data flow**: How data moves through the system (API → DB, queues, etc.)
- **Entry points**: How to start the app (dev, prod, test)
- **Dependencies**: System-level deps (database, Redis, etc.)
- **CI/CD**: Detected CI config (GitHub Actions, GitLab CI, etc.)
- **License**: Detected license file
- **Existing README**: If exists, analyze what's current and what's outdated

### Step 2: Generate README

Generate a complete README.md with these sections:

```markdown
# Project Name

Brief compelling description (1-2 sentences).

![CI Status](badge) ![Version](badge) ![License](badge)

## Overview

What this project does, who it's for, key features (3-5 bullet points).

## Architecture

```d2
# System architecture — see templates/diagrams/architecture.d2
```

Brief explanation of the architecture.

## Prerequisites

- Node.js >= X.X
- PostgreSQL >= X.X
- Redis (optional)
- ...

## Quick Start

```bash
# Step-by-step commands that actually work
git clone ...
cd ...
npm install
cp .env.example .env
# Edit .env with your values
npm run db:setup
npm run dev
```

## Configuration

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| DATABASE_URL | PostgreSQL connection | Yes | - |
| ...

## Usage

### [Main use case 1]
```bash
# Example with real commands
```

### [Main use case 2]
...

## Project Structure

```
project/
├── src/
│   ├── api/          # REST API endpoints
│   ├── services/     # Business logic
│   └── models/       # Data models
├── tests/            # Test suite
└── ...
```

## Development

### Running Tests
```bash
npm test
```

### Code Style
```bash
npm run lint
```

## API Reference

Brief overview. See [full API docs](docs/api/) for details.

## Deployment

Brief deployment instructions or link to deployment guide.

## Contributing

Brief contributing guidelines or link to CONTRIBUTING.md.

## License

[License type] - see [LICENSE](LICENSE) for details.
```

### Step 3: Handle existing README

If a README.md already exists:
1. Compare existing content with generated content
2. Show a diff summary of what would change
3. Ask: "Update README? [Y] Replace [n] Cancel [m] Merge"
   - Y: Replace entirely
   - n: Cancel
   - merge: Keep user-written sections, update generated sections

### Step 4: Commit

Update CHANGELOG.md with the README change.
Handle commit based on configured mode (auto/approve).

## Important Rules
- D2 diagrams are REQUIRED for architecture section (d2lang.com). Use templates/diagrams/architecture.d2 as base
- Quick Start steps MUST be copy-pasteable and actually work
- Do NOT invent features or capabilities — only document what exists
- If the project has an API, mention it and link to `/tyrex-openapi` output if available
- Keep it under 300 lines — comprehensive but not bloated
- Use badges only if CI/CD is actually configured
