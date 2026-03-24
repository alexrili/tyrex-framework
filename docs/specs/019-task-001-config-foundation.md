# SPEC: Config Foundation — External Tracker Integration

## Task
Feature 019, Task 1

## Objective
Establish the configuration and state model for external tracker integration across three files: tyrex.yml template, feature context resolution shared doc, and tyrex init CLI flow.

## Technical Approach
1. **tyrex.yml template** — Add `integrations.tracker` section with `provider`, `project`, `user` fields. Use `{{TRACKER_PROVIDER}}`, `{{TRACKER_PROJECT}}`, `{{TRACKER_USER}}` placeholders (defaulting to `null`/empty).
2. **feature-context-resolution.md** — Add `external_ref` block to per-feature state shape and `external_task_ref` block to per-task state shape. These are optional fields — absence means no tracker integration.
3. **bin/tyrex.js** — Add tracker config questions to the `installTyrexStructure()` / init flow. Questions: "Configure external tracker? [y/N]", provider selection (Jira/Linear/GitHub Issues/Skip), default project key, user email/handle. Write values to tyrex.yml via template interpolation.

## Constraints
- Zero new dependencies — use existing readline helpers (`ask`, `choose`, `confirm`)
- Tracker config is optional — default to `null` provider (no integration)
- No credentials stored — only provider, project, user identity

## Files Affected
- `templates/tyrex.yml` — add `integrations` section
- `templates/commands/shared/feature-context-resolution.md` — add external_ref/external_task_ref to state shapes
- `bin/tyrex.js` — add tracker questions to init flow

## Edge Cases
- User skips tracker config → provider stays `null`, no integration behavior activates
- User has existing tyrex.yml without `integrations` → commands check for field existence, skip gracefully

## Testing Strategy
Quality: optional. Manual verification that `tyrex init` asks tracker questions and writes config correctly.
