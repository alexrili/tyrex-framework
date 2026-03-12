# SPEC: Task 002 — Create D2 Diagram Templates

## Feature
Feature 004: Documentation System

## Objective
Create D2 language diagram templates for 4 diagram types plus a markdown wrapper document.

## Technical Approach
1. Create `templates/diagrams/` directory with 4 D2 template files:
   - `architecture.d2` — system components, their connections, layers (frontend, backend, data, external)
   - `sequence.d2` — interaction flow between actors/components with numbered steps
   - `data-flow.d2` — data transformation pipeline from input to output
   - `er.d2` — entity-relationship diagram for data models

2. Create `templates/diagram.md` — a markdown wrapper that:
   - References the demand/feature
   - Embeds D2 code in a fenced code block (```d2)
   - Includes a "Diagram Type" field and "Description" section
   - Has instructions for rendering: `d2 input.d2 output.svg`

3. Each .d2 file should:
   - Use annotated placeholders (D2 comments with `#`)
   - Include a realistic example structure (not just empty placeholders)
   - Follow D2 best practices (named connections, grouping, styling)

## Files Affected
- `templates/diagrams/architecture.d2` (new)
- `templates/diagrams/sequence.d2` (new)
- `templates/diagrams/data-flow.d2` (new)
- `templates/diagrams/er.d2` (new)
- `templates/diagram.md` (new)

## Testing Strategy
Quality: optional — validate D2 syntax is correct by reviewing against d2lang.com docs.
