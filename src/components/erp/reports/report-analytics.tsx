'use client';

import { useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { getFilteredReportAnalytics } from '@/lib/report-filter-utils';
import { useReportFilters } from '@/providers/report-filter-store';
import { cn } from '@/lib/utils';

export function ReportAnalyticsCards() {
  const { appliedFilters, filterVersion } = useReportFilters();
  const reportAnalytics = useMemo(
    () => getFilteredReportAnalytics(appliedFilters),
    [appliedFilters, filterVersion],
  );

  return (
    <StaggerContainer key={filterVersion} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {reportAnalytics.map((item) => {
        const positive = item.change > 0;
        return (
          <StaggerItem key={item.label}>
            <div className="erp-glass-hover rounded-2xl p-6 lg:rounded-erp-lg lg:p-7">
              <p className="erp-label mb-3">{item.label}</p>
              <p className="font-display text-3xl font-semibold text-erp-text">
                {item.unit === '$M' && '$'}
                <AnimatedCounter
                  value={item.value}
                  suffix={item.unit === '$M' ? 'M' : item.unit === '%' ? '%' : item.unit === 'units' ? '' : ''}
                  decimals={item.unit === '$M' || item.unit === '%' ? 1 : 0}
                />
                {item.unit === 'units' && (
                  <span className="ml-1 text-lg text-erp-muted">units</span>
                )}
              </p>
              <span
                className={cn(
                  'mt-3 inline-flex items-center gap-0.5 text-xs font-semibold',
                  positive ? 'text-erp-success' : 'text-erp-danger',
                )}
              >
                {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {Math.abs(item.change)}% vs previous period
              </span>
            </div>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}
