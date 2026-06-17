'use client';

import { Activity, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { utilityPanelData } from '@/lib/data/manufacturing-mock';
import { cn } from '@/lib/utils';

export function UtilityPanel() {
  const { shift, plantLoad, alerts, oee } = utilityPanelData;

  return (
    <aside className="fixed inset-y-0 right-0 z-30 hidden w-[300px] flex-col border-l border-erp-border bg-erp-sidebar/95 backdrop-blur-xl xl:flex">
      <div className="flex h-full flex-col bg-gradient-to-b from-erp-sidebar to-erp-bg/90">
        <div className="border-b border-erp-border px-5 py-5">
          <p className="erp-label mb-1">Live Operations</p>
          <p className="font-display text-lg font-semibold text-erp-text">{shift.name}</p>
          <p className="mt-1 text-xs text-erp-muted">{shift.plant}</p>
          <p className="mt-2 text-sm text-erp-accent">{shift.elapsed} elapsed</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-6 erp-glass rounded-xl p-4">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-erp-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-erp-muted">OEE</span>
            </div>
            <p className="font-display text-4xl font-semibold text-erp-text">{oee}%</p>
            <p className="mt-1 text-xs text-erp-success">Above target · 85%</p>
          </div>

          <p className="erp-label mb-3">Plant Load</p>
          <div className="mb-6 space-y-3">
            {plantLoad.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-erp-muted">{item.label}</span>
                  <span className="font-semibold text-erp-text">{item.value}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-erp-bg">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-erp-accent"
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="erp-label mb-3">Active Alerts</p>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'rounded-xl border p-3',
                  alert.severity === 'critical'
                    ? 'border-erp-danger/30 bg-erp-danger/5'
                    : 'border-erp-warning/30 bg-erp-warning/5',
                )}
              >
                <div className="flex gap-2">
                  <AlertTriangle
                    className={cn(
                      'mt-0.5 h-4 w-4 shrink-0',
                      alert.severity === 'critical' ? 'text-erp-danger' : 'text-erp-warning',
                    )}
                  />
                  <div>
                    <p className="text-xs font-medium leading-snug text-erp-text">{alert.title}</p>
                    <p className="mt-1 text-[10px] text-erp-muted">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
