#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ─── Constants ───────────────────────────────────────────────
const VERSION = "0.1.0";
const TEMPLATES_DIR = path.join(__dirname, "..", "templates");

const AGENTS = {
  claude: {
    name: "Claude Code",
    commandsDir: ".claude/commands/tyrex",
    settingsFile: ".claude/settings.json",
  },
  cursor: {
    name: "Cursor",
    commandsDir: ".cursor/rules/tyrex",
    settingsFile: null,
  },
  codex: {
    name: "Codex",
    commandsDir: ".codex/skills/tyrex",
    settingsFile: null,
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
    console.log(c("red", `  Template not found: ${templateName}`));
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

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// ─── Installation Logic ──────────────────────────────────────

async function installCommands(targetDir, agent) {
  const agentConfig = AGENTS[agent];
  const commandsTarget = path.join(targetDir, agentConfig.commandsDir);
  const commandsSrc = path.join(TEMPLATES_DIR, "commands", "tyrex");

  ensureDir(commandsTarget);

  const commandFiles = fs.readdirSync(commandsSrc).filter((f) => f.endsWith(".md"));
  let count = 0;

  for (const file of commandFiles) {
    const src = path.join(commandsSrc, file);
    const dest = path.join(commandsTarget, file);
    fs.copyFileSync(src, dest);
    count++;
  }

  console.log(c("green", `  Installed ${count} slash commands to ${agentConfig.commandsDir}/`));
  return count;
}

function installTyrexStructure(targetDir, config) {
  const tyrexDir = path.join(targetDir, ".tyrex");

  // Directories
  ensureDir(path.join(tyrexDir, "state", "tasks"));
  ensureDir(path.join(tyrexDir, "features"));
  ensureDir(path.join(tyrexDir, "templates"));
  ensureDir(path.join(tyrexDir, "map"));

  // Docs directories
  ensureDir(path.join(targetDir, "docs", "adrs"));
  ensureDir(path.join(targetDir, "docs", "rfcs"));
  ensureDir(path.join(targetDir, "docs", "wiki"));
  ensureDir(path.join(targetDir, "docs", "diagrams"));

  const replacements = {
    PROJECT_NAME: config.projectName || path.basename(targetDir),
    DATE: new Date().toISOString().split("T")[0],
    COMMIT_MODE: config.commits || "approve",
    BRANCH_MODE: config.branches || "approve",
    DOC_MODE: config.documentation || "suggest",
    MAX_AGENTS: String(config.maxAgents || 5),
    COMMIT_STYLE: config.commitStyle || "conventional",
    BRANCH_PREFIX: config.branchPrefix || "feat/",
  };

  // Core files
  copyTemplate("tyrex.yml", path.join(tyrexDir, "tyrex.yml"), replacements);
  copyTemplate("TYREX.md", path.join(tyrexDir, "TYREX.md"), replacements);
  copyTemplate("constitution.md", path.join(tyrexDir, "constitution.md"), replacements);
  copyTemplate("cursor.yml", path.join(tyrexDir, "state", "cursor.yml"), replacements);

  // Templates for user
  copyTemplate("feature.md", path.join(tyrexDir, "templates", "feature.md"));
  copyTemplate("adr.md", path.join(tyrexDir, "templates", "adr.md"));
  copyTemplate("rfc.md", path.join(tyrexDir, "templates", "rfc.md"));
  copyTemplate("review-checklist.md", path.join(tyrexDir, "templates", "review-checklist.md"));

  // CLAUDE.md at project root
  copyTemplate("CLAUDE.md", path.join(targetDir, "CLAUDE.md"), replacements);

  // CHANGELOG.md at project root (if not exists)
  const changelogPath = path.join(targetDir, "docs", "CHANGELOG.md");
  if (!fs.existsSync(changelogPath)) {
    copyTemplate("CHANGELOG.md", changelogPath, replacements);
  }

  console.log(c("green", "  Created .tyrex/ directory structure"));
  console.log(c("green", "  Created docs/ directory structure"));
  console.log(c("green", "  Created CLAUDE.md"));
  console.log(c("green", "  Created docs/CHANGELOG.md"));
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Non-interactive flags
  const flags = {
    claude: args.includes("--claude"),
    cursor: args.includes("--cursor"),
    codex: args.includes("--codex"),
    all: args.includes("--all"),
    global: args.includes("--global") || args.includes("-g"),
    local: args.includes("--local") || args.includes("-l"),
    uninstall: args.includes("--uninstall"),
    defaults: args.includes("--defaults") || args.includes("-d"),
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

  // ─── Install flow ───
  console.log(c("bold", "  Setup\n"));

  // 1. Choose agent
  let agent;
  if (flags.claude) agent = "claude";
  else if (flags.cursor) agent = "cursor";
  else if (flags.codex) agent = "codex";
  else if (flags.all) agent = "all";
  else {
    const agentChoice = await choose("Which AI agent are you using?", [
      { label: "Claude Code", desc: "Anthropic's CLI agent", default: true },
      { label: "Cursor", desc: "AI-first code editor" },
      { label: "Codex", desc: "OpenAI's coding agent" },
      { label: "All", desc: "Install for all agents" },
    ]);
    agent = ["claude", "cursor", "codex", "all"][
      [
        "Claude Code",
        "Cursor",
        "Codex",
        "All",
      ].indexOf(agentChoice.label)
    ];
  }

  // 2. Choose location
  let location;
  if (flags.global) location = "global";
  else if (flags.local) location = "local";
  else {
    const locChoice = await choose("Where to install?", [
      {
        label: "Local (this project)",
        desc: "Install in current directory. Best for per-project setup.",
        default: true,
      },
      {
        label: "Global",
        desc: "Install in home directory. Available for all projects.",
      },
    ]);
    location = locChoice.label.startsWith("Local") ? "local" : "global";
  }

  const targetDir = location === "global" ? require("os").homedir() : process.cwd();

  // 3. Configure defaults
  let config;
  if (flags.defaults) {
    console.log(c("dim", "\n  Using default configuration.\n"));
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
    console.log(c("bold", "\n  Configuration\n"));

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

  // 4. Install
  console.log(c("bold", "\n  Installing...\n"));

  // Install slash commands
  const agents = agent === "all" ? ["claude", "cursor", "codex"] : [agent];
  for (const a of agents) {
    installCommands(targetDir, a);
  }

  // Install .tyrex structure (only for local)
  if (location === "local") {
    installTyrexStructure(targetDir, config);
  } else {
    // For global, only install commands
    console.log(c("dim", "  Global install: only slash commands installed."));
    console.log(c("dim", "  Run /tyrex.init in your project to create .tyrex/ structure."));
  }

  // 5. Done
  console.log(c("bold", "\n  ═══════════════════════════════════════"));
  console.log(c("green", c("bold", "  Done!")));
  console.log("");
  console.log(`  ${c("dim", "Start your agent and run:")} ${c("cyan", "/tyrex.init")}`);
  console.log(`  ${c("dim", "Or for a new feature:")}     ${c("cyan", "/tyrex.new")}`);
  console.log(`  ${c("dim", "See all commands:")}         ${c("cyan", "/tyrex.status")}`);
  console.log("");

  rl.close();
}

async function handleUninstall(flags) {
  const agents = flags.all
    ? ["claude", "cursor", "codex"]
    : [flags.claude ? "claude" : flags.cursor ? "cursor" : "codex"];
  const targetDir = flags.global ? require("os").homedir() : process.cwd();

  for (const agent of agents) {
    const agentConfig = AGENTS[agent];
    const commandsDir = path.join(targetDir, agentConfig.commandsDir);
    if (fs.existsSync(commandsDir)) {
      fs.rmSync(commandsDir, { recursive: true });
      console.log(c("green", `  Removed ${agentConfig.commandsDir}/`));
    } else {
      console.log(c("dim", `  ${agentConfig.commandsDir}/ not found, skipping`));
    }
  }
  console.log(c("green", "\n  Uninstall complete."));
  console.log(c("dim", "  Note: .tyrex/ directory was preserved (contains project state)."));
}

function printHelp() {
  console.log(`  ${c("bold", "Usage:")} npx tyrex-framework [options]`);
  console.log("");
  console.log(`  ${c("bold", "Options:")}`);
  console.log(`    --claude         Install for Claude Code`);
  console.log(`    --cursor         Install for Cursor`);
  console.log(`    --codex          Install for Codex`);
  console.log(`    --all            Install for all agents`);
  console.log(`    --local, -l      Install in current directory`);
  console.log(`    --global, -g     Install in home directory`);
  console.log(`    --defaults, -d   Skip configuration questions, use defaults`);
  console.log(`    --uninstall      Remove Tyrex commands`);
  console.log(`    --version, -v    Show version`);
  console.log(`    --help, -h       Show this help`);
  console.log("");
  console.log(`  ${c("bold", "Examples:")}`);
  console.log(`    npx tyrex-framework                  Interactive setup`);
  console.log(`    npx tyrex-framework --claude --local  Non-interactive install`);
  console.log(`    npx tyrex-framework --all --global    Install for all agents globally`);
  console.log("");
}

main().catch((err) => {
  console.error(c("red", `\n  Error: ${err.message}`));
  rl.close();
  process.exit(1);
});
