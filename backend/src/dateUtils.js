// Local-time date helpers.
// We deliberately avoid `Date.prototype.toISOString()`, which returns a UTC date and would
// shift the day by one for users east of UTC (e.g. AEST / UTC+10) — for a daily date-driven
// app that means "today" and the generated day dates could be off by a day.

// Format a Date as YYYY-MM-DD using its LOCAL calendar fields.
function localISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// The first Monday on or after `date`. Themed weeks are Monday-aligned so that each week's
// weekend practises exactly what that week's weekdays taught; any days between the user's
// start date and this Monday become a short "kickoff" (see generateCurriculum).
function firstMondayOnOrAfter(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun ... 6 = Sat
  const add = day === 1 ? 0 : day === 0 ? 1 : 8 - day; // days forward to Monday
  d.setDate(d.getDate() + add);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Today's local date as a YYYY-MM-DD string.
function todayLocalISO() {
  return localISODate(new Date());
}

module.exports = { localISODate, firstMondayOnOrAfter, todayLocalISO };
