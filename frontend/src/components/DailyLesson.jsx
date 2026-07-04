export default function DailyLesson({ day }) {
  if (day.mode === "kickoff") {
    return (
      <>
        <div className="lesson-eyebrow">Kickoff · Before Week 1</div>
        <h1 className="lesson-title">{day.title}</h1>
        <p className="lesson-description">{day.description}</p>
        <div className="track-grid">
          <div className="track-card">
            <div className="track-label">Getting started</div>
            <h3>Week 1 begins Monday</h3>
            <p>Use these days to set up and ease in. The full DSA / System Design / Project plan kicks off Monday — check today's setup tasks below.</p>
          </div>
        </div>
      </>
    );
  }

  const isPractice = day.mode === "practice";
  const modeLabel = isPractice ? "Practice & build day" : "Theory session";
  const dsaAction = isPractice ? "Practise" : "Learn";

  return (
    <>
      <div className="lesson-eyebrow">{day.phase} · Week {day.weekNumber} · {modeLabel}</div>
      <h1 className="lesson-title">{day.title}</h1>
      <p className="lesson-description">{day.description}</p>

      <div className="track-grid">
        <div className="track-card">
          <div className="track-label">
            DSA
            <span className={`mode-badge ${isPractice ? "practice" : "learn"}`}>{dsaAction}</span>
          </div>
          <h3>{day.dsa.title}</h3>
          <p>{day.dsa.description}</p>
        </div>
        <div className="track-card">
          <div className="track-label">System Design</div>
          <h3>{day.systemDesign.title}</h3>
          <p>{day.systemDesign.description}</p>
        </div>
        <div className="track-card">
          <div className="track-label">{day.project.name}</div>
          <h3>{isPractice ? "Weekend build block" : "Small commit today"}</h3>
          <p>{day.project.task}</p>
        </div>
      </div>
    </>
  );
}
