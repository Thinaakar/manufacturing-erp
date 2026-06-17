'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useChartTheme } from '@/hooks/use-chart-theme';

export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="erp-chart-tooltip">
      {label && <p className="mb-2 text-xs font-medium text-erp-muted">{label}</p>}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-erp-muted">{entry.name}:</span>
          <span className="font-semibold text-erp-text">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function ChartGrid() {
  const chart = useChartTheme();
  return <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />;
}

export function ChartXAxis({ dataKey }: { dataKey: string }) {
  const chart = useChartTheme();
  return (
    <XAxis
      dataKey={dataKey}
      axisLine={false}
      tickLine={false}
      tick={{ fill: chart.muted, fontSize: 11 }}
      dy={8}
    />
  );
}

export function ChartYAxis() {
  const chart = useChartTheme();
  return (
    <YAxis
      axisLine={false}
      tickLine={false}
      tick={{ fill: chart.muted, fontSize: 11 }}
      dx={-4}
    />
  );
}

export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
};

export { useChartTheme, CHART_COLORS } from '@/hooks/use-chart-theme';
