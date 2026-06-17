'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';
import {
  activeManufacturingJobs,
  inventoryWarnings,
  recentProductionOrders,
} from '@/lib/data/manufacturing-mock';

function orderStatusVariant(status: string): 'default' | 'success' | 'warning' | 'muted' {
  if (status === 'Completed') return 'success';
  if (status === 'In Progress') return 'default';
  if (status === 'Quality Check') return 'warning';
  return 'muted';
}

export function DashboardTables() {
  return (
    <StaggerContainer className="grid gap-6 xl:grid-cols-3">
      <StaggerItem className="xl:col-span-2">
        <Card className="erp-glass-hover overflow-hidden">
          <CardHeader>
            <CardTitle>Recent Production Orders</CardTitle>
            <p className="text-sm text-erp-muted">Latest manufacturing orders across all lines</p>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-erp-border bg-erp-bg/40">
                  <th className="erp-table-head">Order ID</th>
                  <th className="erp-table-head">Product</th>
                  <th className="erp-table-head">Qty</th>
                  <th className="erp-table-head">Line</th>
                  <th className="erp-table-head">Status</th>
                  <th className="erp-table-head">Due</th>
                </tr>
              </thead>
              <tbody>
                {recentProductionOrders.map((order) => (
                  <tr key={order.id} className="border-b border-erp-border/50 transition-colors hover:bg-erp-accent/5">
                    <td className="erp-table-cell font-mono text-xs text-erp-accent">{order.id}</td>
                    <td className="erp-table-cell font-medium">{order.product}</td>
                    <td className="erp-table-cell font-mono">{order.qty.toLocaleString()}</td>
                    <td className="erp-table-cell">{order.line}</td>
                    <td className="erp-table-cell">
                      <Badge variant={orderStatusVariant(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="erp-table-cell text-erp-muted">{order.due}</td>
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
            <CardTitle>Inventory Warnings</CardTitle>
            <p className="text-sm text-erp-muted">Critical stock levels</p>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-erp-border bg-erp-bg/40">
                  <th className="erp-table-head">Item</th>
                  <th className="erp-table-head">Days</th>
                  <th className="erp-table-head">Action</th>
                </tr>
              </thead>
              <tbody>
                {inventoryWarnings.map((row) => (
                  <tr key={row.sku} className="border-b border-erp-border/50 hover:bg-erp-danger/5">
                    <td className="erp-table-cell">
                      <p className="text-sm font-medium">{row.item}</p>
                      <p className="text-xs text-erp-muted">{row.warehouse}</p>
                    </td>
                    <td className="erp-table-cell">
                      <span className="font-mono text-sm font-semibold text-erp-danger">{row.daysLeft}d</span>
                    </td>
                    <td className="erp-table-cell">
                      <Badge variant="danger">{row.action}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem className="xl:col-span-3">
        <Card className="erp-glass-hover overflow-hidden">
          <CardHeader>
            <CardTitle>Active Manufacturing Jobs</CardTitle>
            <p className="text-sm text-erp-muted">Current shop floor operations</p>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-erp-border bg-erp-bg/40">
                  <th className="erp-table-head">Job ID</th>
                  <th className="erp-table-head">Operation</th>
                  <th className="erp-table-head">Machine</th>
                  <th className="erp-table-head">Operator</th>
                  <th className="erp-table-head">Shift</th>
                  <th className="erp-table-head">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {activeManufacturingJobs.map((job) => (
                  <tr key={job.id} className="border-b border-erp-border/50 hover:bg-erp-accent/5">
                    <td className="erp-table-cell font-mono text-xs text-erp-accent">{job.id}</td>
                    <td className="erp-table-cell font-medium">{job.operation}</td>
                    <td className="erp-table-cell font-mono text-xs">{job.machine}</td>
                    <td className="erp-table-cell">{job.operator}</td>
                    <td className="erp-table-cell text-erp-muted">{job.shift}</td>
                    <td className="erp-table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-erp-bg">
                          <div
                            className="h-full rounded-full bg-erp-accent"
                            style={{ width: `${job.efficiency}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs">{job.efficiency}%</span>
                      </div>
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
