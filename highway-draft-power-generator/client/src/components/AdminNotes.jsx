import { useState, useEffect } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import api from "../services/api.js";

export default function AdminNotes() {
  const { tokens } = useTheme();
  const [notes, setNotes] = useState([]);
  const [obs, setObs] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { const { data } = await api.get("/admin/notes"); setNotes(data); } catch {}
  };

  useEffect(() => { load(); }, []);

  const addNote = async () => {
    if (!obs.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.post("/admin/notes", { observation: obs.trim() });
      setNotes(n => [data, ...n]);
      setObs("");
    } catch {}
    setSaving(false);
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/admin/notes/${id}`);
      setNotes(n => n.filter(x => x._id !== id));
    } catch {}
  };

  return (
    <div className="glass-card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: tokens.accentBg, border: `1px solid ${tokens.accentBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <FileText size={14} color={tokens.accent} />
        </div>
        <span style={{ color: tokens.text, fontWeight: 700, fontSize: 14, transition: "color 0.35s" }}>
          Admin Notes
        </span>
      </div>

      <div style={{ minHeight: 100, maxHeight: 200, overflowY: "auto", marginBottom: 14 }}>
        {notes.length === 0 ? (
          <p style={{ color: tokens.textGhost, fontSize: 13, textAlign: "center", marginTop: 32 }}>
            No observations recorded.
          </p>
        ) : (
          notes.map(n => (
            <div
              key={n._id}
              style={{
                background: tokens.panelBg,
                border: `1px solid ${tokens.borderSubtle}`,
                borderRadius: 8, padding: "9px 12px", marginBottom: 8,
                display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8,
                transition: "all 0.35s",
              }}
            >
              <div>
                <p style={{ color: tokens.textMuted, fontSize: 13, lineHeight: 1.5, transition: "color 0.35s" }}>
                  {n.observation}
                </p>
                <p style={{ color: tokens.textGhost, fontSize: 11, marginTop: 3 }}>
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteNote(n._id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: tokens.textGhost, paddingTop: 2, transition: "color 0.2s",
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>

      <textarea
        className="input-field"
        rows={3}
        value={obs}
        onChange={e => setObs(e.target.value)}
        placeholder="Enter observation..."
        style={{ resize: "none", marginBottom: 10 }}
      />
      <button
        className="btn-primary"
        onClick={addNote}
        disabled={saving}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
      >
        <Plus size={15} /> Add Note
      </button>
    </div>
  );
}