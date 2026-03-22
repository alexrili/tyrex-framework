# Feature 015: Skills Overhaul

## Objective
Comprehensive rewrite of all 5 existing skills and creation of 3 new skills to ensure concrete patterns, actionable review criteria, stack-agnostic coverage, and consistent depth across all skills.

## Acceptance Criteria
- All 8 skills have: Role, Expertise, Guidelines (~15 items), Patterns (3-5 concrete), Review Criteria (~15 items)
- All skills are ~100 lines (±20), eliminating the 42-vs-105 line disparity
- All skills are stack-agnostic with language-specific notes where needed
- qa-engineer: test design patterns, fixture patterns, flaky test diagnosis
- release-engineer: breaking change detection, rollback, hotfix patterns
- devsec: config management, threat modeling, supply chain patterns
- debugger: profiling, performance regression, memory analysis patterns
- copywriter: confirmation dialogs, progress indicators, structured lists
- NEW backend-engineer: connection pooling, N+1, caching, graceful shutdown, observability
- NEW frontend-engineer: a11y, performance, state management, bundle optimization
- NEW product-manager: user stories quality, acceptance criteria, scope control, prioritization
- templates/skills/ and .tyrex/skills/ both updated

## Out of Scope
- Changes to bin/tyrex.js
- Changes to command templates
- New command creation

## Skills
- copywriter (for consistent tone in skill file text)

## Status: spec
