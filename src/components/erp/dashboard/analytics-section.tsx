'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ChartGrid,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  useChartTheme,
} from '@/components/erp/charts/chart-primitives';
import {
  inventoryMovement,
  productionTrend,
  revenueAnalysis,
} from '@/lib/data/manufacturing-mock';

export function AnalyticsSection() {
  const chart = useChartTheme();

  return (
    <StaggerContainer className="grid gap-6 lg:grid-cols-3">
      <StaggerItem className="lg:col-span-1">
        <Card className="erp-glass-hover h-full overflow-hidden">
          <CardHeader>
            <CardTitle>Production Trend</CardTitle>
            <p className="text-sm text-erp-muted">Monthly output vs target</p>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={productionTrend}>
                <defs>
                  <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chart.accent} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={chart.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <ChartGrid />
                <ChartXAxis dataKey="month" />
                <ChartYAxis />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="production"
                  name="Production"
                  stroke={chart.accent}
                  strokeWidth={2}
                  fill="url(#prodGrad)"
                  animationDuration={1200}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target"
                  stroke={chart.muted}
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem className="lg:col-span-1">
        <Card className="erp-glass-hover h-full overflow-hidden">
          <CardHeader>
            <CardTitle>Revenue Analysis</CardTitle>
            <p className="text-sm text-erp-muted">Gross revenue vs operating cost ($M)</p>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={revenueAnalysis} barGap={4}>
                <ChartGrid />
                <ChartXAxis dataKey="month" />
                <ChartYAxis />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill={chart.accent} radius={[6, 6, 0, 0]} animationDuration={1200} />
                <Bar dataKey="cost" name="Cost" fill={chart.muted} fillOpacity={0.4} radius={[6, 6, 0, 0]} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem className="lg:col-span-1">
        <Card className="erp-glass-hover h-full overflow-hidden">
          <CardHeader>
            <CardTitle>Inventory Movement</CardTitle>
            <p className="text-sm text-erp-muted">Weekly inbound vs outbound units</p>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={inventoryMovement}>
                <ChartGrid />
                <ChartXAxis dataKey="week" />
                <ChartYAxis />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="inbound"
                  name="Inbound"
                  stroke={chart.success}
                  strokeWidth={2}
                  dot={{ fill: chart.success, r: 3 }}
                  animationDuration={1200}
                />
                <Line
                  type="monotone"
                  dataKey="outbound"
                  name="Outbound"
                  stroke={chart.warning}
                  strokeWidth={2}
                  dot={{ fill: chart.warning, r: 3 }}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  );
}
