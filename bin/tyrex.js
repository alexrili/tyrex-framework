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
    needsProjectSymlink: false, // reads from ~/ natively
  },
  opencode: {
    name: "OpenCode",
    commandsDir: ".opencode/commands",
    commandsSrc: "commands/unified",
    rulesFile: "AGENTS.md",
    rulesTemplate: "AGENTS.md",
    needsProjectSymlink: false, // reads from ~/ natively
  },
  cursor: {
    name: "Cursor",
    commandsDir: ".cursor/rules/tyrex",
    commandsSrc: "commands/unified",
    rulesFile: "CLAUDE.md",
    rulesTemplate: "CLAUDE.md",
    needsProjectSymlink: true, // needs project-local files
  },
  codex: {
    name: "Codex",
    commandsDir: ".codex/skills/tyrex",
    commandsSrc: "commands/unified",
    rulesFile: "CLAUDE.md",
    rulesTemplate: "CLAUDE.md",
    needsProjectSymlink: true, // needs project-local files
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

  // Skills templates
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
  ensureDir(path.join(tyrexDir, "features"));
  ensureDir(path.join(tyrexDir, "skills"));
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

  // Agent symlinks — for agents that need project-local commands
  for (const agentKey of detectedAgents) {
    const agentConfig = AGENTS[agentKey];
    if (agentConfig.needsProjectSymlink) {
      const globalCommandsDir = path.join(HOME_DIR, agentConfig.commandsDir);
      const localCommandsDir = path.join(projectDir, agentConfig.commandsDir);
      createDirSymlink(globalCommandsDir, localCommandsDir);
    }
  }

  // CHANGELOG.md — never overwrite
  const changelogPath = path.join(projectDir, "docs", "CHANGELOG.md");
  copyTemplateIfNew("CHANGELOG.md", changelogPath, replacements);

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
  };

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

      config = {
        projectName: path.basename(process.cwd()),
        commits: commitMode.label.toLowerCase(),
        branches: branchMode.label.toLowerCase(),
        documentation: docMode.label.toLowerCase(),
        maxAgents: 5,
        commitStyle: "conventional",
        branchPrefix: "feat/",
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
      { label: "Claude Code", desc: "Anthropic's CLI agent", default: true },
      { label: "OpenCode", desc: "Open source AI coding agent" },
      { label: "Cursor", desc: "AI-first code editor" },
      { label: "Codex", desc: "OpenAI's coding agent" },
      { label: "All", desc: "Install for all agents" },
    ]);
    agent = ["claude", "opencode", "cursor", "codex", "all"][
      [
        "Claude Code",
        "OpenCode",
        "Cursor",
        "Codex",
        "All",
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
