'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ModuleHeaderProps = {
  badge: string;
  title: string;
  subtitle: string;
  description?: string;
  action?: React.ReactNode;
};

export function ModuleHeader({ badge, title, subtitle, description, action }: ModuleHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="erp-glass flex flex-col gap-4 rounded-2xl p-6 lg:flex-row lg:items-center lg:justify-between lg:rounded-erp-lg lg:p-8"
    >
      <div>
        <span className="inline-flex rounded-lg bg-erp-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-erp-accent ring-1 ring-erp-accent/20">
          {badge}
        </span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-erp-text md:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm font-medium text-erp-accent">{subtitle}</p>
        {description && <p className="mt-2 max-w-2xl text-sm text-erp-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}

type ModuleTabsProps = {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
};

export function ModuleTabs({ tabs, active, onChange }: ModuleTabsProps) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-erp-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative px-4 py-2.5 text-sm font-medium transition-colors',
            active === tab.id
              ? 'text-erp-accentSecondary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-gradient-to-r after:from-erp-accent after:to-erp-accentSecondary'
              : 'text-erp-muted hover:text-erp-text',
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 text-xs text-erp-muted">({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
