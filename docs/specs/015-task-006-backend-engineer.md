# SPEC: Create backend-engineer skill

## Objective
Create a new backend-engineer.md (~100 lines) defining the role, expertise areas, guidelines, patterns, and review criteria for backend engineering.

## Technical Approach
- Define role as senior backend engineer focused on reliability, performance, and maintainability
- Add patterns for connection pooling and resource management: pool sizing, health checks, leak prevention
- Add N+1 query prevention: eager loading rules, query count assertions, ORM pitfalls
- Add caching strategy: layered cache (L1 in-process, L2 distributed), invalidation patterns, TTL policy
- Add graceful shutdown: signal handling, drain period, in-flight request completion
- Add structured logging/observability: correlation IDs, log levels policy, metric naming conventions
- Add error handling taxonomy: retriable vs fatal, error wrapping, user-facing vs internal errors
- Add API design patterns: pagination, idempotency keys, versioning strategy
- Stack-agnostic with language notes (Node.js, Python, Go, Java)

## Files Affected
- `templates/skills/backend-engineer.md` (NEW)
- `.tyrex/skills/backend-engineer.md` (NEW)

## Testing Strategy
N/A (markdown documentation)
