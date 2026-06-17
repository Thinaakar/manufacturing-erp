import type { ErpRole, SessionUser } from '@/data/types';
import { HUB_TABS, LEGACY_HUB_PATHS } from '@/lib/hub-config';

export type PermissionKey = string;

const NAV_PERMISSION_MAP: Record<string, string> = {
  '/dashboard': 'dashboard.view',
  '/production': 'production.view',
  '/inventory': 'inventory.view',
  '/purchasing': 'purchasing.view',
  '/sales': 'sales.view',
  '/maintenance': 'maintenance.view',
  '/employees': 'employees.view',
  '/quality': 'quality.view',
  '/finance': 'finance.view',
  '/reports': 'reports.view',
  '/settings': 'settings.view',
};

export function getPermissionsForRole(roleName: string, roles: ErpRole[]): string[] {
  const role = roles.find((r) => r.name === roleName && r.status === 'active');
  return role?.permissions ?? [];
}

export function hasPermission(user: SessionUser | null, permission: string): boolean {
  if (!user) return false;
  return user.permissions.includes(permission);
}

export function hasAnyPermission(user: SessionUser | null, permissions: string[]): boolean {
  return permissions.some((p) => hasPermission(user, p));
}

function canAccessHub(user: SessionUser | null, hubHref: string): boolean {
  const tabs = HUB_TABS[hubHref];
  if (!tabs?.length) return false;
  return tabs.some((tab) => hasPermission(user, tab.permission));
}

export function canAccessNav(user: SessionUser | null, href: string): boolean {
  if (href in HUB_TABS) return canAccessHub(user, href);

  const permission = NAV_PERMISSION_MAP[href];
  if (!permission) return true;
  return hasPermission(user, permission);
}

export function canAccessPath(user: SessionUser | null, pathname: string): boolean {
  if (pathname.startsWith('/settings')) {
    return hasPermission(user, 'settings.view');
  }

  const segments = pathname.split('/').filter(Boolean);
  const base = segments.length ? `/${segments[0]}` : '/';

  if (base in HUB_TABS) return canAccessHub(user, base);

  if (base in LEGACY_HUB_PATHS) {
    const permission = NAV_PERMISSION_MAP[base];
    return permission ? hasPermission(user, permission) : true;
  }

  if (base === '/') return hasPermission(user, 'dashboard.view');

  return canAccessNav(user, base);
}

export function canManageRolesAndPermissions(user: SessionUser | null): boolean {
  return hasPermission(user, 'roles.view') && hasPermission(user, 'permissions.assign');
}

export function getLoginRedirect(role: string): string {
  switch (role) {
    case 'finance_analyst':
      return '/finance';
    case 'quality_lead':
      return '/operations?tab=quality';
    case 'plant_supervisor':
    case 'operator':
      return '/operations?tab=production';
    default:
      return '/dashboard';
  }
}

export function isSuperAdmin(user: SessionUser | null): boolean {
  return user?.role === 'super_admin';
}

export { LEGACY_HUB_PATHS };
