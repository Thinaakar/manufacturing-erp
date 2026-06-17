'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { canAccessPath } from '@/lib/permissions';
import { useAuthStore } from '@/providers/auth-store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, loading, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!canAccessPath(currentUser, pathname)) {
      router.replace('/dashboard');
    }
  }, [loading, isAuthenticated, currentUser, pathname, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-erp-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-erp-muted border-t-erp-accent" />
      </div>
    );
  }

  return <>{children}</>;
}
