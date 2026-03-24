# Diagram: Quick Rewrite & Doc Impact Analysis — Architecture

## Feature
Feature 021 — Quick Rewrite & Doc Impact Analysis

## Type
Architecture

## File
`docs/diagrams/021-quick-rewrite-doc-impact-architecture.d2`

## Render
```bash
d2 docs/diagrams/021-quick-rewrite-doc-impact-architecture.d2 docs/diagrams/021-quick-rewrite-doc-impact-architecture.svg
```

## Description
Shows `/tyrex-quick` as an orchestrator that delegates to full `new → plan → do` pipeline (no stages skipped, only approvals auto-accepted). Also shows the Doc Impact Analysis shared algorithm — its scan targets, match patterns, output format, and integration into 3 commands (plan, do, review).
