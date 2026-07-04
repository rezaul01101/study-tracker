const fs = require("fs");
const path = require("path");

const PROGRESS_PATH = path.join(__dirname, "..", "storage", "progress.json");

function ensureFile() {
  const dir = path.dirname(PROGRESS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(PROGRESS_PATH)) {
    fs.writeFileSync(PROGRESS_PATH, JSON.stringify({}, null, 2));
  }
}

function getAllProgress() {
  ensureFile();
  return JSON.parse(fs.readFileSync(PROGRESS_PATH, "utf-8"));
}

function getProgressForDate(date) {
  const all = getAllProgress();
  return all[date] || [];
}

function toggleTask(date, taskId) {
  const all = getAllProgress();
  const completed = new Set(all[date] || []);
  if (completed.has(taskId)) {
    completed.delete(taskId);
  } else {
    completed.add(taskId);
  }
  all[date] = Array.from(completed);
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(all, null, 2));
  return all[date];
}

module.exports = { getAllProgress, getProgressForDate, toggleTask };
