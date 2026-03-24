import type { Plugin } from "@opencode-ai/plugin";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * Tyrex Framework Plugin for OpenCode
 *
 * Enforces agent mode switching (plan/build) when /tyrex-* commands are executed.
 * This provides mechanical guardrails — the plan agent literally cannot write files
 * because OpenCode's permission system denies edit operations.
 *
 * How it works:
 * 1. Each /tyrex-* command is mapped to an agent mode (plan or build)
 * 2. On command.execute.before, the plugin injects an AgentPart to switch
 *    to the correct agent before the command runs
 * 3. On permission.ask, if the current cursor.yml has agent_mode: "plan",
 *    edit permissions are denied as a safety net
 * 4. cursor.yml is updated with the new agent_mode
 */

// Map of tyrex commands to their required agent mode
const COMMAND_MODES: Record<string, "plan" | "build"> = {
  "tyrex-init": "plan",
  "tyrex-new": "plan",
  "tyrex-plan": "plan",
  "tyrex-discuss": "plan",
  "tyrex-status": "plan",
  "tyrex-review": "plan",
  "tyrex-settings": "plan",
  "tyrex-skills": "plan",
  "tyrex-evolve": "plan",
  "tyrex-help": "plan",
  "tyrex-readme": "plan",
  "tyrex-wiki": "plan",
  "tyrex-openapi": "plan",
  "tyrex-context": "plan",
  "tyrex-do": "build",
  "tyrex-quick": "build",
  // tyrex-recover and tyrex-handoff are dynamic — handled separately
};

function readCursorYml(directory: string): string | null {
  const cursorPath = join(directory, ".tyrex", "state", "cursor.yml");
  if (!existsSync(cursorPath)) return null;
  return readFileSync(cursorPath, "utf-8");
}

function getAgentMode(directory: string): string | null {
  const content = readCursorYml(directory);
  if (!content) return null;
  const match = content.match(/^agent_mode:\s*"?(\w+)"?/m);
  return match ? match[1] : null;
}

function setAgentMode(directory: string, mode: "plan" | "build"): void {
  const cursorPath = join(directory, ".tyrex", "state", "cursor.yml");
  if (!existsSync(cursorPath)) return;

  let content = readFileSync(cursorPath, "utf-8");

  if (content.match(/^agent_mode:/m)) {
    // Update existing field
    content = content.replace(
      /^agent_mode:\s*"?\w+"?/m,
      `agent_mode: "${mode}"`
    );
  } else {
    // Add field after session_id line, or at the top
    const sessionIdMatch = content.match(/^session_id:.*$/m);
    if (sessionIdMatch) {
      content = content.replace(
        sessionIdMatch[0],
        `${sessionIdMatch[0]}\nagent_mode: "${mode}"`
      );
    } else {
      content = `agent_mode: "${mode}"\n${content}`;
    }
  }

  writeFileSync(cursorPath, content);
}

function resolveResumeMode(directory: string): "plan" | "build" {
  const content = readCursorYml(directory);
  if (!content) return "plan";
  const match = content.match(/^last_action:\s*"?(\w+)"?/m);
  if (!match) return "plan";
  // If last action was during execution, resume in build mode
  const buildActions = [
    "task_started",
    "task_in_progress",
    "implementing",
  ];
  return buildActions.includes(match[1]) ? "build" : "plan";
}

export const TyrexPlugin: Plugin = async (ctx) => {
  const directory = ctx.directory;

  return {
    /**
     * Before a /tyrex-* command executes, switch to the correct agent
     * and update cursor.yml with the agent_mode
     */
    "command.execute.before": async (input, output) => {
      const command = input.command;

      // Only handle tyrex commands
      if (!command.startsWith("tyrex-")) return;

      let targetMode: "plan" | "build";

      if (command === "tyrex-recover") {
        targetMode = resolveResumeMode(directory);
      } else if (command === "tyrex-handoff") {
        // Handoff starts in plan mode (phases 0-3)
        targetMode = "plan";
      } else {
        targetMode = COMMAND_MODES[command] || "plan";
      }

      // Update cursor.yml
      setAgentMode(directory, targetMode);

      // Inject an agent switch part so OpenCode uses the right agent
      output.parts.push({
        type: "agent" as const,
        name: targetMode,
      } as any);
    },

    /**
     * Safety net: deny edit permissions when in plan mode.
     * This is the mechanical enforcement — even if the agent "forgets"
     * the instructions, the permission system blocks it.
     */
    "permission.ask": async (input, output) => {
      if (input.type !== "edit") return;

      const currentMode = getAgentMode(directory);
      if (currentMode !== "plan") return;

      // In plan mode, check if the file is a source code file
      // Allow edits to .tyrex/, docs/, and config files
      const pattern = input.pattern;
      const patterns = Array.isArray(pattern) ? pattern : pattern ? [pattern] : [];

      const isAllowedPath = patterns.every((p: string) => {
        return (
          p.startsWith(".tyrex/") ||
          p.startsWith("docs/") ||
          p === "CLAUDE.md" ||
          p === "AGENTS.md" ||
          p === "README.md" ||
          p.endsWith(".yml") ||
          p.endsWith(".yaml") ||
          p.endsWith(".json") ||
          p.endsWith(".md")
        );
      });

      if (!isAllowedPath) {
        output.status = "deny";
      }
    },
  };
};

export default TyrexPlugin;
