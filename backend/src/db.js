// SQLite storage for per-day notes and uploaded-image metadata.
// Uses Node's built-in SQLite (no external dependency). The DB file lives in storage/study.db;
// the actual image files live in storage/uploads/ (see routes/notebook.js).

// node:sqlite emits an "experimental feature" warning on load — silence just that one so the
// server's startup output stays clean.
const _emitWarning = process.emitWarning.bind(process);
process.emitWarning = (warning, ...args) => {
  const msg = typeof warning === "string" ? warning : warning && warning.message;
  if (msg && msg.includes("SQLite is an experimental feature")) return;
  return _emitWarning(warning, ...args);
};

const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const fs = require("fs");

const STORAGE_DIR = path.join(__dirname, "..", "storage");
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

const db = new DatabaseSync(path.join(STORAGE_DIR, "study.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    date       TEXT PRIMARY KEY,
    html       TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS images (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    date          TEXT NOT NULL,
    filename      TEXT NOT NULL,
    original_name TEXT,
    mime          TEXT,
    size          INTEGER,
    created_at    TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_images_date ON images(date);
`);

const IMG_COLS =
  "id, date, filename, original_name AS originalName, mime, size, created_at AS createdAt";

function getNote(date) {
  const row = db
    .prepare("SELECT date, html, updated_at AS updatedAt FROM notes WHERE date = ?")
    .get(date);
  return row || { date, html: "", updatedAt: null };
}

function saveNote(date, html) {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO notes (date, html, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET html = excluded.html, updated_at = excluded.updated_at`
  ).run(date, html, now);
  return { date, html, updatedAt: now };
}

function listImages(date) {
  return db.prepare(`SELECT ${IMG_COLS} FROM images WHERE date = ? ORDER BY id DESC`).all(date);
}

function addImage({ date, filename, originalName, mime, size }) {
  const now = new Date().toISOString();
  const info = db
    .prepare(
      "INSERT INTO images (date, filename, original_name, mime, size, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(date, filename, originalName, mime, size, now);
  return db
    .prepare(`SELECT ${IMG_COLS} FROM images WHERE id = ?`)
    .get(Number(info.lastInsertRowid));
}

function getImage(id) {
  return db.prepare(`SELECT ${IMG_COLS} FROM images WHERE id = ?`).get(id);
}

function deleteImage(id) {
  const row = getImage(id);
  db.prepare("DELETE FROM images WHERE id = ?").run(id);
  return row;
}

module.exports = { db, getNote, saveNote, listImages, addImage, getImage, deleteImage };
