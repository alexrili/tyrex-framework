# Diagram: Tyrex Recover Architecture

## Type
Architecture

## Feature
020 — Tyrex Recover

## Render
```bash
d2 docs/diagrams/020-tyrex-recover-architecture.d2 docs/diagrams/020-tyrex-recover-architecture.svg
```

## Description
Shows the crash recovery flow: evidence sources (git state + Tyrex state) feed into the recovery engine (detection → forensics → diagnostic → user choices → auto-fix). All `/tyrex-*` commands include a lightweight pre-flight check that delegates to the same detection logic.
