import { useState, useEffect } from "react";
import { Activity, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

function ThemeToggle() {
  const { mode, toggle, tokens } = useTheme();
  const isLight = mode === "light";

  return (
    <button
      onClick={toggle}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: isLight ? "rgba(37,99,235,0.07)" : "rgba(6,182,212,0.08)",
        border: `1px solid ${isLight ? "rgba(37,99,235,0.22)" : "rgba(6,182,212,0.22)"}`,
        borderRadius: 20,
        padding: "5px 12px 5px 7px",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
    >
      {/* Sliding pill */}
      <div
        style={{
          width: 38,
          height: 21,
          borderRadius: 11,
          background: isLight ? "#e2e8f0" : "#1e3a5f",
          position: "relative",
          flexShrink: 0,
          transition: "background 0.35s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 2.5,
            left: 2.5,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: isLight ? "#2563eb" : "#06b6d4",
            transform: `translateX(${isLight ? "17px" : "0px"})`,
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isLight
              ? "0 1px 4px rgba(37,99,235,0.4)"
              : "0 1px 4px rgba(6,182,212,0.4)",
          }}
        >
          {isLight
            ? <Sun size={9} color="#fff" strokeWidth={2.5} />
            : <Moon size={9} color="#fff" strokeWidth={2.5} />
          }
        </div>
      </div>
      <span
        style={{
          color: isLight ? "#2563eb" : "#06b6d4",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0.3,
          transition: "color 0.3s",
        }}
      >
        {isLight ? "Light" : "Dark"}
      </span>
    </button>
  );
}

export default function Topbar({ rightSlot }) {
  const { tokens } = useTheme();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", { hour12: false });

  return (
    <header
      style={{
        background: tokens.topbarBg,
        borderBottom: `1px solid ${tokens.topbarBorder}`,
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        transition: "background 0.35s ease, border-color 0.35s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Activity size={20} color={tokens.accent} />
        <span style={{ color: tokens.accent, fontWeight: 700, fontSize: 15, letterSpacing: -0.3, transition: "color 0.35s" }}>
          Highway Draft Power Generator
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ color: tokens.textGhost, fontSize: 13, transition: "color 0.35s" }}>
          {dateStr}&nbsp;
          <span style={{ color: tokens.textMuted, fontWeight: 600, transition: "color 0.35s" }}>
            {timeStr}
          </span>
        </span>

        <ThemeToggle />

        {rightSlot}
      </div>
    </header>
  );
}