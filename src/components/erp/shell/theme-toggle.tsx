'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-erp-border bg-erp-card/50 text-erp-muted transition-all hover:border-erp-accent/30 hover:text-erp-text"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to night mode'}
      title={isDark ? 'Light mode' : 'Night mode'}
    >
      {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}
