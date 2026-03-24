### Planning Checklist (canonical rules — inline in every command that plans tasks)

Before proposing tasks:

1. **Security-first analysis** — identify security-sensitive areas (data handling, user input, auth, APIs, encryption, file system). If detected and no `devsec.md` skill exists, suggest creating it. Cross-reference `.tyrex/security/audit.md` pending findings with feature scope.
2. **Cross-reference coverage gaps** — if `.tyrex/tests/coverage-gaps.md` exists, compare gaps against proposed task files. Note overlaps.
3. **Task rules:** each task completable in ONE commit. Same-file tasks CANNOT be parallel. Security tasks execute first. Each task gets: dependency ordering, parallelism markers, skill assignment, quality strategy, SPEC draft.
4. **Quality strategy per task:** `required` for API/workers/data/security areas. `recommended` for frontend/mobile. `optional` for infra/config/docs. Override from `tyrex.yml` quality section.
5. **Security tasks are mandatory** — if ANY security-sensitive area detected, add a dedicated security hardening task. Security tasks are never skippable.
