'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Factory, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { NAV_GROUPS, isNavItemActive } from '@/lib/navigation';
import { canAccessNav } from '@/lib/permissions';
import { useAuthStore } from '@/providers/auth-store';
import { SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED, useSidebar } from '@/providers/sidebar-store';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useAuthStore();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/10 bg-erp-sidebar shadow-erp-sidebar transition-[width] duration-300 ease-in-out"
      style={{ width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED }}
    >
      <div className="flex h-full min-h-0 flex-col bg-erp-sidebar">
        <div
          className={cn(
            'shrink-0 border-b border-white/10 bg-erp-sidebar',
            collapsed ? 'px-3 py-4' : 'px-6 py-5',
          )}
        >
          <div className={cn('flex flex-col', collapsed ? 'gap-3' : 'gap-4')}>
            <div className={cn('flex items-center', collapsed ? 'justify-center' : 'gap-3')}>
              <div className="erp-sidebar-icon-shell h-11 w-11 shrink-0">
                <Factory className="h-5 w-5 text-erp-accent" strokeWidth={2} />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold tracking-tight text-erp-sidebarText">
                    ForgeOS
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-erp-sidebarMuted">
                    Manufacturing ERP
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={toggle}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-erp-sidebarMuted transition-all hover:border-erp-accent/30 hover:bg-erp-sidebarHover hover:text-erp-accent"
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-[18px] w-[18px]" />
                ) : (
                  <PanelLeftClose className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
          </div>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto">
          <div>
            {NAV_GROUPS.map((group, groupIndex) => {
              const visibleItems = group.items.filter((item) => canAccessNav(currentUser, item.href));
              if (!visibleItems.length) return null;

              return (
                <motion.div
                  key={group.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: groupIndex * 0.04, duration: 0.35 }}
                  className={cn(groupIndex > 0 && 'border-t border-white/10')}
                >
                  {!collapsed && (
                    <p className="erp-sidebar-label mb-1 px-5 pb-2 pt-5">{group.label}</p>
                  )}
                  <div>
                    {visibleItems.map(({ href, label, icon: Icon }) => {
                      const active = isNavItemActive(pathname, href);

                      return (
                        <Link
                          key={href}
                          href={href}
                          title={collapsed ? label : undefined}
                          aria-label={collapsed ? label : undefined}
                          className={cn(
                            'group flex w-full items-center py-3.5 text-sm font-medium transition-all duration-300',
                            collapsed ? 'justify-center px-0' : 'gap-3 px-5',
                            active
                              ? 'erp-sidebar-link-active'
                              : 'erp-sidebar-link text-erp-sidebarMuted',
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-[18px] w-[18px] shrink-0 transition-colors',
                              active ? 'text-white' : 'text-erp-sidebarMuted group-hover:text-erp-accent',
                            )}
                            strokeWidth={active ? 2.25 : 1.75}
                          />
                          {!collapsed && (
                            <span className={active ? 'text-white' : 'text-erp-sidebarMuted group-hover:text-erp-sidebarText'}>
                              {label}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
