const fs = require("fs");
const path = require("path");
const { todayLocalISO } = require("./dateUtils");

const CONFIG_PATH = path.join(__dirname, "..", "storage", "config.json");

function ensureFile() {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CONFIG_PATH)) {
    // Default to today; the curriculum generator aligns weeks to Monday and inserts a short
    // kickoff for any days before the first Monday.
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ startDate: todayLocalISO() }, null, 2));
  }
}

function getConfig() {
  ensureFile();
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
}

function setStartDate(startDate) {
  ensureFile();
  const config = { startDate };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  return config;
}

module.exports = { getConfig, setStartDate };
