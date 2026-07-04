# Study Tracker

A daily learning companion for your 6-month DSA / System Design / Project roadmap.
Open it each day and it shows you exactly what to study — no browsing the plan manually.

- **Backend:** Express.js + Swagger/OpenAPI docs. Curriculum/config/progress in JSON files;
  per-day notes + uploaded-image metadata in SQLite via Node's built-in `node:sqlite` (no install).
  Requires Node 22+.
- **Frontend:** React (Vite), left sidebar + top bar layout, right-side notebook panel

## What it does

- Shows **today's lesson** automatically based on the real calendar date and your configured program start date
- Each day has three sections: **DSA title + description**, **System Design task**, **Project task**
- A **practice tasks checklist** per day that persists across sessions
- A **streak strip** in the top bar showing your last 14 days of consistency
- Sidebar lets you browse any week/day in the 26-week plan, grouped by phase
- A per-day **notebook panel** on the right: drag-and-drop (or file-picker) **photo uploads** for your
  handwritten notes, plus a **rich-text notes editor** (formatting, links, embedded YouTube) that autosaves

## Setup

### 1. Backend

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:4000`. API docs at `http://localhost:4000/api-docs`.

By default the program start date is set to the first day you run the backend.
To change it (e.g. to start Monday instead of today):

```bash
curl -X PUT http://localhost:4000/api/config \
  -H "Content-Type: application/json" \
  -d '{"startDate":"2026-07-06"}'
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

### 3. Or: run both with Docker Compose

If you'd rather not run two terminals, from the repo root:

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000` (docs at `http://localhost:4000/api-docs`)

Changing the program start date works exactly the same as without Docker:

```bash
curl -X PUT http://localhost:4000/api/config \
  -H "Content-Type: application/json" \
  -d '{"startDate":"2026-07-06"}'
```

`backend/storage/` is bind-mounted straight through to the containers, so your notes, photos,
and streak history live in the same place on disk as always (`backend/storage/`) and survive
`docker compose down`/rebuilds untouched — back that folder up exactly as documented below.

Re-run `docker compose up --build` (the `--build` matters) whenever you change source code —
this setup builds production-style images rather than hot-reloading, so it's meant for
day-to-day *use* of the app, not active development. For active development, keep using the
two-terminal `npm start` / `npm run dev` workflow described above.

Note: if you run both the Docker frontend and a local `npm run dev` frontend at the same time,
they'll collide on port 5173 — stop one before starting the other.

## How the daily content is generated

`backend/src/data/weekThemes.js` defines the 26-week curriculum (DSA topic, system design
topic, and project task per week — matching your earlier 6-month plan). `generateCurriculum.js`
expands that into 182 daily entries, detecting real weekdays vs weekends from the calendar so
weekday sessions are lighter (matches your 3 hrs/day) and weekend sessions are deeper
(matches your 9 hrs/day), regardless of which day of the week your program actually starts on.

Want to change the curriculum content? Edit `weekThemes.js` — everything downstream
(API responses, sidebar, daily view) regenerates from it automatically.

## Notes

- Storage lives under `backend/storage/`: `config.json` + `progress.json` (JSON), `study.db`
  (SQLite — per-day notes and image metadata), and `uploads/` (the uploaded photo files).
  Back that folder up to preserve your notes, photos, and streak history.
- This is a personal-use tool. If you ever deploy it somewhere shared, add authentication before
  exposing the `/api/config` and `/api/days/:date/tasks/:taskId/toggle` endpoints publicly.
