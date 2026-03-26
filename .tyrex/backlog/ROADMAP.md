# Tyrex Framework — Roadmap

> Generated from discuss session 2026-03-26
> This is a living document. Update via `/tyrex-backlog plan` or `/tyrex-discuss --backlog all`.

## Vision

Tyrex + Git + LLM = tríade do desenvolvimento de software de qualidade.
O usuário opera com 5 comandos core (discuss, backlog, quick, status, recover).
O framework cuida do resto.

## Phases

### Phase 1 — Command Resilience
> Melhora os comandos existentes para garantir precisão em contextos longos.

| Item | Title | Effort | Priority |
|------|-------|--------|----------|
| BL-001 | Checkpoint system | M | high |
| BL-002 | Guardrails inline | S | high |
| BL-004 | Next-action suggestion | S | high |

### Phase 2 — Backlog Core
> Cria o sistema de backlog e integra com discuss.

| Item | Title | Effort | Priority |
|------|-------|--------|----------|
| BL-007 | Comando /tyrex-backlog | L | high |
| BL-008 | Discuss <> backlog | M | high |
| BL-013 | Ready = confirmação humana | S | high |
| BL-012 | Prompt structuring | S | medium |

### Phase 3 — Git Integration
> Git como espinha dorsal — audit trail para tudo.

| Item | Title | Effort | Priority |
|------|-------|--------|----------|
| BL-014 | Commit de decisões | M | high |
| BL-015 | Git como memória | L | medium |

### Phase 4 — Execution Pipeline
> Conecta backlog à execução com pipeline completo.

| Item | Title | Effort | Priority |
|------|-------|--------|----------|
| BL-005 | Quick pipeline completo | L | high |
| BL-016 | Roadmap visual no quick | S | high |
| BL-006 | Revert seguro via git | M | high |
| BL-009 | Backlog > execução | M | high |

### Phase 5 — Polish
> Fecha o ciclo com automação e simplificação.

| Item | Title | Effort | Priority |
|------|-------|--------|----------|
| BL-003 | Audit de conformidade | M | medium |
| BL-010 | Review > backlog | S | medium |
| BL-011 | Fluxo de 5 comandos | M | medium |

## Key Decisions

1. Um comando `/tyrex-backlog` com subcomandos (add, edit, remove, view, plan, pick)
2. Backlog != Feature — maturação vs execução. Item vira feature quando `ready`
3. 5 comandos core: discuss, backlog, quick, status, recover
4. Quick = pipeline completo (new>plan>do>review) com relatório final
5. Revert seguro usando git (branch descartável, tags, squash on accept)
6. Discuss enriquece backlog bidireccionalmente
7. Framework nunca perde uma ideia — sempre oferece salvar no backlog
8. Quick mostra roadmap visual (fluxograma de tasks + BL-items) antes de executar
9. Backlog avulso (BL-NNN) ou completo (all)
10. Ready só com confirmação humana explícita — nunca automático
11. Git como audit trail — commits semânticos para decisões/discussões/planejamento
12. Tyrex + Git + LLM = tríade do desenvolvimento de qualidade
