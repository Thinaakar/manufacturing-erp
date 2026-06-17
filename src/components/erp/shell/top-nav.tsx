'use client';

import { ChevronDown, LogOut, Search } from 'lucide-react';
import { useAuthStore } from '@/providers/auth-store';
import { useRouter } from 'next/navigation';

export function TopNav() {
  const { currentUser, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-erp-border bg-white/85 shadow-sm backdrop-blur-xl">
      <div className="flex h-[76px] items-center justify-between gap-4 px-8">
        <div className="relative max-w-lg flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-erp-muted" />
          <input
            type="search"
            placeholder="Search orders, machines, inventory…"
            className="erp-input pl-11"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-erp-border bg-white py-1.5 pl-1.5 pr-2 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-erp-accent to-erp-accentSecondary text-xs font-bold text-white shadow-erp-glow">
              {currentUser?.avatar ?? '??'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-erp-text">{currentUser?.name ?? 'Guest'}</p>
              <p className="text-[11px] capitalize text-erp-muted">
                {currentUser?.role.replace(/_/g, ' ') ?? 'No role'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-xl text-erp-muted transition-colors hover:bg-erp-cardHover hover:text-erp-danger"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <ChevronDown className="hidden h-4 w-4 text-erp-muted sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
