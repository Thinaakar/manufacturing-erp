'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';
import {
  getFilteredInventorySummary,
  getFilteredPerformanceSummary,
  getFilteredProductionSummary,
} from '@/lib/report-filter-utils';
import { useReportFilters } from '@/providers/report-filter-store';

function perfStatusVariant(status: string): 'success' | 'warning' | 'danger' {
  if (status === 'Above Target') return 'success';
  if (status === 'Below Target') return 'danger';
  return 'warning';
}

export function ReportTables() {
  const { appliedFilters, filterVersion } = useReportFilters();

  const productionSummary = useMemo(
    () => getFilteredProductionSummary(appliedFilters),
    [appliedFilters, filterVersion],
  );
  const inventorySummary = useMemo(
    () => getFilteredInventorySummary(appliedFilters),
    [appliedFilters, filterVersion],
  );
  const performanceSummary = useMemo(
    () => getFilteredPerformanceSummary(appliedFilters),
    [appliedFilters, filterVersion],
  );

  return (
    <StaggerContainer key={filterVersion} className="grid gap-6 lg:grid-cols-3">
      <StaggerItem>
        <Card className="erp-glass-hover overflow-hidden">
          <CardHeader>
            <CardTitle>Production Summary</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[320px]">
              <thead>
                <tr className="border-b border-erp-border bg-erp-bg/40">
                  <th className="erp-table-head">Line</th>
                  <th className="erp-table-head">Actual</th>
                  <th className="erp-table-head">Var</th>
                  <th className="erp-table-head">Eff.</th>
                </tr>
              </thead>
              <tbody>
                {productionSummary.map((row) => (
                  <tr key={row.line} className="border-b border-erp-border/50 hover:bg-erp-accent/5">
                    <td className="erp-table-cell font-medium">{row.line}</td>
                    <td className="erp-table-cell font-mono">{row.actual.toLocaleString()}</td>
                    <td className={`erp-table-cell font-mono ${row.variance >= 0 ? 'text-erp-success' : 'text-erp-danger'}`}>
                      {row.variance > 0 ? '+' : ''}{row.variance}%
                    </td>
                    <td className="erp-table-cell font-mono">{row.efficiency}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card className="erp-glass-hover overflow-hidden">
          <CardHeader>
            <CardTitle>Inventory Summary</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[320px]">
              <thead>
                <tr className="border-b border-erp-border bg-erp-bg/40">
                  <th className="erp-table-head">Category</th>
                  <th className="erp-table-head">Value</th>
                  <th className="erp-table-head">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventorySummary.map((row) => (
                  <tr key={row.category} className="border-b border-erp-border/50 hover:bg-erp-accent/5">
                    <td className="erp-table-cell font-medium">{row.category}</td>
                    <td className="erp-table-cell font-mono">{row.value}</td>
                    <td className="erp-table-cell">
                      <Badge variant={row.status === 'Normal' ? 'muted' : row.status === 'High' ? 'warning' : 'default'}>
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card className="erp-glass-hover overflow-hidden">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[320px]">
              <thead>
                <tr className="border-b border-erp-border bg-erp-bg/40">
                  <th className="erp-table-head">Metric</th>
                  <th className="erp-table-head">Value</th>
                  <th className="erp-table-head">Status</th>
                </tr>
              </thead>
              <tbody>
                {performanceSummary.map((row) => (
                  <tr key={row.metric} className="border-b border-erp-border/50 hover:bg-erp-accent/5">
                    <td className="erp-table-cell text-sm">{row.metric}</td>
                    <td className="erp-table-cell font-mono font-semibold">{row.value}</td>
                    <td className="erp-table-cell">
                      <Badge variant={perfStatusVariant(row.status)}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  );
}
