'use client';

import { useMemo } from 'react';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { getFilteredFinancialOverview } from '@/lib/report-filter-utils';
import { useReportFilters } from '@/providers/report-filter-store';

export function ReportFinancialOverview() {
  const { appliedFilters, filterVersion } = useReportFilters();
  const financialTrend = useMemo(
    () => getFilteredFinancialOverview(appliedFilters),
    [appliedFilters, filterVersion],
  );

  return (
    <section className="space-y-4">
      <div>
        <h2 className="erp-section-title">Financial Overview</h2>
        <p className="mt-1 text-sm text-erp-muted">Monthly revenue, cost, and margin performance</p>
      </div>

      <StaggerContainer key={filterVersion} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {financialTrend.map((row) => (
          <StaggerItem key={row.month}>
            <div className="erp-glass-hover rounded-xl p-4">
              <p className="erp-label mb-2">{row.month} 2026</p>
              <p className="text-sm text-erp-muted">
                Revenue{' '}
                <span className="font-display text-lg font-semibold text-erp-success">${row.revenue}M</span>
              </p>
              <p className="text-sm text-erp-muted">
                Cost <span className="font-semibold text-erp-text">${row.cost}M</span>
              </p>
              <p className="mt-2 text-xs text-erp-accent">
                Margin {(((row.revenue - row.cost) / row.revenue) * 100).toFixed(1)}%
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
