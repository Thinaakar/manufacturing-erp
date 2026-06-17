'use client';

import { useEffect, useState } from 'react';

const PREMIUM = {
  accent: '#14B8A6',
  accentSecondary: '#0F766E',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  muted: '#64748B',
  grid: 'rgba(226, 232, 240, 0.9)',
  gold: '#14B8A6',
  tick: '#64748B',
  tooltipBg: 'rgba(255, 255, 255, 0.98)',
  tooltipBorder: '#E2E8F0',
};

export function useChartTheme() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted ? PREMIUM : PREMIUM;
}

export const CHART_COLORS = PREMIUM;
