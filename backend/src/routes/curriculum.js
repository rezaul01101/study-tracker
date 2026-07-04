const express = require("express");
const { buildCurriculum } = require("../data/generateCurriculum");
const { getConfig } = require("../config");
const { getProgressForDate, toggleTask } = require("../progressStore");
const { todayLocalISO } = require("../dateUtils");

const router = express.Router();

function withProgress(day) {
  const completed = new Set(getProgressForDate(day.date));
  return {
    ...day,
    practiceTasks: day.practiceTasks.map((t) => ({ ...t, completed: completed.has(t.id) })),
  };
}

function getCurriculum() {
  const { startDate } = getConfig();
  return buildCurriculum(startDate);
}

/**
 * @openapi
 * /api/today:
 *   get:
 *     summary: Get today's lesson
 *     description: Returns the lesson scheduled for the current real-world date, based on the configured program start date.
 *     tags: [Curriculum]
 *     responses:
 *       200:
 *         description: Today's lesson, or a message if today falls outside the program window.
 */
router.get("/today", (req, res) => {
  const curriculum = getCurriculum();
  const todayStr = todayLocalISO();
  const day = curriculum.find((d) => d.date === todayStr);

  if (!day) {
    const { startDate } = getConfig();
    const isBefore = todayStr < startDate;
    return res.json({
      inProgram: false,
      message: isBefore
        ? `Program starts on ${startDate}. Nothing scheduled yet.`
        : `Program finished on ${curriculum[curriculum.length - 1].date}. Great work — time to review your applications!`,
    });
  }

  res.json({ inProgram: true, day: withProgress(day) });
});

/**
 * @openapi
 * /api/days/{dayIndex}:
 *   get:
 *     summary: Get a lesson by day index
 *     tags: [Curriculum]
 *     parameters:
 *       - in: path
 *         name: dayIndex
 *         required: true
 *         schema:
 *           type: integer
 *         description: Day number in the program (1-182)
 *     responses:
 *       200:
 *         description: The requested day's lesson
 *       404:
 *         description: Day index out of range
 */
router.get("/days/:dayIndex", (req, res) => {
  const idx = parseInt(req.params.dayIndex, 10);
  const curriculum = getCurriculum();
  if (Number.isNaN(idx) || idx < 1 || idx > curriculum.length) {
    return res.status(404).json({ error: `dayIndex must be between 1 and ${curriculum.length}` });
  }
  res.json({ day: withProgress(curriculum[idx - 1]) });
});

/**
 * @openapi
 * /api/weeks:
 *   get:
 *     summary: Get an overview of all weeks, grouped by phase
 *     description: Lightweight summary for sidebar navigation — one entry per week with its theme, not full daily detail.
 *     tags: [Curriculum]
 *     responses:
 *       200:
 *         description: List of weeks with phase, DSA topic, and system design topic
 */
router.get("/weeks", (req, res) => {
  const curriculum = getCurriculum();
  const byWeek = new Map();
  for (const day of curriculum) {
    if (!byWeek.has(day.weekNumber)) {
      byWeek.set(day.weekNumber, {
        weekNumber: day.weekNumber,
        phase: day.phase,
        dsaTopic: day.dsa.title,
        systemDesignTopic: day.systemDesign.title,
        startDate: day.date,
        days: [],
      });
    }
    const week = byWeek.get(day.weekNumber);
    week.days.push({ dayIndex: day.dayIndex, programDay: day.programDay, date: day.date, isWeekend: day.isWeekend, title: day.title });
    week.endDate = day.date;
  }
  res.json({ weeks: Array.from(byWeek.values()) });
});

/**
 * @openapi
 * /api/config:
 *   get:
 *     summary: Get the configured program start date
 *     tags: [Config]
 *     responses:
 *       200:
 *         description: Current config
 *   put:
 *     summary: Set the program start date
 *     tags: [Config]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-07-06"
 *     responses:
 *       200:
 *         description: Updated config
 */
router.get("/config", (req, res) => res.json(getConfig()));
router.put("/config", (req, res) => {
  const { startDate } = req.body;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate || "")) {
    return res.status(400).json({ error: "startDate must be an ISO date string (YYYY-MM-DD)" });
  }
  const { setStartDate } = require("../config");
  res.json(setStartDate(startDate));
});

/**
 * @openapi
 * /api/days/{date}/tasks/{taskId}/toggle:
 *   post:
 *     summary: Toggle a practice task's completion state for a given date
 *     tags: [Progress]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated list of completed task ids for that date
 */
router.post("/days/:date/tasks/:taskId/toggle", (req, res) => {
  const { date, taskId } = req.params;
  const completed = toggleTask(date, taskId);
  res.json({ date, completedTaskIds: completed });
});

/**
 * @openapi
 * /api/progress/summary:
 *   get:
 *     summary: Get completion summary for the last N days (for streak visualization)
 *     tags: [Progress]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 14
 *     responses:
 *       200:
 *         description: Array of { date, completed, total, isToday } for the requested window
 */
router.get("/progress/summary", (req, res) => {
  const windowSize = parseInt(req.query.days, 10) || 14;
  const curriculum = getCurriculum();
  const todayStr = todayLocalISO();
  const todayEntry = curriculum.find((d) => d.date === todayStr);
  const endIdx = todayEntry ? todayEntry.dayIndex : curriculum.length;
  const startIdx = Math.max(1, endIdx - windowSize + 1);

  const summary = [];
  for (let i = startIdx; i <= endIdx; i++) {
    const day = curriculum[i - 1];
    if (!day) continue;
    const completed = getProgressForDate(day.date).length;
    summary.push({
      date: day.date,
      completed,
      total: day.practiceTasks.length,
      isToday: day.date === todayStr,
    });
  }
  res.json({ summary });
});

module.exports = router;
