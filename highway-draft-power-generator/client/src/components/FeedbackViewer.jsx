import { useState, useEffect } from "react";
import { MessageSquare, User, Phone, RefreshCw } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import api from "../services/api.js";

export default function FeedbackViewer() {
  const { tokens } = useTheme();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get("/admin/feedback"); setFeedback(data); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MessageSquare size={16} color={tokens.accent} />
          <span style={{ color: tokens.text, fontWeight: 700, fontSize: 15, transition: "color 0.35s" }}>
            User Feedback
          </span>
          <span style={{
            background: tokens.accentBg, color: tokens.accent,
            borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700,
          }}>
            {feedback.length}
          </span>
        </div>
        <button
          onClick={load}
          style={{
            background: tokens.panelBg, border: `1px solid ${tokens.borderSubtle}`,
            borderRadius: 7, padding: "6px 12px", color: tokens.textMuted,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 12,
            transition: "all 0.2s",
          }}
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {loading ? (
        <p style={{ color: tokens.textGhost, textAlign: "center", padding: 40, fontSize: 13 }}>
          Loading feedback...
        </p>
      ) : feedback.length === 0 ? (
        <div style={{
          textAlign: "center", padding: 60,
          border: `1px dashed ${tokens.borderSubtle}`, borderRadius: 10,
        }}>
          <MessageSquare size={32} color={tokens.textGhost} style={{ margin: "0 auto 12px" }} />
          <p style={{ color: tokens.textGhost, fontSize: 14 }}>No feedback submitted yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {feedback.map((fb, i) => (
            <div key={fb._id || i} className="glass-card" style={{ padding: 18 }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8,
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <User size={13} color={tokens.accent} />
                    <span style={{ color: tokens.text, fontWeight: 700, fontSize: 14, transition: "color 0.35s" }}>
                      {fb.fullName}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Phone size={11} color={tokens.textFaint} />
                    <span style={{ color: tokens.textFaint, fontSize: 12 }}>{fb.contact}</span>
                  </div>
                </div>
                <span style={{ color: tokens.textGhost, fontSize: 11 }}>
                  {new Date(fb.createdAt).toLocaleString("en-US", {
                    month: "short", day: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
              <div style={{
                background: tokens.panelBg, border: `1px solid ${tokens.borderSubtle}`,
                borderRadius: 8, padding: "10px 14px", transition: "all 0.35s",
              }}>
                <p style={{ color: tokens.textMuted, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", transition: "color 0.35s" }}>
                  {fb.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}