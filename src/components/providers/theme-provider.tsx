'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { applyTheme, getStoredTheme, type Theme } from '@/lib/theme';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    applyTheme('light');
    const stored = getStoredTheme();
    if (stored === 'dark') {
      localStorage.setItem('forgeos-theme', 'light');
    }
    setThemeState('light');
    setReady(true);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    const resolved = 'light';
    setThemeState(resolved);
    applyTheme(resolved);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState('light');
    applyTheme('light');
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  if (!ready) {
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
