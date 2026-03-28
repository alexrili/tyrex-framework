# Tyrex Framework — Roadmap

> Generated from discuss session 2026-03-27
> Updated 2026-03-27 — Production-ready initiative planned
> This is a living document. Update via `/tyrex-backlog plan` or `/tyrex-discuss --backlog all`.

## Vision

Tyrex = Governança forte + Execução forte + Observabilidade + API-ready.
O framework que combina o melhor da governança (review, security, compliance, lifecycle)
com o melhor da execução (fresh context, wave parallelism, UAT, research-driven planning),
enforcement mecânico real (não apenas prompts), e dados estruturados prontos para API.
Tyrex + Git + LLM = tríade do desenvolvimento de software de qualidade.

## Completed (Phases 1-9)

All 27 items from EP-001 through EP-006 are done. See git history for details.

| Epic | Title | Items | Status |
|------|-------|-------|--------|
| EP-001 | Precisão e Resiliência dos Comandos | BL-001, BL-002, BL-003 | done |
| EP-002 | Fluxo Contínuo e Sequencial | BL-004, BL-005, BL-006, BL-016 | done |
| EP-003 | Sistema de Backlog e Roadmap | BL-007, BL-008, BL-009, BL-010, BL-013 | done |
| EP-004 | Git como Espinha Dorsal | BL-014 | done |
| EP-005 | Simplificação da Experiência | BL-011 | done |
| EP-006 | Execution Engine (inspirado no GSD) | BL-017 — BL-027 | done |

---

## EP-007 — Enforcement Mecânico

> Sair do "prompt pede" para "sistema força".
> Claude Code primeiro, arquitetura agnóstica ao LLM.

### Phase 10 — Hook Infrastructure & Core Enforcement

| Item | Title | Effort | Priority | Status |
|------|-------|--------|----------|--------|
| BL-028 | Claude Code hooks infrastructure | L | critical | ready |
| BL-029 | Plan mode enforcement hook | M | critical | ready |
| BL-030 | TDD enforcement hook | M | high | ready |
| BL-031 | CHANGELOG validation hook | S | high | ready |
| BL-032 | Semantic commit validation hook | S | high | ready |

### Phase 11 — Extended Validation

| Item | Title | Effort | Priority | Status |
|------|-------|--------|----------|--------|
| BL-033 | Version bump validation hook | S | medium | ready |

---

## EP-008 — Observabilidade e Métricas

> Saber o que aconteceu, com dados — não feeling.
> Depende de EP-007 (enforcement garante que métricas são confiáveis).

### Phase 11 — Metrics Foundation

| Item | Title | Effort | Priority | Status |
|------|-------|--------|----------|--------|
| BL-034 | Session log estruturado | L | high | done |
| BL-035 | Execution report | M | high | ready |
| BL-036 | Quality scorecard per feature | M | medium | ready |
| BL-037 | Context usage tracking real | S | medium | ready |

---

## EP-009 — Data Architecture (API-Ready)

> Dados em YAML, narrativa em MD com frontmatter.
> Breaking change: v2.0. Refatorar antes de schematizar.

### Phase 12 — Schema & Migration

| Item | Title | Effort | Priority | Status |
|------|-------|--------|----------|--------|
| BL-038 | JSON Schema definitions | XL | critical | ready |
| BL-039 | Migrar security findings MD → YAML | L | high | ready |
| BL-040 | Migrar bug findings MD → YAML | M | high | ready |
| BL-041 | Migrar test gaps MD → YAML | M | high | ready |
| BL-042 | Feature specs com frontmatter YAML | M | high | ready |
| BL-043 | Consolidar roadmap — fonte única | S | medium | ready |
| BL-045 | State normalization e cleanup | L | high | ready |

### Phase 13 — Events & Command Updates

| Item | Title | Effort | Priority | Status |
|------|-------|--------|----------|--------|
| BL-044 | Event stream append-only | L | medium | ready |
| BL-046 | Atualizar command templates (novos formatos) | XL | critical | ready |

---

## EP-010 — Governance Layer

> Controle, compliance, e visibilidade para equipes.
> Depende de EP-009 (governance precisa de dados estruturados).

### Phase 13 — Governance Foundation

| Item | Title | Effort | Priority | Status |
|------|-------|--------|----------|--------|
| BL-047 | Policy engine | L | high | ready |
| BL-048 | Approval gates configuráveis | M | medium | ready |
| BL-049 | Compliance report per feature | M | medium | ready |
| BL-050 | Drift detection | L | medium | ready |

---

## Dependency Graph

```
Phase 10 (enforcement foundation)
  BL-028 (hooks infra) ──────┐
  BL-029 (plan mode hook) ───┤ depends on BL-028
  BL-030 (TDD hook) ─────────┤ depends on BL-028
  BL-031 (changelog hook) ───┤ depends on BL-028
  BL-032 (commit lint hook) ─┘ depends on BL-028
                │
Phase 11 (validation + metrics)
  BL-033 (version bump hook) ─── depends on BL-028
  BL-034 (session log) ──────┐
  BL-035 (exec report) ──────┤ depends on BL-034
  BL-036 (quality scorecard) ┤ depends on BL-034
  BL-037 (context tracking) ─┘ depends on BL-034
                │
Phase 12 (data architecture)
  BL-038 (schemas) ──────────┐
  BL-039 (security → YAML) ──┤ depends on BL-038
  BL-040 (bugs → YAML) ──────┤ depends on BL-038
  BL-041 (tests → YAML) ─────┤ depends on BL-038
  BL-042 (feature frontmatter)┤
  BL-043 (roadmap consolidate)┤
  BL-045 (state normalize) ──┘
                │
Phase 13 (events + governance)
  BL-044 (event stream) ─────── depends on BL-038
  BL-046 (update commands) ──── depends on BL-039, BL-040, BL-041, BL-042
  BL-047 (policy engine) ────── depends on BL-046
  BL-048 (approval gates) ───── depends on BL-047
  BL-049 (compliance report) ── depends on BL-047, BL-044
  BL-050 (drift detection) ──── depends on BL-046
```

## Key Decisions (v2.0)

1. Breaking change — v2.0 não suporta formato v1.x (migration guide incluído)
2. Dados em YAML, narrativa em MD com frontmatter — princípio universal
3. Consolidados manuais eliminados — queries sobre dados estruturados
4. Enforcement mecânico via hooks — Claude Code primeiro, extensível
5. Event stream append-only — audit trail completo, event sourcing ready
6. JSON Schemas como contrato — validação + documentação + API contract
7. Policies configuráveis — governance as code
8. Cada artefato tem refs — grafo de relacionamento completo
9. Feature IDs padronizados (string zero-padded "NNN")
10. map/ eliminado — scan on-demand substitui snapshot estático

## Summary

- **Completed:** 27 items (BL-001 — BL-027), epics EP-001 — EP-006
- **Planned:** 23 items (BL-028 — BL-050), epics EP-007 — EP-010
- **Phases:** 10 — 13 (4 new phases)
- **Target version:** v2.0.0 (breaking change)
- **Effort estimate:** 6 XL + 7 L + 6 M + 4 S = 23 items
