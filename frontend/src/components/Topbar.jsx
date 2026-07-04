export default function Topbar({ day, streak }) {
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-date">{todayLabel}</span>
        {day && (
          <span className="topbar-day-counter">
            {day.programDay ? (
              <>Day <span>{day.programDay}</span> / 182</>
            ) : (
              "Kickoff"
            )}
          </span>
        )}
      </div>

      <div className="topbar-right">
        {streak.length > 0 && (
          <div className="streak-strip" title="Last 14 days of practice completion">
            {streak.map((s) => (
              <div
                key={s.date}
                className={`streak-cell ${s.completed === s.total && s.total > 0 ? "done" : ""} ${s.isToday ? "today" : ""}`}
                title={`${s.date}: ${s.completed}/${s.total} tasks done`}
              />
            ))}
          </div>
        )}
        <a
          className="docs-link"
          href="http://localhost:4000/api-docs"
          target="_blank"
          rel="noreferrer"
        >
          API docs ↗
        </a>
      </div>
    </header>
  );
}
