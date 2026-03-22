import { useRef, useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";

const H = 190;
const PAD = { t: 14, r: 14, b: 30, l: 44 };

function toPoints(data, w, h) {
  if (!data || data.length < 2) return [];
  const vMin = Math.min(...data.map(d => d.v));
  const vMax = Math.max(...data.map(d => d.v));
  const range = vMax - vMin || 1;
  return data.map((d, i) => ({
    x: PAD.l + (i / (data.length - 1)) * (w - PAD.l - PAD.r),
    y: PAD.t + (1 - (d.v - vMin) / range) * (h - PAD.t - PAD.b),
    v: d.v,
    label: d.label,
  }));
}

function splinePath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) / 3;
    const cp2x = pts[i + 1].x - (pts[i + 1].x - pts[i].x) / 3;
    d += ` C ${cp1x} ${pts[i].y} ${cp2x} ${pts[i + 1].y} ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
}

function linePath(pts) {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

function areaClose(pts, h) {
  const base = h - PAD.b;
  if (!pts.length) return "";
  return `L ${pts[pts.length - 1].x} ${base} L ${pts[0].x} ${base} Z`;
}

function splineAreaPath(pts, h) {
  if (pts.length < 2) return "";
  const base = h - PAD.b;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) / 3;
    const cp2x = pts[i + 1].x - (pts[i + 1].x - pts[i].x) / 3;
    d += ` C ${cp1x} ${pts[i].y} ${cp2x} ${pts[i + 1].y} ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d + ` L ${pts[pts.length - 1].x} ${base} L ${pts[0].x} ${base} Z`;
}

export default function SensorChart({ data = [], chartType = "spline" }) {
  const { tokens } = useTheme();
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState(null);
  const [svgW, setSvgW] = useState(520);

  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setSvgW(entry.contentRect.width || 520));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const w = Math.max(svgW - 4, 200);
  const h = H;
  const pts = toPoints(data, w, h);
  const vMin = data.length ? Math.min(...data.map(d => d.v)) : 100;
  const vMax = data.length ? Math.max(...data.map(d => d.v)) : 200;

  const gridLines = Array.from({ length: 5 }, (_, i) => ({
    y: PAD.t + (i / 4) * (h - PAD.t - PAD.b),
    v: Math.round(vMax - (i / 4) * (vMax - vMin)),
  }));

  const barW = pts.length > 1 ? Math.max(2, ((w - PAD.l - PAD.r) / pts.length) * 0.7) : 10;

  // Unique gradient IDs that work with multiple charts on screen
  const gradId = `ag_${chartType}`;
  const barId  = `bg_${chartType}`;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height={h}
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={tokens.chartAreaColor} stopOpacity={tokens.chartAreaOp1} />
            <stop offset="100%" stopColor={tokens.chartAreaColor} stopOpacity={tokens.chartAreaOp2} />
          </linearGradient>
          <linearGradient id={barId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={tokens.chartBarTop} stopOpacity="0.9" />
            <stop offset="100%" stopColor={tokens.chartBarBot} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {gridLines.map(({ y, v }, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={y} x2={w - PAD.r} y2={y}
              stroke={tokens.chartGrid} strokeWidth={1} />
            <text x={PAD.l - 6} y={y + 4} fill={tokens.chartLabel} fontSize={10} textAnchor="end">
              {v}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {pts.length > 0 && <>
          <text x={pts[0].x} y={h - 6} fill={tokens.chartLabel} fontSize={9} textAnchor="middle">
            {pts[0].label}
          </text>
          <text x={pts[pts.length - 1].x} y={h - 6} fill={tokens.chartLabel} fontSize={9} textAnchor="middle">
            {pts[pts.length - 1].label}
          </text>
        </>}

        {/* Line / Spline area + stroke */}
        {pts.length >= 2 && chartType !== "bar" && <>
          <path
            d={chartType === "spline" ? splineAreaPath(pts, h) : linePath(pts) + areaClose(pts, h)}
            fill={`url(#${gradId})`}
          />
          <path
            d={chartType === "spline" ? splinePath(pts) : linePath(pts)}
            fill="none"
            stroke={tokens.chartStroke}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>}

        {/* Bars */}
        {chartType === "bar" && pts.map((p, i) => (
          <rect
            key={i} x={p.x - barW / 2} y={p.y}
            width={barW} height={h - PAD.b - p.y}
            fill={`url(#${barId})`} rx={2}
          />
        ))}

        {/* Hover hit targets */}
        {pts.map((p, i) => (
          <rect
            key={i}
            x={p.x - (w / pts.length) * 0.5}
            y={PAD.t}
            width={w / pts.length}
            height={h - PAD.t - PAD.b}
            fill="transparent"
            style={{ cursor: "crosshair" }}
            onMouseEnter={() => setTooltip({ x: p.x, y: p.y, v: p.v, label: p.label })}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}

        {/* Tooltip */}
        {tooltip && <>
          <line
            x1={tooltip.x} y1={PAD.t} x2={tooltip.x} y2={h - PAD.b}
            stroke={tokens.chartStroke} strokeWidth={1} strokeDasharray="3,3"
          />
          <circle cx={tooltip.x} cy={tooltip.y} r={4} fill={tokens.chartStroke} />
          <rect
            x={Math.min(tooltip.x + 8, w - 95)}
            y={Math.max(tooltip.y - 28, PAD.t)}
            width={88} height={24} rx={5}
            fill={tokens.tooltipBg}
            stroke={tokens.tooltipBorder}
            strokeWidth={1}
          />
          <text
            x={Math.min(tooltip.x + 52, w - 51)}
            y={Math.max(tooltip.y - 12, PAD.t + 14)}
            fill={tokens.tooltipText}
            fontSize={11}
            textAnchor="middle"
            fontWeight="600"
          >
            {tooltip.v.toFixed(1)} W
          </text>
        </>}
      </svg>

      {pts.length === 0 && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: tokens.textGhost, fontSize: 13,
        }}>
          Waiting for data stream...
        </div>
      )}
    </div>
  );
}