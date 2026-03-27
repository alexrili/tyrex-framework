# SPEC: Task 2 — Add workflow.discuss_mode to tyrex.yml templates

## Objective
Add the `discuss_mode` toggle to the `workflow` section in both the tyrex.yml template
and the project instance.

## Technical Approach
1. In `templates/tyrex.yml`: add `discuss_mode: "discuss"` under `workflow:` section,
   replacing the comment about future toggles
2. In `.tyrex/tyrex.yml`: add the same field with value `"discuss"` (default)
3. Add comment explaining valid values: `"discuss"` | `"assumptions"`

## Files Affected
- `templates/tyrex.yml`
- `.tyrex/tyrex.yml`

## Depends On
None

## Wave
1
