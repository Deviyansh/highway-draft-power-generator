const TREND_PHRASES = [
  "Output trajectory remains within operational bounds.",
  "Generation curve reflects standard highway traffic dynamics.",
  "Energy yield aligns with projected turbine performance metrics.",
];

const INSIGHT_PHRASES = [
  "Consider scheduling preventive maintenance if elevated variance persists beyond the next monitoring window.",
  "Optimal data collection windows should target peak-traffic hours to maximise generation yield.",
  "Cross-referencing output against historical traffic density data is recommended to validate turbine calibration.",
  "Sustained readings above 170W indicate high-draft conditions — an opportunity to evaluate turbine pitch adjustment.",
];

export function generateFallbackSummary(records) {
  if (!records || records.length === 0) {
    return "Insufficient data to generate a summary. Ensure sensor data is streaming correctly before triggering analysis.";
  }

  const values = records.map(r => parseFloat(r.voltage_watt)).filter(v => !isNaN(v));

  const avg    = values.reduce((s, v) => s + v, 0) / values.length;
  const peak   = Math.max(...values);
  const dip    = Math.min(...values);
  const range  = peak - dip;

  // Population variance for anomaly classification
  const variance = values.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / values.length;
  const stdDev   = Math.sqrt(variance);

  // Classify trend direction using linear regression slope
  const n      = values.length;
  const xMean  = (n - 1) / 2;
  const slope  = values.reduce((s, v, i) => s + (i - xMean) * (v - avg), 0) /
                 values.reduce((s, _, i) => s + Math.pow(i - xMean, 2), 0);

  const trendDir   = slope >  1.5 ? "an upward"
                   : slope < -1.5 ? "a downward"
                   :                "a stable";

  const anomalyStr = stdDev > 20
    ? `Voltage variance is elevated (σ = ${stdDev.toFixed(1)}W), indicating turbulent highway draft conditions — likely caused by mixed heavy and light vehicle traffic.`
    : `Voltage variance is low (σ = ${stdDev.toFixed(1)}W), confirming consistent aerodynamic draft and stable turbine operation across the observed window.`;

  const trendPhrase   = TREND_PHRASES[Math.floor(avg / 70) % TREND_PHRASES.length];
  const insightPhrase = INSIGHT_PHRASES[Math.floor(stdDev) % INSIGHT_PHRASES.length];

  return [
    `Over the last ${values.length} readings, the system recorded a mean energy output of ${avg.toFixed(2)}W, reflecting active turbine engagement with highway draft forces.`,
    `Generation exhibits ${trendDir} trend across the observed window, peaking at ${peak.toFixed(2)}W and dipping to a low of ${dip.toFixed(2)}W — a delta of ${range.toFixed(2)}W. ${trendPhrase}`,
    anomalyStr,
    insightPhrase,
  ].join(" ");
}