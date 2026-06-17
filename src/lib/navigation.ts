import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Boxes,
  Factory,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
} from 'lucide-react';
import type { SessionUser } from '@/data/types';
import { HUB_TABS, NAV_ALIASES } from '@/lib/hub-config';
import { hasPermission } from '@/lib/permissions';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export { HUB_TABS, NAV_ALIASES } from '@/lib/hub-config';

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/operations', label: 'Operations', icon: Factory },
      { href: '/supply-chain', label: 'Supply Chain', icon: Boxes },
      { href: '/employees', label: 'Workforce', icon: Users },
    ],
  },
  {
    label: 'Business',
    items: [
      { href: '/finance', label: 'Finance', icon: Wallet },
      { href: '/reports', label: 'Reports', icon: BarChart3 },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function getHubTabs(hubHref: string, user: SessionUser | null) {
  const tabs = HUB_TABS[hubHref] ?? [];
  return tabs
    .filter((tab) => hasPermission(user, tab.permission))
    .map(({ id, label }) => ({ id, label }));
}

export function resolveHubTab(hubHref: string, tabParam: string | null, user: SessionUser | null) {
  const visibleTabs = getHubTabs(hubHref, user);
  if (visibleTabs.some((tab) => tab.id === tabParam)) return tabParam!;
  return visibleTabs[0]?.id ?? '';
}

export function isNavItemActive(pathname: string, href: string) {
  if (pathname === href || pathname.startsWith(`${href}/`)) return true;

  const aliases = NAV_ALIASES[href];
  return aliases?.some((path) => pathname === path || pathname.startsWith(`${path}/`)) ?? false;
}
