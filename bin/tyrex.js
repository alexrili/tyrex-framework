#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

// ─── Constants ───────────────────────────────────────────────
const VERSION = require("../package.json").version;
const TEMPLATES_DIR = path.join(__dirname, "..", "templates");
const HOME_DIR = os.homedir();
const GLOBAL_TYREX_DIR = path.join(HOME_DIR, ".tyrex");

const AGENTS = {
  claude: {
    name: "Claude Code",
    commandsDir: ".claude/commands",
    commandsSrc: "commands/unified",
    rulesFile: "CLAUDE.md",
    rulesTemplate: "CLAUDE.md",
    needsProjectSymlink: true, // symlink to global for auto-updates
  },
  opencode: {
    name: "OpenCode",
    commandsDir: ".opencode/commands",
    commandsSrc: "commands/unified",
    rulesFile: "AGENTS.md",
    rulesTemplate: "AGENTS.md",
    needsProjectSymlink: true, // symlink to global for auto-updates
  },
  cursor: {
    name: "Cursor",
    commandsDir: ".cursor/rules/tyrex",
    commandsSrc: "commands/unified",
    rulesFile: "CLAUDE.md",
    rulesTemplate: "CLAUDE.md",
    needsProjectSymlink: true, // symlink to global for auto-updates
  },
  codex: {
    name: "Codex",
    commandsDir: ".codex/skills/tyrex",
    commandsSrc: "commands/unified",
    rulesFile: "CLAUDE.md",
    rulesTemplate: "CLAUDE.md",
    needsProjectSymlink: true, // symlink to global for auto-updates
  },
};

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;

// ─── CLI Interface ───────────────────────────────────────────

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function choose(question, options) {
  console.log(`\n${c("cyan", question)}`);
  options.forEach((opt, i) => {
    const marker = opt.default ? c("green", " (default)") : "";
    console.log(`  ${c("bold", `[${i + 1}]`)} ${opt.label}${marker}`);
    if (opt.desc) console.log(`      ${c("dim", opt.desc)}`);
  });
  const answer = await ask(`\n  ${c("dim", "Choice [1]:")} `);
  const idx = answer === "" ? 0 : parseInt(answer, 10) - 1;
  return options[idx] || options[0];
}

async function confirm(question, defaultYes = true) {
  const hint = defaultYes ? "Y/n" : "y/N";
  const answer = await ask(`${c("cyan", question)} ${c("dim", `[${hint}]:`)} `);
  if (answer === "") return defaultYes;
  return answer.toLowerCase().startsWith("y");
}

// ─── File Operations ─────────────────────────────────────────

function copyTemplate(templateName, destPath, replacements = {}) {
  const srcPath = path.join(TEMPLATES_DIR, templateName);
  if (!fs.existsSync(srcPath)) {
    console.log(c("red", `  Missing template: ${templateName}. Run 'tyrex --force' to reinstall.`));
    return false;
  }
  let content = fs.readFileSync(srcPath, "utf-8");
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  const dir = path.dirname(destPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(destPath, content);
  return true;
}

/**
 * Copy a template only if the destination doesn't already exist.
 * Core files (TYREX.md, constitution.md, cursor.yml, tyrex.yml, roadmap.yml)
 * evolve over time and must NOT be overwritten by a re-install.
 * Use --force to explicitly reset them to template defaults.
 */
function copyTemplateIfNew(templateName, destPath, replacements = {}, force = false) {
  if (!force && fs.existsSync(destPath)) {
    console.log(c("dim", `  Skipped ${path.relative(process.cwd(), destPath)} (exists). Use --force to overwrite.`));
    return false;
  }
  return copyTemplate(templateName, destPath, replacements);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Create a directory symlink. Handles existing symlinks, regular dirs, and missing targets.
 * Returns true if symlink was created/updated, false otherwise.
 */
function createDirSymlink(target, linkPath) {
  // Check if target exists
  if (!fs.existsSync(target)) {
    console.log(c("yellow", `  Skipped symlink ${path.relative(process.cwd(), linkPath)} — target directory not found.`));
    return false;
  }

  // Ensure parent directory exists
  ensureDir(path.dirname(linkPath));

  // Check if linkPath already exists
  let exists = false;
  try {
    const stat = fs.lstatSync(linkPath);
    exists = true;
    if (stat.isSymbolicLink()) {
      const currentTarget = fs.readlinkSync(linkPath);
      if (currentTarget === target) {
        console.log(c("dim", `  Symlink already correct: ${path.relative(process.cwd(), linkPath)}`));
        return true;
      }
      // Wrong target — remove and recreate
      fs.unlinkSync(linkPath);
    } else if (stat.isDirectory()) {
      console.log(c("yellow", `  ${path.relative(process.cwd(), linkPath)} is a directory (not a symlink). Remove it manually to re-link.`));
      return false;
    }
  } catch (err) {
    // lstat throws if path doesn't exist — that's fine
  }

  fs.symlinkSync(target, linkPath, "dir");
  console.log(c("green", `  Symlink: ${path.relative(process.cwd(), linkPath)} -> ${target}`));
  return true;
}

// ─── Global Installation ─────────────────────────────────────

function installCommandsGlobal(agent) {
  const agentConfig = AGENTS[agent];
  const commandsTarget = path.join(HOME_DIR, agentConfig.commandsDir);
  const commandsSrc = path.join(TEMPLATES_DIR, agentConfig.commandsSrc);

  ensureDir(commandsTarget);

  const commandFiles = fs.readdirSync(commandsSrc).filter((f) => f.endsWith(".md"));
  let count = 0;

  for (const file of commandFiles) {
    const src = path.join(commandsSrc, file);
    const dest = path.join(commandsTarget, file);
    fs.copyFileSync(src, dest);
    count++;
  }

  console.log(c("green", `  Installed ${count} commands to ~/${agentConfig.commandsDir}/`));
  return count;
}

function installGlobalTemplates() {
  const globalTemplatesDir = path.join(GLOBAL_TYREX_DIR, "templates");
  ensureDir(globalTemplatesDir);

  // Reference templates — these are used by AI agents as starting points
  const templates = [
    "feature.md", "adr.md", "rfc.md", "review-checklist.md",
    "spec.md", "srs.md", "prd.md", "skill.md", "diagram.md",
  ];

  for (const tmpl of templates) {
    const src = path.join(TEMPLATES_DIR, tmpl);
    const dest = path.join(globalTemplatesDir, tmpl);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  // D2 diagram templates
  const diagramsSrc = path.join(TEMPLATES_DIR, "diagrams");
  if (fs.existsSync(diagramsSrc)) {
    const diagramsTarget = path.join(globalTemplatesDir, "diagrams");
    ensureDir(diagramsTarget);
    const diagramFiles = fs.readdirSync(diagramsSrc);
    for (const file of diagramFiles) {
      fs.copyFileSync(
        path.join(diagramsSrc, file),
        path.join(diagramsTarget, file)
      );
    }
  }

  // Skills templates (inside templates dir for backward compat)
  const skillsSrc = path.join(TEMPLATES_DIR, "skills");
  if (fs.existsSync(skillsSrc)) {
    const skillsTarget = path.join(globalTemplatesDir, "skills");
    ensureDir(skillsTarget);
    const skillFiles = fs.readdirSync(skillsSrc);
    for (const file of skillFiles) {
      fs.copyFileSync(
        path.join(skillsSrc, file),
        path.join(skillsTarget, file)
      );
    }
  }

  // Skills — dedicated global dir for project symlinking
  if (fs.existsSync(skillsSrc)) {
    const globalSkillsDir = path.join(GLOBAL_TYREX_DIR, "skills");
    ensureDir(globalSkillsDir);
    const skillFiles = fs.readdirSync(skillsSrc);
    for (const file of skillFiles) {
      fs.copyFileSync(
        path.join(skillsSrc, file),
        path.join(globalSkillsDir, file)
      );
    }
    console.log(c("green", `  Installed skills to ~/.tyrex/skills/`));
  }

  // Hooks — copy to global templates for project symlinking
  const hooksSrc = path.join(TEMPLATES_DIR, "hooks");
  if (fs.existsSync(hooksSrc)) {
    const hooksTarget = path.join(globalTemplatesDir, "hooks");
    ensureDir(hooksTarget);
    ensureDir(path.join(hooksTarget, "lib"));
    ensureDir(path.join(hooksTarget, "validators"));
    const hookEntries = [
      "pre-tool-use.sh", "pre-commit.sh", "commit-msg.sh",
    ];
    for (const file of hookEntries) {
      const src = path.join(hooksSrc, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(hooksTarget, file));
      }
    }
    // Copy lib/common.sh
    const commonSrc = path.join(hooksSrc, "lib", "common.sh");
    if (fs.existsSync(commonSrc)) {
      fs.copyFileSync(commonSrc, path.join(hooksTarget, "lib", "common.sh"));
    }
    // Copy validators/.gitkeep
    const gitkeepSrc = path.join(hooksSrc, "validators", ".gitkeep");
    if (fs.existsSync(gitkeepSrc)) {
      fs.copyFileSync(gitkeepSrc, path.join(hooksTarget, "validators", ".gitkeep"));
    }
    console.log(c("green", `  Installed hooks to ~/.tyrex/templates/hooks/`));
  }

  console.log(c("green", `  Installed templates to ~/.tyrex/templates/`));
}

function installGlobalRulesTemplates() {
  // Store rules templates globally so `tyrex init` can copy them to projects
  const rulesDir = path.join(GLOBAL_TYREX_DIR, "rules");
  ensureDir(rulesDir);

  const rulesTemplates = ["CLAUDE.md", "AGENTS.md"];
  for (const tmpl of rulesTemplates) {
    const src = path.join(TEMPLATES_DIR, tmpl);
    const dest = path.join(rulesDir, tmpl);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  // Store core config templates globally for `tyrex init`
  const configTemplates = [
    "tyrex.yml", "TYREX.md", "constitution.md", "cursor.yml",
    "roadmap.yml", "CHANGELOG.md",
  ];
  const configDir = path.join(GLOBAL_TYREX_DIR, "config-templates");
  ensureDir(configDir);

  for (const tmpl of configTemplates) {
    const src = path.join(TEMPLATES_DIR, tmpl);
    const dest = path.join(configDir, tmpl);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }
}

// ─── Hooks Installation ─────────────────────────────────────

function installHooks(projectDir, detectedAgents) {
  const tyrexDir = path.join(projectDir, ".tyrex");
  const hooksDir = path.join(tyrexDir, "hooks");
  const globalHooksDir = path.join(GLOBAL_TYREX_DIR, "templates", "hooks");

  // Check if global hook templates exist
  if (!fs.existsSync(globalHooksDir)) {
    console.log(c("dim", "  Hooks templates not found — skipping hook installation."));
    return;
  }

  // Copy hook scripts to .tyrex/hooks/
  ensureDir(hooksDir);
  ensureDir(path.join(hooksDir, "lib"));
  ensureDir(path.join(hooksDir, "validators"));

  const hookFiles = [
    { src: "pre-tool-use.sh", dest: "pre-tool-use.sh" },
    { src: "pre-commit.sh", dest: "pre-commit.sh" },
    { src: "commit-msg.sh", dest: "commit-msg.sh" },
    { src: "lib/common.sh", dest: "lib/common.sh" },
  ];

  for (const { src, dest } of hookFiles) {
    const srcPath = path.join(globalHooksDir, src);
    const destPath = path.join(hooksDir, dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      fs.chmodSync(destPath, 0o755);
    }
  }

  // Preserve existing custom validators — only copy .gitkeep if empty
  const validatorsDir = path.join(hooksDir, "validators");
  const validatorFiles = fs.readdirSync(validatorsDir).filter((f) => f !== ".gitkeep");
  if (validatorFiles.length === 0) {
    const gitkeepSrc = path.join(globalHooksDir, "validators", ".gitkeep");
    if (fs.existsSync(gitkeepSrc)) {
      fs.copyFileSync(gitkeepSrc, path.join(validatorsDir, ".gitkeep"));
    }
  }

  console.log(c("green", "  Installed hooks to .tyrex/hooks/"));

  // ─── Claude Code hooks config ───────────────────────────────
  if (detectedAgents.includes("claude")) {
    const claudeDir = path.join(projectDir, ".claude");
    ensureDir(claudeDir);
    const settingsPath = path.join(claudeDir, "settings.json");

    let settings = {};
    if (fs.existsSync(settingsPath)) {
      try {
        settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
      } catch (err) {
        console.log(c("yellow", "  Could not parse .claude/settings.json — creating fresh hooks config."));
      }
    }

    // Merge hooks config (don't overwrite existing hooks for other events)
    if (!settings.hooks) settings.hooks = {};

    settings.hooks.PreToolUse = [
      {
        matcher: "Edit|Write",
        hooks: [
          {
            type: "command",
            command: ".tyrex/hooks/pre-tool-use.sh",
          },
        ],
      },
    ];

    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
    console.log(c("green", "  Configured Claude Code hooks in .claude/settings.json"));
  }

  // ─── Git hooks (symlinks) ────────────────────────────────────
  const gitHooksDir = path.join(projectDir, ".git", "hooks");
  if (fs.existsSync(path.join(projectDir, ".git"))) {
    ensureDir(gitHooksDir);

    const gitHooks = [
      { hook: "pre-commit", target: "pre-commit.sh" },
      { hook: "commit-msg", target: "commit-msg.sh" },
    ];

    for (const { hook, target } of gitHooks) {
      const hookPath = path.join(gitHooksDir, hook);
      const targetPath = path.join(tyrexDir, "hooks", target);

      // Skip if hook already exists and is not a Tyrex symlink
      try {
        const stat = fs.lstatSync(hookPath);
        if (stat.isSymbolicLink()) {
          const current = fs.readlinkSync(hookPath);
          if (current === targetPath) continue; // Already correct
          fs.unlinkSync(hookPath); // Wrong target — recreate
        } else {
          // Existing non-symlink hook — don't overwrite (user's custom hook)
          console.log(c("yellow", `  Git hook ${hook} exists (not a symlink) — skipped. Link manually to .tyrex/hooks/${target}`));
          continue;
        }
      } catch (err) {
        // Doesn't exist — create
      }

      fs.symlinkSync(targetPath, hookPath);
      console.log(c("green", `  Git hook: ${hook} -> .tyrex/hooks/${target}`));
    }
  }
}

// ─── Project Initialization ─────────────────────────────────

function detectGlobalAgents() {
  const detected = [];
  for (const [key, agentConfig] of Object.entries(AGENTS)) {
    const commandsDir = path.join(HOME_DIR, agentConfig.commandsDir);
    if (fs.existsSync(commandsDir)) {
      detected.push(key);
    }
  }
  return detected;
}

function initProject(projectDir, config, force = false) {
  const tyrexDir = path.join(projectDir, ".tyrex");

  // Check if global install exists
  if (!fs.existsSync(path.join(GLOBAL_TYREX_DIR, "templates"))) {
    console.log(c("red", "  Global installation not found. Run 'tyrex' to install."));
    return false;
  }

  // Project-specific directories
  ensureDir(path.join(tyrexDir, "state", "tasks"));
  ensureDir(path.join(tyrexDir, "state", "features"));
  ensureDir(path.join(tyrexDir, "features"));
  ensureDir(path.join(tyrexDir, "map"));
  ensureDir(path.join(tyrexDir, "context"));

  // Docs directories
  ensureDir(path.join(projectDir, "docs", "adrs"));
  ensureDir(path.join(projectDir, "docs", "rfcs"));
  ensureDir(path.join(projectDir, "docs", "wiki"));
  ensureDir(path.join(projectDir, "docs", "diagrams"));
  ensureDir(path.join(projectDir, "docs", "specs"));
  ensureDir(path.join(projectDir, "docs", "srs"));
  ensureDir(path.join(projectDir, "docs", "prd"));

  const replacements = {
    PROJECT_NAME: config.projectName || path.basename(projectDir),
    DATE: new Date().toISOString().split("T")[0],
    COMMIT_MODE: config.commits || "approve",
    BRANCH_MODE: config.branches || "approve",
    DOC_MODE: config.documentation || "suggest",
    MAX_AGENTS: String(config.maxAgents || 5),
    COMMIT_STYLE: config.commitStyle || "conventional",
    BRANCH_PREFIX: config.branchPrefix || "feat/",
    TRACKER_PROVIDER: config.trackerProvider || "null",
    TRACKER_PROJECT: config.trackerProject || "",
    TRACKER_USER: config.trackerUser || "",
  };

  // Core config files — project-specific, copied with interpolation
  copyTemplateIfNew("tyrex.yml", path.join(tyrexDir, "tyrex.yml"), replacements, force);
  copyTemplateIfNew("TYREX.md", path.join(tyrexDir, "TYREX.md"), replacements, force);
  copyTemplateIfNew("constitution.md", path.join(tyrexDir, "constitution.md"), replacements, force);
  copyTemplateIfNew("cursor.yml", path.join(tyrexDir, "state", "cursor.yml"), replacements, force);
  copyTemplateIfNew("roadmap.yml", path.join(tyrexDir, "roadmap.yml"), replacements, force);

  // Templates — symlink to global
  const templatesLink = path.join(tyrexDir, "templates");
  const globalTemplates = path.join(GLOBAL_TYREX_DIR, "templates");
  createDirSymlink(globalTemplates, templatesLink);

  // Skills — symlink to global (auto-updates on npm install -g)
  // If .tyrex/skills/ already exists as a regular directory (customized), preserve it
  const skillsLink = path.join(tyrexDir, "skills");
  const globalSkills = path.join(GLOBAL_TYREX_DIR, "skills");
  if (fs.existsSync(globalSkills)) {
    try {
      const stat = fs.lstatSync(skillsLink);
      if (stat.isDirectory() && !stat.isSymbolicLink()) {
        console.log(c("dim", `  Skills dir exists (customized) — preserved. Symlink skipped.`));
      } else {
        createDirSymlink(globalSkills, skillsLink);
      }
    } catch (err) {
      // Does not exist yet — create symlink
      createDirSymlink(globalSkills, skillsLink);
    }
  }

  // Rules files — copied (customizable per project)
  const installedRules = new Set();
  const detectedAgents = detectGlobalAgents();
  for (const agentKey of detectedAgents) {
    const agentConfig = AGENTS[agentKey];
    const rulesFile = agentConfig.rulesFile;
    if (!installedRules.has(rulesFile)) {
      const rulesPath = path.join(projectDir, rulesFile);
      if (copyTemplateIfNew(agentConfig.rulesTemplate, rulesPath, replacements, force)) {
        console.log(c("green", `  Created ${rulesFile}`));
      }
      installedRules.add(rulesFile);
    }
  }

  // Agent symlinks — ALL agents get symlinks to global commands for auto-updates
  for (const agentKey of detectedAgents) {
    const agentConfig = AGENTS[agentKey];
    const globalCommandsDir = path.join(HOME_DIR, agentConfig.commandsDir);
    const localCommandsDir = path.join(projectDir, agentConfig.commandsDir);
    createDirSymlink(globalCommandsDir, localCommandsDir);
  }

  // CHANGELOG.md — never overwrite
  const changelogPath = path.join(projectDir, "docs", "CHANGELOG.md");
  copyTemplateIfNew("CHANGELOG.md", changelogPath, replacements);

  // ─── Hooks installation ─────────────────────────────────────
  installHooks(projectDir, detectedAgents);

  console.log(c("green", "  Created .tyrex/ directory structure"));
  console.log(c("green", "  Created docs/ directory structure"));

  if (detectedAgents.length > 0) {
    console.log(c("dim", `  Detected agents: ${detectedAgents.map((a) => AGENTS[a].name).join(", ")}`));
  }

  return true;
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Non-interactive flags
  const flags = {
    claude: args.includes("--claude"),
    opencode: args.includes("--opencode"),
    cursor: args.includes("--cursor"),
    codex: args.includes("--codex"),
    all: args.includes("--all"),
    uninstall: args.includes("--uninstall"),
    defaults: args.includes("--defaults") || args.includes("-d"),
    force: args.includes("--force") || args.includes("-f"),
    upgrade: args.includes("--upgrade"),
  };

  // ─── Silent upgrade (called by postinstall) ───
  if (flags.upgrade) {
    rl.close();
    const detectedAgents = detectGlobalAgents();
    if (detectedAgents.length === 0) {
      // No agents configured — nothing to upgrade
      process.exit(0);
    }
    for (const a of detectedAgents) {
      installCommandsGlobal(a);
    }
    installGlobalTemplates();
    installGlobalRulesTemplates();
    console.log(c("green", `\n  [tyrex] v${VERSION} — commands synced for ${detectedAgents.map((a) => AGENTS[a].name).join(", ")}.`));
    process.exit(0);
  }

  console.log("");
  console.log(c("bold", "  ╔══════════════════════════════════════╗"));
  console.log(c("bold", "  ║") + c("green", "          TYREX Framework") + c("bold", "             ║"));
  console.log(c("bold", "  ║") + c("dim", "   Human-driven, AI-accelerated") + c("bold", "      ║"));
  console.log(c("bold", "  ║") + c("dim", `            v${VERSION}`) + c("bold", "                    ║"));
  console.log(c("bold", "  ╚══════════════════════════════════════╝"));
  console.log("");

  if (command === "version" || args.includes("--version") || args.includes("-v")) {
    console.log(`  tyrex v${VERSION}`);
    rl.close();
    return;
  }

  if (command === "help" || args.includes("--help") || args.includes("-h")) {
    printHelp();
    rl.close();
    return;
  }

  // ─── Uninstall ───
  if (flags.uninstall) {
    await handleUninstall(flags);
    rl.close();
    return;
  }

  // ─── Init subcommand ───
  if (command === "init") {
    console.log(c("bold", "  Project Initialization\n"));

    let config;
    if (flags.defaults) {
      console.log(c("dim", "  Using default configuration.\n"));
      config = {
        projectName: path.basename(process.cwd()),
        commits: "approve",
        branches: "approve",
        documentation: "suggest",
        maxAgents: 5,
        commitStyle: "conventional",
        branchPrefix: "feat/",
        trackerProvider: null,
        trackerProject: "",
        trackerUser: "",
      };
    } else {
      console.log(c("bold", "  Configuration\n"));

      const commitMode = await choose("Commit mode:", [
        { label: "Approve", desc: "Review and approve each commit", default: true },
        { label: "Auto", desc: "Commit automatically after each task" },
      ]);

      const branchMode = await choose("Branch creation:", [
        { label: "Approve", desc: "Tyrex suggests branch name, you approve", default: true },
        { label: "Auto", desc: "Create branches automatically" },
      ]);

      const docMode = await choose("Documentation level:", [
        { label: "Suggest", desc: "Suggest docs per demand, you choose", default: true },
        { label: "Always", desc: "Always generate full documentation (ADR, RFC, Wiki)" },
        { label: "Minimal", desc: "Only CHANGELOG (mandatory) + TYREX.md" },
      ]);

      // Tracker integration (optional)
      let trackerProvider = null;
      let trackerProject = "";
      let trackerUser = "";

      const useTracker = await confirm("Configure external tracker integration (Jira, Linear, GitHub Issues)?", false);
      if (useTracker) {
        const providerChoice = await choose("Tracker provider:", [
          { label: "Jira", desc: "Atlassian Jira (requires Jira MCP server)", default: true },
          { label: "Linear", desc: "Linear (requires Linear MCP server)" },
          { label: "GitHub Issues", desc: "GitHub Issues (requires GitHub MCP server)" },
        ]);
        trackerProvider = { Jira: "jira", Linear: "linear", "GitHub Issues": "github-issues" }[providerChoice.label];
        trackerProject = await ask(`  ${c("cyan", "Default project key")} ${c("dim", "(e.g., HOT, PROJ):")} `);
        trackerUser = await ask(`  ${c("cyan", "User email/handle")} ${c("dim", "(for assignments):")} `);
      }

      config = {
        projectName: path.basename(process.cwd()),
        commits: commitMode.label.toLowerCase(),
        branches: branchMode.label.toLowerCase(),
        documentation: docMode.label.toLowerCase(),
        maxAgents: 5,
        commitStyle: "conventional",
        branchPrefix: "feat/",
        trackerProvider,
        trackerProject,
        trackerUser,
      };
    }

    console.log(c("bold", "\n  Initializing project...\n"));
    const success = initProject(process.cwd(), config, flags.force);

    if (success) {
      console.log(c("bold", "\n  ═══════════════════════════════════════"));
      console.log(c("green", c("bold", "  Project initialized.")));
      console.log("");
      console.log(`  ${c("dim", "Start your agent and run:")} ${c("cyan", "/tyrex-init")}`);
      console.log(`  ${c("dim", "Or for a new feature:")}     ${c("cyan", "/tyrex-new")}`);
      console.log(`  ${c("dim", "See all commands:")}         ${c("cyan", "/tyrex-help")}`);
      console.log("");
    }

    rl.close();
    return;
  }

  // ─── Global install flow (default command) ───
  console.log(c("bold", "  Global Setup\n"));

  // 1. Choose agent
  let agent;
  if (flags.claude) agent = "claude";
  else if (flags.opencode) agent = "opencode";
  else if (flags.cursor) agent = "cursor";
  else if (flags.codex) agent = "codex";
  else if (flags.all) agent = "all";
  else {
    const agentChoice = await choose("Which AI agent are you using?", [
      { label: "All", desc: "Install for all agents (recommended)", default: true },
      { label: "Claude Code", desc: "Anthropic's CLI agent" },
      { label: "OpenCode", desc: "Open source AI coding agent" },
      { label: "Cursor", desc: "AI-first code editor" },
      { label: "Codex", desc: "OpenAI's coding agent" },
    ]);
    agent = ["all", "claude", "opencode", "cursor", "codex"][
      [
        "All",
        "Claude Code",
        "OpenCode",
        "Cursor",
        "Codex",
      ].indexOf(agentChoice.label)
    ];
  }

  // 2. Install globally
  console.log(c("bold", "\n  Installing globally...\n"));

  const agents = agent === "all" ? ["claude", "opencode", "cursor", "codex"] : [agent];
  for (const a of agents) {
    installCommandsGlobal(a);
  }

  // Install global templates and config templates
  installGlobalTemplates();
  installGlobalRulesTemplates();

  // 3. Done
  console.log(c("bold", "\n  ═══════════════════════════════════════"));
  console.log(c("green", c("bold", "  Setup complete.")));
  console.log("");
  console.log(`  ${c("dim", "Next, in your project directory run:")} ${c("cyan", "tyrex init")}`);
  console.log(`  ${c("dim", "Then start your agent and run:")}       ${c("cyan", "/tyrex-init")}`);
  console.log("");

  rl.close();
}

async function handleUninstall(flags) {
  const agents = flags.all
    ? ["claude", "opencode", "cursor", "codex"]
    : [flags.claude ? "claude" : flags.opencode ? "opencode" : flags.cursor ? "cursor" : "codex"];

  for (const agent of agents) {
    const agentConfig = AGENTS[agent];
    const commandsDir = path.join(HOME_DIR, agentConfig.commandsDir);
    if (fs.existsSync(commandsDir)) {
      fs.rmSync(commandsDir, { recursive: true });
      console.log(c("green", `  Removed ~/${agentConfig.commandsDir}/`));
    } else {
      console.log(c("dim", `  ~/${agentConfig.commandsDir}/ not found — already uninstalled or never installed.`));
    }
  }

  // Remove global tyrex dir
  if (fs.existsSync(GLOBAL_TYREX_DIR)) {
    fs.rmSync(GLOBAL_TYREX_DIR, { recursive: true });
    console.log(c("green", "  Removed ~/.tyrex/"));
  }

  console.log(c("green", "\n  Uninstall complete."));
  console.log(c("dim", "  Note: project .tyrex/ directories were preserved (contain project state)."));
}

function printHelp() {
  console.log(`  ${c("bold", "Usage:")}`);
  console.log(`    tyrex                   Install globally (slash commands + templates)`);
  console.log(`    tyrex init              Initialize Tyrex in current project`);
  console.log(`    tyrex help              Show this help`);
  console.log(`    tyrex version           Show version`);
  console.log("");
  console.log(`  ${c("bold", "Agent flags (for install):")}`);
  console.log(`    --claude                Install for Claude Code`);
  console.log(`    --opencode              Install for OpenCode`);
  console.log(`    --cursor                Install for Cursor`);
  console.log(`    --codex                 Install for Codex`);
  console.log(`    --all                   Install for all agents`);
  console.log("");
  console.log(`  ${c("bold", "Other flags:")}`);
  console.log(`    --defaults, -d          Skip configuration questions, use defaults`);
  console.log(`    --force, -f             Overwrite core files on re-install/re-init`);
  console.log(`    --upgrade               Silent re-sync for already-configured agents`);
  console.log(`    --uninstall             Remove global Tyrex installation`);
  console.log(`    --version, -v           Show version`);
  console.log(`    --help, -h              Show this help`);
  console.log("");
  console.log(`  ${c("bold", "Examples:")}`);
    console.log(`    tyrex                                 Set up globally (interactive)`);
    console.log(`    tyrex --claude                        Set up for Claude Code`);
    console.log(`    tyrex --all                           Set up for all agents`);
    console.log(`    tyrex init                            Initialize project (interactive)`);
    console.log(`    tyrex init -d                         Initialize project with defaults`);
    console.log(`    tyrex init -f                         Reinitialize, overwrite core files`);
    console.log(`    tyrex --uninstall --all               Remove all global installations`);
  console.log("");
  console.log(`  ${c("bold", "Workflow:")}`);
    console.log(`    1. ${c("cyan", "npm install -g tyrex-framework")}    Install the CLI`);
    console.log(`    2. ${c("cyan", "tyrex --all")}                       Set up globally (once)`);
    console.log(`    3. ${c("cyan", "cd your-project && tyrex init")}     Initialize your project`);
    console.log(`    4. ${c("cyan", "/tyrex-new")}                        Start building`);
  console.log("");
}

main().catch((err) => {
  console.error(c("red", `\n  Error: ${err.message}`));
  console.error(c("dim", `  Run 'tyrex help' for usage.`));
  rl.close();
  process.exit(1);
});
