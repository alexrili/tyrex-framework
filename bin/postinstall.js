#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const VERSION = require("../package.json").version;
const GLOBAL_TYREX_DIR = path.join(os.homedir(), ".tyrex");

if (fs.existsSync(GLOBAL_TYREX_DIR)) {
  // Existing installation — silent upgrade
  try {
    execFileSync(process.execPath, [path.join(__dirname, "tyrex.js"), "--upgrade"], {
      stdio: "inherit",
    });
  } catch (err) {
    // Non-fatal — user can run `tyrex --all` manually
    console.log(`\n\x1b[33m  [tyrex]\x1b[0m Auto-upgrade failed. Run \x1b[1mtyrex --all\x1b[0m to sync commands.\n`);
  }
} else {
  // First-time install — show setup message
  console.log(`\n\x1b[36m  [tyrex]\x1b[0m v${VERSION} installed. Run \x1b[1mtyrex --all\x1b[0m to set up.\n`);
}
