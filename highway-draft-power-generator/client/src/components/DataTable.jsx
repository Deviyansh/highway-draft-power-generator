import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

const PAGE_SIZE = 15;

export default function DataTable({ records = [] }) {
  const { tokens } = useTheme();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState("desc");

  const getBadge = (v) => {
    if (v >= 180) return tokens.badgeHigh;
    if (v >= 130) return tokens.badgeNormal;
    if (v >= 110) return tokens.badgeLow;
    return tokens.badgeCritical;
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return records
      .filter(r =>
        !q ||
        new Date(r.timestamp).toLocaleString().toLowerCase().includes(q) ||
        String(r.voltage_watt).includes(q)
      )
      .sort((a, b) => {
        const diff = new Date(a.timestamp) - new Date(b.timestamp);
        return sortDir === "asc" ? diff : -diff;
      });
  }, [records, query, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safeP = Math.min(page, totalPages);
  const slice = filtered.slice((safeP - 1) * PAGE_SIZE, safeP * PAGE_SIZE);

  const pagerBtn = (disabled, onClick, child) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "transparent" : tokens.accentBg,
        border: `1px solid ${disabled ? tokens.borderSubtle : tokens.accentBorder}`,
        borderRadius: 6, padding: "5px 10px",
        color: disabled ? tokens.textGhost : tokens.accent,
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.2s",
      }}
    >
      {child}
    </button>
  );

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Search size={13} color={tokens.textFaint}
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            className="input-field"
            style={{ paddingLeft: 30, fontSize: 13 }}
            placeholder="Search timestamp or voltage..."
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
          />
        </div>
        <button
          onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}
          style={{
            background: tokens.accentBg, border: `1px solid ${tokens.accentBorder}`,
            borderRadius: 7, padding: "8px 14px", color: tokens.accent,
            cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5,
            fontWeight: 500, transition: "all 0.2s",
          }}
        >
          {sortDir === "desc" ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
          {sortDir === "desc" ? "Newest first" : "Oldest first"}
        </button>
        <span style={{ color: tokens.textGhost, fontSize: 12 }}>
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${tokens.borderSubtle}` }}>
              {["#", "Timestamp", "Voltage (W)", "Status", "Source"].map(h => (
                <th key={h} style={{ padding: "8px 10px", color: tokens.tableHeaderColor, fontWeight: 600, textAlign: "left", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 40, color: tokens.textGhost }}>
                  No records found
                </td>
              </tr>
            ) : (
              slice.map((r, i) => {
                const b = getBadge(r.voltage_watt);
                return (
                  <tr
                    key={r._id || i}
                    style={{
                      borderBottom: `1px solid ${tokens.borderSubtle}`,
                      background: i % 2 === 0 ? "transparent" : tokens.tableRowAlt,
                      transition: "background 0.35s",
                    }}
                  >
                    <td style={{ padding: "7px 10px", color: tokens.textGhost }}>{(safeP - 1) * PAGE_SIZE + i + 1}</td>
                    <td style={{ padding: "7px 10px", color: tokens.textMuted, fontFamily: "monospace", fontSize: 12 }}>
                      {new Date(r.timestamp).toLocaleString("en-US", {
                        month: "short", day: "2-digit",
                        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
                      })}
                    </td>
                    <td style={{ padding: "7px 10px", color: tokens.text, fontWeight: 700 }}>
                      {r.voltage_watt.toFixed(2)}
                    </td>
                    <td style={{ padding: "7px 10px" }}>
                      <span style={{
                        background: b.bg, color: b.color,
                        border: `1px solid ${b.color}40`,
                        borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 600,
                      }}>
                        {r.voltage_watt >= 180 ? "High" : r.voltage_watt >= 130 ? "Normal" : r.voltage_watt >= 110 ? "Low" : "Critical"}
                      </span>
                    </td>
                    <td style={{ padding: "7px 10px", color: tokens.textGhost, fontSize: 11 }}>
                      {r.source === "csv_upload" ? "CSV" : "Stream"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 14 }}>
          {pagerBtn(safeP === 1, () => setPage(p => Math.max(1, p - 1)), <ChevronLeft size={14} />)}
          <span style={{ color: tokens.textMuted, fontSize: 13 }}>Page {safeP} / {totalPages}</span>
          {pagerBtn(safeP === totalPages, () => setPage(p => Math.min(totalPages, p + 1)), <ChevronRight size={14} />)}
        </div>
      )}
    </div>
  );
}