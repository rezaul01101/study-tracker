function formatDuration(mins) {
  if (!mins) return "";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

export default function PracticeTasks({ day, onToggle }) {
  const doneCount = day.practiceTasks.filter((t) => t.completed).length;
  const totalMinutes = day.practiceTasks.reduce((sum, t) => sum + (t.estMinutes || 0), 0);

  return (
    <div className="practice-card">
      <h3>Practice tasks</h3>
      <p className="practice-sub">
        {doneCount}/{day.practiceTasks.length} done · ~{formatDuration(totalMinutes)} planned today — check them off as you go.
      </p>
      {day.practiceTasks.map((task) => (
        <div className="task-row" key={task.id}>
          <button
            className={`task-checkbox ${task.completed ? "checked" : ""}`}
            onClick={() => onToggle(task.id)}
            aria-label={task.completed ? "Mark task incomplete" : "Mark task complete"}
          >
            {task.completed ? "✓" : ""}
          </button>
          <span className={`task-label ${task.completed ? "done" : ""}`}>{task.label}</span>
          {task.estMinutes ? <span className="task-time">~{formatDuration(task.estMinutes)}</span> : null}
        </div>
      ))}
    </div>
  );
}
