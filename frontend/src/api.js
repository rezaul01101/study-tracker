export const ORIGIN_URL = "http://localhost:4000";
const BASE_URL = `${ORIGIN_URL}/api`;

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getToday: () => request("/today"),
  getDay: (dayIndex) => request(`/days/${dayIndex}`),
  getWeeks: () => request("/weeks"),
  getConfig: () => request("/config"),
  setStartDate: (startDate) =>
    request("/config", { method: "PUT", body: JSON.stringify({ startDate }) }),
  toggleTask: (date, taskId) =>
    request(`/days/${date}/tasks/${taskId}/toggle`, { method: "POST" }),
  getProgressSummary: (days = 14) => request(`/progress/summary?days=${days}`),

  // --- Notebook: per-day notes + image uploads ---
  getNotes: (date) => request(`/days/${date}/notes`),
  saveNotes: (date, html) =>
    request(`/days/${date}/notes`, { method: "PUT", body: JSON.stringify({ html }) }),
  getImages: (date) => request(`/days/${date}/images`),
  deleteImage: (id) => request(`/images/${id}`, { method: "DELETE" }),
  // Multipart upload — must NOT set a JSON Content-Type (the browser sets the multipart boundary).
  uploadImages: async (date, files) => {
    const form = new FormData();
    for (const f of files) form.append("images", f);
    const res = await fetch(`${BASE_URL}/days/${date}/images`, { method: "POST", body: form });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Upload failed: ${res.status}`);
    }
    return res.json();
  },
};
