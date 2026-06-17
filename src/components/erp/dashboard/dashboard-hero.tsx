'use client';

import { Activity, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { dashboardHero } from '@/lib/data/manufacturing-mock';

export function DashboardHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-erp-border bg-white p-8 shadow-erp-card md:p-10 lg:rounded-erp-xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-erp-hero" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-erp-accent/5 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <Badge variant="default">Executive Command Center</Badge>
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-erp-text md:text-4xl lg:text-[2.75rem]">
              {dashboardHero.title}
            </h1>
            <p className="mt-2 font-display text-lg text-erp-accent md:text-xl">{dashboardHero.subtitle}</p>
          </div>
          <p className="text-base leading-relaxed text-erp-muted">{dashboardHero.welcome}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <div className="erp-glass rounded-xl px-5 py-4">
            <div className="mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-erp-accent" />
              <span className="erp-label">Date & Shift</span>
            </div>
            <p className="text-sm font-medium text-erp-text">{dashboardHero.date}</p>
            <p className="mt-1 text-xs text-erp-muted">{dashboardHero.shift}</p>
          </div>
          <div className="erp-glass rounded-xl px-5 py-4">
            <div className="mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-erp-success" />
              <span className="text-xs font-semibold uppercase tracking-wider text-erp-success">
                {dashboardHero.status}
              </span>
            </div>
            <p className="text-sm text-erp-text">{dashboardHero.statusDetail}</p>
          </div>
          <div className="erp-glass rounded-xl px-5 py-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-erp-muted" />
              <span className="erp-label">{dashboardHero.lastUpdated}</span>
            </div>
            <p className="text-sm font-medium text-erp-text">Real-time factory telemetry</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
