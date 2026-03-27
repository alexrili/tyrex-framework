# Tyrex Framework — Roadmap

> Generated from discuss session 2026-03-27
> Updated 2026-03-27 — All items complete
> This is a living document. Update via `/tyrex-backlog plan` or `/tyrex-discuss --backlog all`.

## Vision

Tyrex = Governança forte + Execução forte.
O framework que combina o melhor da governança (review, security, compliance, lifecycle)
com o melhor da execução (fresh context, wave parallelism, UAT, research-driven planning).
Tyrex + Git + LLM = tríade do desenvolvimento de software de qualidade.

## Completed (Phases 1-5)

All 13 items from EP-001 through EP-005 are done. See git history for details.

| Epic | Title | Items | Status |
|------|-------|-------|--------|
| EP-001 | Precisão e Resiliência dos Comandos | BL-001, BL-002, BL-003 | done |
| EP-002 | Fluxo Contínuo e Sequencial | BL-004, BL-005, BL-006, BL-016 | done |
| EP-003 | Sistema de Backlog e Roadmap | BL-007, BL-008, BL-009, BL-010, BL-013 | done |
| EP-004 | Git como Espinha Dorsal | BL-014 | done |
| EP-005 | Simplificação da Experiência | BL-011 | done |

---

## EP-006 — Execution Engine (inspirado no GSD) ✓ COMPLETE

> Combinar a governança do Tyrex com a engine de execução do GSD.
> Transformar Tyrex no framework que une governança forte a execução forte.

### Phase 6 — Foundation: Context & Execution ✓

| Item | Title | Effort | Priority | Status | Feature |
|------|-------|--------|----------|--------|---------|
| BL-017 | Fresh Context per Task | XL | critical | done | #029 |
| BL-018 | Wave Execution com dependency graph | XL | critical | done | #030 |
| BL-019 | Context Monitor | M | high | done | #031 |

### Phase 7 — Pipeline Evolution ✓

| Item | Title | Effort | Priority | Status | Feature |
|------|-------|--------|----------|--------|---------|
| BL-020 | Verify/UAT como etapa do pipeline | L | critical | done | #032 |
| BL-021 | Research integrado no plan | L | high | done | #033 |
| BL-022 | Ship/PR command | M | high | done | #034 |

### Phase 8 — Intelligence ✓

| Item | Title | Effort | Priority | Status | Feature |
|------|-------|--------|----------|--------|---------|
| BL-023 | Discuss Mode: Assumptions | M | medium | done | #035 |
| BL-024 | Seeds (ideias com trigger conditions) | M | medium | done | #036 |
| BL-025 | Threads (cross-session persistent context) | M | medium | done | #037 |

### Phase 9 — Scale ✓

| Item | Title | Effort | Priority | Status | Feature |
|------|-------|--------|----------|--------|---------|
| BL-026 | Milestones (agrupar features em releases) | L | medium | done | #038 |
| BL-027 | Workstreams (parallel namespaced work) | L | low | done | #039 |

## Dependency Graph (completed)

```
Phase 6 (foundation) ✓
  BL-017 (fresh context) ──┐
  BL-018 (wave execution) ─┤──→ Phase 7 (pipeline) ✓
  BL-019 (context monitor) ┘      BL-020 (verify/UAT)
                                   BL-021 (research in plan) ──→ Phase 8 (intelligence) ✓
                                   BL-022 (ship/PR)                BL-023 (assumptions)
                                                                   BL-024 (seeds)
                                                                   BL-025 (threads)
                                                                        │
                                                                        ▼
                                                                   Phase 9 (scale) ✓
                                                                     BL-026 (milestones)
                                                                     BL-027 (workstreams)
```

## Key Decisions

1. Fresh context per task é a fundação — tudo depende disso
2. Wave execution constrói sobre fresh context (cada wave = N sub-agents paralelos)
3. Verify/UAT entra no pipeline entre do e review
4. Research torna-se parte automática do plan (toggle configurável)
5. Ship/PR fecha o ciclo de entrega
6. Assumptions mode e seeds são intelligence layer — melhoram com o tempo
7. Milestones e workstreams são escala — necessários para projetos grandes
8. Backward compatible — nenhuma mudança quebra o workflow existente
9. Cada item é uma feature independente, executável via /tyrex-quick
10. Phase 6 é blocking — phases 7-9 dependem da foundation

## Summary

All 27 backlog items (BL-001 through BL-027) are complete.
EP-006 delivered 11 features (#029 through #039) across 4 phases.
Version progression: v1.12.0 → v1.23.0.
