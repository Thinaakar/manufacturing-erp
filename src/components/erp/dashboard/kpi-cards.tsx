'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  ClipboardList,
  DollarSign,
  Factory,
  Gauge,
  Users,
  Warehouse,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { kpiMetrics } from '@/lib/data/manufacturing-mock';
import { cn } from '@/lib/utils';

const ICONS = {
  factory: Factory,
  clipboard: ClipboardList,
  warehouse: Warehouse,
  dollar: DollarSign,
  gauge: Gauge,
  users: Users,
} as const;

export function KpiCards() {
  return (
    <StaggerContainer className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {kpiMetrics.map((kpi) => {
        const Icon = ICONS[kpi.icon as keyof typeof ICONS];
        const changePositive = kpi.change > 0;

        return (
          <StaggerItem key={kpi.id} className="h-full">
            <div className="group erp-glass-hover relative flex h-full min-h-[152px] flex-col overflow-hidden rounded-2xl p-5 lg:rounded-erp-lg lg:p-6">
              <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-erp-accent/10 to-transparent transition-all group-hover:from-erp-accent/20" />
              <div className="relative flex h-full flex-col">
                <div className="mb-4 flex shrink-0 items-start justify-between">
                  <div className="erp-icon-shell h-11 w-11">
                    <Icon className="h-5 w-5 text-erp-accent" strokeWidth={1.75} />
                  </div>
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center gap-0.5 rounded-lg px-2 py-0.5 text-[11px] font-semibold',
                      changePositive ? 'bg-erp-success/10 text-erp-success' : 'bg-erp-danger/10 text-erp-danger',
                    )}
                  >
                    {changePositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(kpi.change)}%
                  </span>
                </div>
                <p className="erp-label mb-2 min-h-[2rem] line-clamp-2 leading-snug">{kpi.label}</p>
                <p className="erp-kpi-value mt-auto whitespace-nowrap text-2xl md:text-3xl 2xl:text-2xl">
                  <AnimatedCounter
                    value={kpi.value}
                    prefix={'prefix' in kpi ? kpi.prefix : ''}
                    suffix={kpi.suffix}
                    decimals={kpi.suffix === 'M' || kpi.suffix === '%' ? 1 : 0}
                  />
                </p>
              </div>
            </div>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}
