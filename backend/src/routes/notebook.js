const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { getNote, saveNote, listImages, addImage, getImage, deleteImage } = require("../db");

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, "..", "..", "storage", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MIME_EXT = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/heic": ".heic",
  "image/heif": ".heif",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || MIME_EXT[file.mimetype] || "";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) =>
    /^image\//.test(file.mimetype) ? cb(null, true) : cb(new Error("Only image files are allowed")),
});

function toImageDto(row) {
  return {
    id: row.id,
    date: row.date,
    url: `/uploads/${row.filename}`,
    originalName: row.originalName,
    mime: row.mime,
    size: row.size,
    createdAt: row.createdAt,
  };
}

function validDate(req, res) {
  if (DATE_RE.test(req.params.date)) return true;
  res.status(400).json({ error: "date must be an ISO date string (YYYY-MM-DD)" });
  return false;
}

/**
 * @openapi
 * /api/days/{date}/notes:
 *   get:
 *     summary: Get the rich-text notes for a day
 *     tags: [Notebook]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *     responses:
 *       200: { description: "{ date, html, updatedAt }" }
 *   put:
 *     summary: Save the rich-text notes for a day
 *     tags: [Notebook]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               html: { type: string }
 *     responses:
 *       200: { description: Saved note }
 */
router.get("/days/:date/notes", (req, res) => {
  if (!validDate(req, res)) return;
  res.json(getNote(req.params.date));
});

router.put("/days/:date/notes", (req, res) => {
  if (!validDate(req, res)) return;
  const html = typeof req.body.html === "string" ? req.body.html : "";
  res.json(saveNote(req.params.date, html));
});

/**
 * @openapi
 * /api/days/{date}/images:
 *   get:
 *     summary: List uploaded images for a day
 *     tags: [Notebook]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *     responses:
 *       200: { description: "{ images: [...] }" }
 *   post:
 *     summary: Upload one or more images for a day (multipart, field "images")
 *     tags: [Notebook]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       201: { description: Created image records }
 */
router.get("/days/:date/images", (req, res) => {
  if (!validDate(req, res)) return;
  res.json({ images: listImages(req.params.date).map(toImageDto) });
});

router.post("/days/:date/images", (req, res) => {
  if (!validDate(req, res)) return;
  upload.array("images", 10)(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ error: "No image files uploaded" });
    const created = files.map((f) =>
      addImage({
        date: req.params.date,
        filename: f.filename,
        originalName: f.originalname,
        mime: f.mimetype,
        size: f.size,
      })
    );
    res.status(201).json({ images: created.map(toImageDto) });
  });
});

/**
 * @openapi
 * /api/images/{id}:
 *   delete:
 *     summary: Delete an uploaded image (record + file)
 *     tags: [Notebook]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: "{ deleted: id }" }
 *       404: { description: Image not found }
 */
router.delete("/images/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: "invalid id" });
  const row = getImage(id);
  if (!row) return res.status(404).json({ error: "image not found" });
  deleteImage(id);
  fs.rm(path.join(UPLOADS_DIR, row.filename), { force: true }, () => {});
  res.json({ deleted: id });
});

module.exports = router;
