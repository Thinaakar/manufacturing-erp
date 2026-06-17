'use client';

import { Award, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { dashboardWidgets } from '@/lib/data/manufacturing-mock';

export function DashboardWidgets() {
  const { topLine, maintenance, qualityScore, delivery } = dashboardWidgets;

  return (
    <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Top Line */}
      <StaggerItem>
        <Card className="erp-glass-hover relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-erp-accent/10 to-transparent" />
          <CardHeader className="relative">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-erp-accent" />
              <CardTitle className="text-base">Top Production Line</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <p className="font-display text-lg font-semibold text-erp-text">{topLine.name}</p>
            <p className="mt-3 erp-kpi-value text-2xl">
              <AnimatedCounter value={topLine.efficiency} suffix="%" decimals={1} />
            </p>
            <p className="mt-1 text-sm text-erp-muted">{topLine.output}</p>
            <Badge variant="success" className="mt-3">+{topLine.trend}% vs last shift</Badge>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Maintenance */}
      <StaggerItem>
        <Card className="erp-glass-hover h-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-erp-warning" />
              <CardTitle className="text-base">Maintenance Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {maintenance.map((item) => (
              <div key={item.machine} className="rounded-xl border border-erp-border bg-erp-bg/40 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-erp-text">{item.machine}</p>
                  <Badge variant={item.priority === 'high' ? 'danger' : 'warning'}>{item.priority}</Badge>
                </div>
                <p className="mt-1 text-xs text-erp-muted">{item.issue}</p>
                <p className="mt-2 text-[11px] font-medium text-erp-warning">Due: {item.due}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Quality Score */}
      <StaggerItem>
        <Card className="erp-glass-hover h-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-erp-success" />
              <CardTitle className="text-base">Quality Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="erp-kpi-value">
              <AnimatedCounter value={qualityScore.score} suffix="%" decimals={1} />
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-erp-bg/50 p-3">
                <p className="text-xs text-erp-muted">Defects</p>
                <p className="font-semibold text-erp-danger">{qualityScore.defects}</p>
              </div>
              <div className="rounded-lg bg-erp-bg/50 p-3">
                <p className="text-xs text-erp-muted">Inspected</p>
                <p className="font-semibold text-erp-text">{qualityScore.inspected.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Delivery */}
      <StaggerItem>
        <Card className="erp-glass-hover h-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-erp-accent" />
              <CardTitle className="text-base">Delivery Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="erp-kpi-value">
              <AnimatedCounter value={delivery.onTime} suffix="%" decimals={1} />
            </p>
            <p className="mt-1 text-sm text-erp-muted">On-time delivery rate</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-erp-bg">
              <div
                className="h-full rounded-full bg-gradient-to-r from-erp-accent to-erp-success"
                style={{ width: `${delivery.onTime}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-erp-muted">Avg delay: {delivery.avgDelay}</p>
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  );
}
