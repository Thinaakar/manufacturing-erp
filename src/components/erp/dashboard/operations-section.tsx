'use client';

import { AlertTriangle, Cpu, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';
import {
  inventoryAlerts,
  machineHealth,
  productionStatus,
} from '@/lib/data/manufacturing-mock';
import { cn } from '@/lib/utils';

function statusVariant(status: string): 'success' | 'warning' | 'danger' {
  if (status === 'optimal') return 'success';
  if (status === 'warning') return 'warning';
  return 'danger';
}

export function OperationsSection() {
  return (
    <StaggerContainer className="grid gap-6 lg:grid-cols-3">
      {/* Machine Health */}
      <StaggerItem>
        <Card className="erp-glass-hover h-full">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-erp-accent" />
                Machine Health
              </CardTitle>
              <p className="text-sm text-erp-muted">Real-time equipment monitoring</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {machineHealth.map((machine) => (
              <div
                key={machine.id}
                className="rounded-xl border border-erp-border bg-erp-bg/40 p-4 transition-colors hover:border-erp-accent/20"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-erp-text">{machine.name}</p>
                    <p className="text-xs text-erp-muted">{machine.id}</p>
                  </div>
                  <Badge variant={statusVariant(machine.status)}>{machine.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-erp-muted">Uptime</span>
                    <p className="font-semibold text-erp-text">{machine.uptime}%</p>
                  </div>
                  <div>
                    <span className="text-erp-muted">Load</span>
                    <p className="font-semibold text-erp-text">{machine.load}%</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-erp-bg">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      machine.status === 'optimal' && 'bg-erp-success',
                      machine.status === 'warning' && 'bg-erp-warning',
                      machine.status === 'critical' && 'bg-erp-danger',
                    )}
                    style={{ width: `${machine.uptime}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Production Status */}
      <StaggerItem>
        <Card className="erp-glass-hover h-full">
          <CardHeader>
            <CardTitle>Production Status</CardTitle>
            <p className="text-sm text-erp-muted">Active line progress</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {productionStatus.map((line) => (
              <div key={line.line} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-erp-text">{line.line}</p>
                    <p className="text-xs text-erp-muted">{line.product}</p>
                  </div>
                  <span className="font-mono text-xs text-erp-accent">{line.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-erp-bg">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-erp-accent to-erp-success transition-all"
                    style={{ width: `${line.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-erp-muted">
                  <span>{line.units.toLocaleString()} units</span>
                  <span>ETA {line.eta}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Inventory Alerts */}
      <StaggerItem>
        <Card className="erp-glass-hover h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-erp-warning" />
              Inventory Alerts
            </CardTitle>
            <p className="text-sm text-erp-muted">Stock below threshold</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {inventoryAlerts.map((alert) => (
              <div
                key={alert.sku}
                className="flex items-center gap-3 rounded-xl border border-erp-border bg-erp-bg/40 p-4"
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                    alert.severity === 'critical' ? 'bg-erp-danger/15' : 'bg-erp-warning/15',
                  )}
                >
                  <AlertTriangle
                    className={cn('h-4 w-4', alert.severity === 'critical' ? 'text-erp-danger' : 'text-erp-warning')}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-erp-text">{alert.item}</p>
                  <p className="text-xs text-erp-muted">{alert.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-erp-text">{alert.level}%</p>
                  <p className="text-[10px] text-erp-muted">min {alert.threshold}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  );
}
