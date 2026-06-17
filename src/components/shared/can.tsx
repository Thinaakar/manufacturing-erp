'use client';

import { hasAnyPermission, hasPermission } from '@/lib/permissions';
import { useAuthStore } from '@/providers/auth-store';

export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { currentUser } = useAuthStore();
  const allowed = Array.isArray(permission)
    ? hasAnyPermission(currentUser, permission)
    : hasPermission(currentUser, permission);
  return allowed ? <>{children}</> : <>{fallback}</>;
}
