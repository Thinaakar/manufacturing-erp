'use client';

import { SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED, useSidebar } from '@/providers/sidebar-store';

export function AppShellMain({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div
      className="transition-[padding-left] duration-300 ease-in-out"
      style={{ paddingLeft: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED }}
    >
      {children}
    </div>
  );
}
