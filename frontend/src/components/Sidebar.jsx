export default function Sidebar({ weeks, selectedDayIndex, onSelectDay, expandedWeek, setExpandedWeek }) {
  const phases = [];
  for (const week of weeks) {
    let group = phases.find((p) => p.phase === week.phase);
    if (!group) {
      group = { phase: week.phase, weeks: [] };
      phases.push(group);
    }
    group.weeks.push(week);
  }

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="dot" />
          Study Tracker
        </div>
        <div className="sidebar-sub">26-week DSA / System Design / Build plan</div>
      </div>

      {phases.map((group) => (
        <div className="phase-group" key={group.phase}>
          <div className="phase-label">{group.phase}</div>
          {group.weeks.map((week) => {
            const isExpanded = expandedWeek === week.weekNumber;
            const isActiveWeek = week.days.some((d) => d.dayIndex === selectedDayIndex);
            return (
              <div key={week.weekNumber}>
                <button
                  className={`week-item ${isActiveWeek ? "active" : ""}`}
                  onClick={() => setExpandedWeek(isExpanded ? null : week.weekNumber)}
                >
                  <span className="week-num">{week.weekNumber === 0 ? "KICKOFF" : `WEEK ${week.weekNumber}`}</span>
                  <span>{week.dsaTopic}</span>
                </button>
                {isExpanded && (
                  <div className="week-detail-list">
                    {week.days.map((d) => (
                      <button
                        key={d.dayIndex}
                        className={`week-detail-item ${d.dayIndex === selectedDayIndex ? "active" : ""}`}
                        onClick={() => onSelectDay(d.dayIndex)}
                      >
                        {d.programDay ? `Day ${d.programDay}` : "Kickoff"} · {d.date} {d.isWeekend ? "(weekend)" : ""}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
