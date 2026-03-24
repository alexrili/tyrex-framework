# Architecture Diagram — External Tracker Integration

## Render
```bash
d2 docs/diagrams/019-external-tracker-integration-architecture.d2 docs/diagrams/019-external-tracker-integration-architecture.svg
```

## Description
Shows the MCP-only architecture for bidirectional tracker integration:

- **Local Environment** — Tyrex CLI (config), commands (markdown prompts), and feature/task state files with `external_ref`/`external_task_ref`
- **AI Agent** — LLM receives instructions from commands, delegates to MCP client for tracker operations
- **MCP Servers** — Provider-specific servers (Jira Rovo, Linear, GitHub) handle auth and API translation
- **External Trackers** — The actual project management tools
- **Post-Dev Pipeline** — Dashed boundary showing where Tyrex's control ends (at "review") and human/pipeline takes over to "done"

Key flow: Commands instruct agent → Agent calls MCP tools → MCP server talks to tracker API. Tyrex CLI never makes HTTP calls directly.
