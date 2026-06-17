'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';
import {
  Bar,
  BarChart,
  Cell,
  ChartGrid,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  useChartTheme,
} from '@/components/erp/charts/chart-primitives';
import {
  getFilteredInventoryChart,
  getFilteredProductionChart,
  getFilteredRevenueChart,
} from '@/lib/report-filter-utils';
import { useReportFilters } from '@/providers/report-filter-store';

export function ReportCharts() {
  const chart = useChartTheme();
  const { appliedFilters, filterVersion } = useReportFilters();

  const reportProductionChart = useMemo(
    () => getFilteredProductionChart(appliedFilters),
    [appliedFilters, filterVersion],
  );
  const reportInventoryChart = useMemo(
    () => getFilteredInventoryChart(appliedFilters),
    [appliedFilters, filterVersion],
  );
  const reportRevenueChart = useMemo(
    () => getFilteredRevenueChart(appliedFilters),
    [appliedFilters, filterVersion],
  );

  return (
    <StaggerContainer key={filterVersion} className="grid gap-6 lg:grid-cols-3">
      <StaggerItem className="lg:col-span-2">
        <Card className="erp-glass-hover overflow-hidden">
          <CardHeader>
            <CardTitle>Production Report</CardTitle>
            <p className="text-sm text-erp-muted">Actual vs planned output with efficiency index</p>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <ComposedChart data={reportProductionChart}>
                <ChartGrid />
                <ChartXAxis dataKey="month" />
                <ChartYAxis />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="planned" name="Planned" fill={chart.muted} fillOpacity={0.3} radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill={chart.accent} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="efficiency" name="Efficiency %" stroke={chart.success} strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card className="erp-glass-hover overflow-hidden">
          <CardHeader>
            <CardTitle>Inventory Distribution</CardTitle>
            <p className="text-sm text-erp-muted">Stock by category</p>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={reportInventoryChart}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  animationDuration={1200}
                >
                  {reportInventoryChart.map((entry) => (
                    <Cell key={entry.category} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {reportInventoryChart.map((item) => (
                <div key={item.category} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ background: item.fill }} />
                  <span className="text-erp-muted">{item.category}</span>
                  <span className="ml-auto font-semibold text-erp-text">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem className="lg:col-span-3">
        <Card className="erp-glass-hover overflow-hidden">
          <CardHeader>
            <CardTitle>Revenue Report</CardTitle>
            <p className="text-sm text-erp-muted">Gross revenue, net profit & margin trend ($M)</p>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={reportRevenueChart} barGap={6}>
                <ChartGrid />
                <ChartXAxis dataKey="month" />
                <ChartYAxis />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="gross" name="Gross Revenue" fill={chart.accent} radius={[6, 6, 0, 0]} />
                <Bar dataKey="net" name="Net Profit" fill={chart.success} radius={[6, 6, 0, 0]} />
                <Bar dataKey="margin" name="Margin %" fill={chart.warning} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  );
}
