# SPEC: Improve debugger skill

## Objective
Enhance debugger.md from 96 to ~120 lines by adding patterns for memory/profiling analysis, performance regression diagnosis, and metric-based debugging.

## Technical Approach
- Add memory/profiling analysis: heap snapshot interpretation, leak detection workflow, GC pressure indicators
- Add performance regression diagnosis: flamegraph reading, latency percentile analysis, bisect strategy
- Add metric-based debugging: APM trace correlation, distributed tracing context, log-metric-trace triangle
- Strengthen existing patterns with more specific triggers, steps, and resolution criteria
- Keep stack-agnostic with tool-specific notes (pprof, Chrome DevTools, py-spy, etc.)

## Files Affected
- `templates/skills/debugger.md`
- `.tyrex/skills/debugger.md`

## Testing Strategy
N/A (markdown documentation)
