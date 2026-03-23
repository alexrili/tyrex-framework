## Feature Context Resolution

**Every command that operates on a feature MUST resolve the active feature context before proceeding.**

Resolution order (first match wins):

1. **Flag override** — if the command was called with `--feature NNN`, use feature NNN directly. Read `.tyrex/state/features/NNN.yml`.
2. **Branch detection** — detect the current git branch name:
   - If branch matches `feat/NNN-*` or `feature/NNN-*`, extract NNN as the feature ID
   - Read `.tyrex/state/features/NNN.yml`
3. **Fallback** — read `cursor.yml` field `last_active_feature` (the most recently used feature in this checkout)
4. **No feature found** — present choices:
   ```
   No active feature detected.
     [1] Select from open features
     [2] Start a new feature (/tyrex-new)
   ```

**Per-feature state file** (`.tyrex/state/features/NNN.yml`):
```yaml
feature_id: "NNN"
name: "feature-slug"
feature_file: ".tyrex/features/NNN-feature-slug.md"
branch: "feat/NNN-feature-slug"
status: "spec|planned|in_progress|review|done"

# Task tracking (replaces cursor.yml task fields)
current_task_in_progress: null
in_progress_since: null
in_progress_files_touched: []
last_task_completed: null
last_commit: null

tasks_summary:
  total: 0
  completed: 0
  in_progress: 0
  pending: 0

# Task state files location
tasks_dir: ".tyrex/state/features/NNN/tasks/"

created_at: "YYYY-MM-DDTHH:MM:SSZ"
updated_at: "YYYY-MM-DDTHH:MM:SSZ"
```

**Global cursor.yml** (slimmed down):
```yaml
last_updated: "YYYY-MM-DDTHH:MM:SSZ"
session_id: null
agent_mode: "plan|build"
last_active_feature: "NNN"  # pointer to last used feature (for fallback)
```

**Commands MUST include this section** when they need feature context. Reference it as:
> See [Feature Context Resolution](#feature-context-resolution) for how the active feature is determined.
