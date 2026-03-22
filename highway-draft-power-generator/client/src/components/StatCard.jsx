import { useTheme } from "../context/ThemeContext.jsx";

export default function StatCard({ icon, label, value, sub }) {
  const { tokens } = useTheme();
  return (
    <div className="stat-card" style={{ minWidth: 140, flex: "1 1 140px" }}>
      <p style={{
        color: tokens.textFaint, fontSize: 11,
        textTransform: "uppercase", letterSpacing: 1, marginBottom: 6,
        transition: "color 0.35s",
      }}>
        {label}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: tokens.accent, transition: "color 0.35s" }}>{icon}</span>
        <span style={{ color: tokens.text, fontWeight: 700, fontSize: 22, transition: "color 0.35s" }}>
          {value}
        </span>
        {sub && <span style={{ color: tokens.textFaint, fontSize: 12 }}>{sub}</span>}
      </div>
    </div>
  );
}