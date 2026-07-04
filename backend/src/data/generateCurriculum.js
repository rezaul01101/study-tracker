const { WEEK_THEMES } = require("./weekThemes");
const { localISODate, firstMondayOnOrAfter } = require("../dateUtils");

const PROGRAM_DAYS = 182; // 26 themed weeks. Kickoff days (if any) come before Week 1.

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isWeekend(date) {
  const day = date.getDay(); // 0 = Sun, 6 = Sat
  return day === 0 || day === 6;
}

// The system-design section for a given weekday: Mon -> sections[0] ... Fri -> sections[4].
// Because the themed program is Monday-aligned, each weekday maps to one focused sub-topic.
function sectionForWeekday(sections, date) {
  const idx = Math.min(date.getDay() - 1, sections.length - 1); // Mon(1)->0 ... Fri(5)->4
  return sections[Math.max(0, idx)];
}

// Light onboarding for the days between the user's start date and the first Monday.
// Keyed by weekday so any start day produces sensible kickoff content.
const KICKOFF_CONTENT = {
  2: { // Tuesday (early-week start fallback)
    title: "Kickoff — Get set up",
    focus: "Set up your tools and repo. Week 1 begins on Monday — this is just easing in.",
    tasks: [
      { id: "kickoff-repo", label: "Create your Project 1 repo, add a README, and push the first commit.", estMinutes: 45 },
      { id: "kickoff-roadmap", label: "Skim the 26-week roadmap in the sidebar so you know what's coming.", estMinutes: 20 },
    ],
  },
  3: { // Wednesday
    title: "Kickoff — Prime the basics",
    focus: "Read ahead so Week 1 feels familiar. Week 1 begins on Monday.",
    tasks: [
      { id: "kickoff-read", label: "Read a Big-O / time-complexity primer and note the common complexity classes.", estMinutes: 60 },
      { id: "kickoff-tools", label: "Set up your practice account (LeetCode/NeetCode) and bookmark an arrays track.", estMinutes: 20 },
    ],
  },
  4: { // Thursday
    title: "Kickoff — Easy warm-up",
    focus: "A couple of easy problems to get into the flow. Week 1 begins on Monday.",
    tasks: [
      { id: "kickoff-warmup", label: "Solve 2 easy array problems, untimed.", estMinutes: 90 },
      { id: "kickoff-routine", label: "Write down your weekly routine and Monday's start time.", estMinutes: 20 },
    ],
  },
  5: { // Friday
    title: "Kickoff — Get set up",
    focus: "Set up your tools and repo today. The full plan begins Monday — this is just easing in.",
    tasks: [
      { id: "kickoff-repo", label: "Create your Project 1 repo, add a README, and push the first commit.", estMinutes: 45 },
      { id: "kickoff-read", label: "Read a Big-O / time-complexity primer and jot down the common complexity classes.", estMinutes: 60 },
      { id: "kickoff-tools", label: "Set up your practice account (LeetCode/NeetCode) and bookmark an arrays track.", estMinutes: 20 },
    ],
  },
  6: { // Saturday
    title: "Kickoff — Easy warm-up",
    focus: "Get comfortable with the practice flow — no time pressure yet.",
    tasks: [
      { id: "kickoff-warmup", label: "Solve 2 easy array problems, untimed. Focus on the flow, not speed.", estMinutes: 90 },
      { id: "kickoff-skim", label: "Skim the arrays section of your DSA resource so Monday feels familiar.", estMinutes: 45 },
    ],
  },
  0: { // Sunday
    title: "Kickoff — Plan the journey",
    focus: "Look at what's ahead and lock in your routine before Week 1.",
    tasks: [
      { id: "kickoff-roadmap", label: "Skim the full 26-week roadmap in the sidebar so you know what's coming.", estMinutes: 20 },
      { id: "kickoff-routine", label: "Write down your weekly routine (weekday evenings + weekend blocks) and tomorrow's start time.", estMinutes: 20 },
      { id: "kickoff-rest", label: "Rest — Week 1 starts tomorrow.", estMinutes: 0 },
    ],
  },
};

function buildKickoffDay(date, dayIndex) {
  const c = KICKOFF_CONTENT[date.getDay()] || KICKOFF_CONTENT[5];
  return {
    dayIndex,
    programDay: null,
    date: localISODate(date),
    weekNumber: 0,
    phase: "Kickoff",
    isWeekend: isWeekend(date),
    mode: "kickoff",
    title: c.title,
    description: c.focus,
    dsa: { title: "Kickoff & setup", description: c.focus },
    systemDesign: { title: "—", description: "System design starts in Week 1.", topic: "" },
    project: { name: "Setup", task: "" },
    practiceTasks: c.tasks.map((t) => ({ ...t })),
  };
}

// Weekday = LEARN (theory, ~3 hr): learn the concept, one warm-up problem, one system-design
// section, and a small commit-sized project touch.
// Weekend = PRACTISE + BUILD (~9 hr): timed problem-solving on the week's topics, redo misses,
// apply the system-design topic, and the main project build block. Sundays add a weekly retro.
function buildPracticeTasks({ dsa, systemDesign, weekend, isSunday, sdSection, projectWeekday, projectWeekend }) {
  if (weekend) {
    const tasks = [
      { id: "dsa-practice-1", label: `Timed practice: 4 "${dsa.title}" problems, 45 min each, no hints.`, estMinutes: 180 },
      { id: "dsa-practice-2", label: `Redo any "${dsa.title}" problems you missed this week, plus one shaky problem from an earlier pattern.`, estMinutes: 60 },
      { id: "sd-apply", label: `System design — apply "${systemDesign.title}": ${systemDesign.apply}`, estMinutes: 90 },
      { id: "project-build", label: projectWeekend, estMinutes: 180 },
    ];
    if (isSunday) {
      tasks.push({ id: "review", label: "Weekly retro: log what worked, note your weakest topics, and set next week's focus.", estMinutes: 30 });
    }
    return tasks;
  }
  return [
    { id: "dsa-learn", label: `Learn "${dsa.title}" — read/watch the core material and write a short note in your own words.`, estMinutes: 75 },
    { id: "dsa-warmup", label: `Solve 1 easy warm-up problem on "${dsa.title}" to cement the concept.`, estMinutes: 30 },
    { id: "sd-section", label: `System design — ${sdSection} Write a 3-sentence summary.`, estMinutes: 30 },
    { id: "project-touch", label: projectWeekday, estMinutes: 45 },
  ];
}

function buildThemedDay(date, programDay, dayIndex) {
  const weekNumber = Math.floor((programDay - 1) / 7) + 1;
  const theme = WEEK_THEMES[Math.min(weekNumber - 1, WEEK_THEMES.length - 1)];
  const weekend = isWeekend(date);
  const isSunday = date.getDay() === 0;
  const { dsa, systemDesign, project, phase } = theme;

  const mode = weekend ? "practice" : "theory";
  const sections = systemDesign.sections || [systemDesign.description];
  const sdSection = weekend ? null : sectionForWeekday(sections, date);

  const title = weekend
    ? `${dsa.title} — Practice & Build Day`
    : `${dsa.title} — Theory Session`;

  const description = weekend
    ? `${dsa.description} Weekend is your long block: practise this week's problems under time pressure, then move into your ${project.name} build. Depth over breadth.`
    : `${dsa.description} Keep it focused: learn today's concept, one warm-up problem, a short system-design section, and a small ${project.name} commit.`;

  return {
    dayIndex,
    programDay,
    date: localISODate(date),
    weekNumber,
    phase,
    isWeekend: weekend,
    mode,
    title,
    description,
    dsa: { title: dsa.title, description: dsa.description },
    systemDesign: {
      title: systemDesign.title,
      // Weekday: today's focused section. Weekend: the application prompt.
      description: weekend ? systemDesign.apply : sdSection,
      topic: systemDesign.description,
    },
    project: {
      name: project.name,
      task: weekend ? project.weekendTask : project.weekdayTask,
    },
    practiceTasks: buildPracticeTasks({
      dsa,
      systemDesign,
      weekend,
      isSunday,
      sdSection,
      projectWeekday: project.weekdayTask,
      projectWeekend: project.weekendTask,
    }),
  };
}

function buildCurriculum(startDateStr) {
  const start = new Date(startDateStr + "T00:00:00");
  const firstMonday = firstMondayOnOrAfter(start);
  const firstMondayStr = localISODate(firstMonday);
  const days = [];
  let dayIndex = 1;

  // Kickoff days: from the start date (inclusive) up to the first Monday (exclusive).
  let d = new Date(start);
  while (localISODate(d) < firstMondayStr) {
    days.push(buildKickoffDay(d, dayIndex++));
    d = addDays(d, 1);
  }

  // Themed program: 182 Monday-aligned days from the first Monday onwards.
  for (let i = 0; i < PROGRAM_DAYS; i++) {
    const date = addDays(firstMonday, i);
    days.push(buildThemedDay(date, i + 1, dayIndex++));
  }

  return days;
}

module.exports = { buildCurriculum, PROGRAM_DAYS };
