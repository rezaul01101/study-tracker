import { useEffect, useRef, useState } from "react";
import { api, ORIGIN_URL } from "../api";
import NotesEditor from "./NotesEditor";

export default function NotebookPanel({ day }) {
  const date = day.date;
  const [images, setImages] = useState([]);
  const [notesHtml, setNotesHtml] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved

  const fileInputRef = useRef(null);
  const saveTimer = useRef(null);
  const latestHtml = useRef(null);
  const pendingSave = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setError("");
    Promise.all([api.getNotes(date), api.getImages(date)])
      .then(([note, imgs]) => {
        if (cancelled) return;
        setNotesHtml(note.html || "");
        setImages(imgs.images || []);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
      clearTimeout(saveTimer.current);
      // Flush any unsaved edits for this (now-previous) date before switching away.
      if (pendingSave.current && latestHtml.current != null) {
        api.saveNotes(date, latestHtml.current).catch(() => {});
        pendingSave.current = false;
      }
    };
  }, [date]);

  const handleNotesChange = (html) => {
    latestHtml.current = html;
    pendingSave.current = true;
    setSaveState("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      api
        .saveNotes(date, html)
        .then(() => {
          pendingSave.current = false;
          setSaveState("saved");
        })
        .catch(() => setSaveState("idle"));
    }, 700);
  };

  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (!files.length) {
      setError("Only image files are supported.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const { images: created } = await api.uploadImages(date, files);
      setImages((prev) => [...created, ...prev]);
    } catch (e) {
      setError(e.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  const removeImage = async (id) => {
    try {
      await api.deleteImage(id);
      setImages((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      setError(e.message || "Could not delete image.");
    }
  };

  return (
    <aside className="notebook-panel">
      <section className="nb-section">
        <div className="nb-head">
          <h3>Notebook photos</h3>
        </div>
        <div
          className={`dropzone ${dragOver ? "over" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files?.length) uploadFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <div className="dz-icon">📷</div>
          <div className="dz-text">
            {uploading ? "Uploading…" : <>Drag photos here or <span className="dz-link">browse</span></>}
          </div>
          <div className="dz-sub">Snap your handwritten notes and drop them in</div>
        </div>

        {error && <div className="nb-error">{error}</div>}

        {images.length > 0 && (
          <div className="img-grid">
            {images.map((img) => (
              <div className="img-cell" key={img.id}>
                <a href={`${ORIGIN_URL}${img.url}`} target="_blank" rel="noreferrer">
                  <img src={`${ORIGIN_URL}${img.url}`} alt={img.originalName || "note photo"} loading="lazy" />
                </a>
                <button className="img-del" title="Delete photo" onClick={() => removeImage(img.id)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="nb-section">
        <div className="nb-head">
          <h3>Notes &amp; links</h3>
          <span className={`nb-save ${saveState}`}>
            {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved ✓" : ""}
          </span>
        </div>
        {loaded ? (
          <NotesEditor initialHtml={notesHtml} onChange={handleNotesChange} />
        ) : (
          <div className="nb-loading">Loading…</div>
        )}
      </section>
    </aside>
  );
}
