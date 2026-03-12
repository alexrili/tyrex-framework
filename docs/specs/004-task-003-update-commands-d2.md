# SPEC: Task 003 — Update Commands to Use D2 and Offer Diagrams

## Feature
Feature 004: Documentation System

## Objective
Replace Mermaid references with D2 across commands and make diagram generation a prominent option in `/tyrex-new`.

## Technical Approach
1. **tyrex-new.md**: Move diagram from buried checklist item to a dedicated step. After doc generation, always ask: "Want to create a diagram for this demand? (architecture, sequence, data-flow, ER)". Generate using the D2 templates.

2. **tyrex-readme.md**: Replace Mermaid code block examples with D2. Update the rule "Mermaid diagrams are REQUIRED" to "D2 diagrams are REQUIRED".

3. **tyrex-wiki.md**: Replace Mermaid references with D2 in architecture.md guidance and rules section.

4. **tyrex-review.md**: Update Step 5 (documentation finalization) to check for diagram completeness using D2 format.

## Files Affected
- `templates/commands/unified/tyrex-new.md`
- `templates/commands/unified/tyrex-readme.md`
- `templates/commands/unified/tyrex-wiki.md`
- `templates/commands/unified/tyrex-review.md`

## Testing Strategy
Quality: optional — grep for remaining Mermaid references to confirm zero matches.
