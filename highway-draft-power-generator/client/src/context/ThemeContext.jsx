import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const dark = {
  bg:                '#060b16',
  bgSecondary:       '#0a1120',
  surface:           'rgba(13,24,48,0.8)',
  border:            'rgba(6,182,212,0.15)',
  borderSubtle:      'rgba(6,182,212,0.1)',
  text:              '#e2e8f0',
  textMuted:         '#94a3b8',
  textFaint:         '#475569',
  textGhost:         '#334155',
  topbarBg:          'rgba(6,11,22,0.95)',
  topbarBorder:      'rgba(6,182,212,0.18)',
  accent:            '#06b6d4',
  accentBg:          'rgba(6,182,212,0.1)',
  accentBorder:      'rgba(6,182,212,0.3)',
  success:           '#22c55e',
  successBg:         'rgba(34,197,94,0.12)',
  successBorder:     'rgba(34,197,94,0.3)',
  danger:            '#ef4444',
  dangerBg:          'rgba(239,68,68,0.12)',
  dangerBorder:      'rgba(239,68,68,0.3)',
  warning:           '#facc15',
  purple:            '#a78bfa',
  inputBg:           'rgba(255,255,255,0.05)',
  inputBorder:       'rgba(6,182,212,0.2)',
  panelBg:           'rgba(255,255,255,0.03)',
  tabBarBg:          'rgba(0,0,0,0.25)',
  tabBarBorder:      'rgba(6,182,212,0.1)',
  statCardBg:        'rgba(10,17,32,0.9)',
  statCardBorder:    'rgba(6,182,212,0.12)',
  tableRowAlt:       'rgba(255,255,255,0.015)',
  tableHeaderColor:  '#475569',
  statusGreenGlow:   '0 0 8px #22c55e',
  cardShadow:        'none',
  // chart
  chartStroke:       '#06b6d4',
  chartAreaColor:    '#06b6d4',
  chartAreaOp1:       0.35,
  chartAreaOp2:       0.02,
  chartBarTop:       '#06b6d4',
  chartBarBot:       '#0e7490',
  chartGrid:         'rgba(6,182,212,0.1)',
  chartLabel:        '#475569',
  tooltipBg:         '#0f172a',
  tooltipBorder:     'rgba(6,182,212,0.4)',
  tooltipText:       '#e2e8f0',
  // badges
  badgeHigh:         { color: '#4ade80', bg: '#4ade8020' },
  badgeNormal:       { color: '#06b6d4', bg: '#06b6d420' },
  badgeLow:          { color: '#facc15', bg: '#facc1520' },
  badgeCritical:     { color: '#f87171', bg: '#f8717120' },
};

export const light = {
  bg:                '#f8fafc',
  bgSecondary:       '#f1f5f9',
  surface:           'rgba(255,255,255,0.85)',
  border:            'rgba(148,163,184,0.35)',
  borderSubtle:      'rgba(148,163,184,0.2)',
  text:              '#1e293b',
  textMuted:         '#475569',
  textFaint:         '#64748b',
  textGhost:         '#94a3b8',
  topbarBg:          'rgba(255,255,255,0.97)',
  topbarBorder:      'rgba(148,163,184,0.22)',
  accent:            '#2563eb',
  accentBg:          'rgba(37,99,235,0.08)',
  accentBorder:      'rgba(37,99,235,0.3)',
  success:           '#16a34a',
  successBg:         'rgba(22,163,74,0.08)',
  successBorder:     'rgba(22,163,74,0.3)',
  danger:            '#dc2626',
  dangerBg:          'rgba(220,38,38,0.08)',
  dangerBorder:      'rgba(220,38,38,0.25)',
  warning:           '#d97706',
  purple:            '#7c3aed',
  inputBg:           '#ffffff',
  inputBorder:       'rgba(148,163,184,0.45)',
  panelBg:           '#f8fafc',
  tabBarBg:          '#f1f5f9',
  tabBarBorder:      'rgba(148,163,184,0.2)',
  statCardBg:        '#ffffff',
  statCardBorder:    'rgba(148,163,184,0.2)',
  tableRowAlt:       'rgba(0,0,0,0.025)',
  tableHeaderColor:  '#64748b',
  statusGreenGlow:   '0 0 8px rgba(22,163,74,0.35)',
  cardShadow:        '0 4px 24px rgba(15,23,42,0.08), 0 1px 3px rgba(15,23,42,0.04)',
  // chart
  chartStroke:       '#2563eb',
  chartAreaColor:    '#2563eb',
  chartAreaOp1:       0.18,
  chartAreaOp2:       0.01,
  chartBarTop:       '#2563eb',
  chartBarBot:       '#1d4ed8',
  chartGrid:         'rgba(37,99,235,0.08)',
  chartLabel:        '#94a3b8',
  tooltipBg:         '#ffffff',
  tooltipBorder:     'rgba(37,99,235,0.3)',
  tooltipText:       '#1e293b',
  // badges
  badgeHigh:         { color: '#16a34a', bg: '#16a34a14' },
  badgeNormal:       { color: '#2563eb', bg: '#2563eb12' },
  badgeLow:          { color: '#d97706', bg: '#d9770614' },
  badgeCritical:     { color: '#dc2626', bg: '#dc262612' },
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem('hdpg_theme') || 'dark'
  );
  const tokens = mode === 'dark' ? dark : light;

  useEffect(() => {
    document.body.setAttribute('data-theme', mode);
    document.body.style.background = tokens.bg;
    document.body.style.color = tokens.text;
    localStorage.setItem('hdpg_theme', mode);
  }, [mode, tokens.bg, tokens.text]);

  const toggle = () => setMode(m => (m === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ mode, tokens, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);