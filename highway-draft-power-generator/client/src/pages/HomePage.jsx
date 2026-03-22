import { useState } from "react";
import { Lock, User, Activity, ChevronRight } from "lucide-react";
import Topbar from "../components/Topbar.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import api from "../services/api.js";

export default function HomePage({ onAdminLogin, onEnterUser }) {
  const { tokens } = useTheme();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!password) { setError("Password required"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { username, password });
      onAdminLogin(data.token);
    } catch {
      setError("Invalid credentials. Try admin / 0000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: tokens.bg, transition: "background 0.35s" }}>
      <Topbar />

      <div style={{ textAlign: "center", padding: "64px 24px 48px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: tokens.accentBg,
            border: `1px solid ${tokens.accentBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.35s",
          }}>
            <Activity size={28} color={tokens.accent} />
          </div>
        </div>
        <h1 style={{
          fontSize: "clamp(26px,5vw,46px)",
          fontWeight: 800,
          color: tokens.accent,
          letterSpacing: -1,
          lineHeight: 1.15,
          marginBottom: 14,
          transition: "color 0.35s",
        }}>
          Highway Draft Power Generator
        </h1>
        <p style={{ color: tokens.textFaint, fontSize: 15, maxWidth: 520, margin: "0 auto", transition: "color 0.35s" }}>
          Real-time data visualization and monitoring system.
        </p>
      </div>

      <div style={{
        display: "flex", gap: 24, maxWidth: 760, margin: "0 auto",
        padding: "0 24px 80px", flexWrap: "wrap", justifyContent: "center",
      }}>
        {/* Admin Card */}
        <div className="glass-card" style={{ flex: "1 1 320px", padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: tokens.accentBg,
              border: `1px solid ${tokens.accentBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Lock size={16} color={tokens.accent} />
            </div>
            <h2 style={{ color: tokens.text, fontWeight: 700, fontSize: 17, transition: "color 0.35s" }}>
              Admin Access
            </h2>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ color: tokens.textMuted, fontSize: 13, display: "block", marginBottom: 6, fontWeight: 500 }}>
              Username
            </label>
            <input
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ color: tokens.textMuted, fontSize: 13, display: "block", marginBottom: 6, fontWeight: 500 }}>
              Password
            </label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {error && (
            <p style={{ color: tokens.danger, fontSize: 13, marginBottom: 12, fontWeight: 500 }}>
              {error}
            </p>
          )}
          <button className="btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </div>

        {/* User Card */}
        <div className="glass-card" style={{ flex: "1 1 280px", padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: tokens.successBg,
              border: `1px solid ${tokens.successBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <User size={16} color={tokens.success} />
            </div>
            <h2 style={{ color: tokens.text, fontWeight: 700, fontSize: 17, transition: "color 0.35s" }}>
              User Access
            </h2>
          </div>
          <p style={{ color: tokens.textFaint, fontSize: 13, lineHeight: 1.7, marginBottom: 28, transition: "color 0.35s" }}>
            Users can provide feedback to the development team. No authentication required.
          </p>
          <button className="btn-green" onClick={onEnterUser}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              Enter as User <ChevronRight size={16} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}