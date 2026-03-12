# SPEC: Task 004 — Custom Doc Layers in tyrex.yml + Settings

## Feature
Feature 004: Documentation System

## Objective
Allow users to configure custom documentation layers beyond Tyrex's built-in types.

## Technical Approach
1. **tyrex.yml template**: Add `custom` array under `docs` section:
   ```yaml
   docs:
     # ... existing built-in docs ...
     custom: []
     # Example custom doc type:
     # custom:
     #   - name: "runbook"
     #     template: ".tyrex/templates/runbook.md"
     #     scope: "demand"        # "demand" | "task"
     #     mandatory: false
     #   - name: "test-plan"
     #     template: ".tyrex/templates/test-plan.md"
     #     scope: "demand"
     #     mandatory: true
   ```

2. **tyrex-settings.md**: Add dedicated "Documentation" section in the display. Include:
   - List of built-in doc types with enabled/disabled status
   - List of custom doc types (if any)
   - Options: toggle built-in docs, add custom doc type, remove custom doc type
   - When adding: ask for name, template path, scope, mandatory flag
   - Validate template file exists before saving

3. Update the live `tyrex.yml` in `.tyrex/` to match the new template structure.

## Files Affected
- `templates/tyrex.yml`
- `templates/commands/unified/tyrex-settings.md`
- `.tyrex/tyrex.yml` (live config)

## Testing Strategy
Quality: optional — validate YAML structure is parseable.
