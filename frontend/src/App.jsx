import { useEffect, useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DailyLesson from "./components/DailyLesson";
import PracticeTasks from "./components/PracticeTasks";
import NotebookPanel from "./components/NotebookPanel";
import { api } from "./api";

export default function App() {
  const [weeks, setWeeks] = useState([]);
  const [day, setDay] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(1);
  const [streak, setStreak] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | not-started | finished | error
  const [notice, setNotice] = useState("");

  const loadWeeks = useCallback(async () => {
    const { weeks } = await api.getWeeks();
    setWeeks(weeks);
  }, []);

  const loadStreak = useCallback(async () => {
    const { summary } = await api.getProgressSummary(14);
    setStreak(summary);
  }, []);

  const loadDayByIndex = useCallback(async (idx) => {
    const { day } = await api.getDay(idx);
    setDay(day);
    setSelectedDayIndex(day.dayIndex);
    setExpandedWeek(day.weekNumber);
    setStatus("ready");
  }, []);

  const loadToday = useCallback(async () => {
    const res = await api.getToday();
    if (!res.inProgram) {
      setStatus(res.message.startsWith("Program starts") ? "not-started" : "finished");
      setNotice(res.message);
      return;
    }
    setDay(res.day);
    setSelectedDayIndex(res.day.dayIndex);
    setExpandedWeek(res.day.weekNumber);
    setStatus("ready");
  }, []);

  useEffect(() => {
    loadWeeks();
    loadToday();
    loadStreak();
  }, [loadWeeks, loadToday, loadStreak]);

  const handleSelectDay = async (idx) => {
    setStatus("loading");
    await loadDayByIndex(idx);
  };

  const handleToggleTask = async (taskId) => {
    if (!day) return;
    await api.toggleTask(day.date, taskId);
    setDay((prev) => ({
      ...prev,
      practiceTasks: prev.practiceTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    }));
    loadStreak();
  };

  return (
    <div className="app-shell">
      <Sidebar
        weeks={weeks}
        selectedDayIndex={selectedDayIndex}
        onSelectDay={handleSelectDay}
        expandedWeek={expandedWeek}
        setExpandedWeek={setExpandedWeek}
      />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <Topbar day={day} streak={streak} />
        <main className="main-area">
          <div className="main-content">
            {status === "loading" && <div className="loading-state">Loading today's plan…</div>}
            {status === "not-started" && <div className="empty-state">{notice}</div>}
            {status === "finished" && <div className="empty-state">{notice}</div>}
            {status === "ready" && day && (
              <>
                <DailyLesson day={day} />
                <PracticeTasks day={day} onToggle={handleToggleTask} />
              </>
            )}
          </div>
          {status === "ready" && day && <NotebookPanel key={day.date} day={day} />}
        </main>
      </div>
    </div>
  );
}
