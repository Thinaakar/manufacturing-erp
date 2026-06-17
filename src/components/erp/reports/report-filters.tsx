'use client';

import { Calendar, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  REPORT_DATE_LABELS,
  REPORT_PLANT_LABELS,
  type ReportDateRange,
  type ReportPlant,
} from '@/lib/report-filter-utils';
import { useReportFilters } from '@/providers/report-filter-store';

export function ReportFilters() {
  const {
    draftPlant,
    draftDateRange,
    appliedFilters,
    filterVersion,
    setDraftPlant,
    setDraftDateRange,
    applyFilters,
  } = useReportFilters();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card className="erp-glass overflow-hidden">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-erp-text md:text-3xl">
              Manufacturing Reports
            </h1>
            <p className="mt-1 text-sm text-erp-muted">
              Executive analytics · Production, revenue, inventory & performance
            </p>
            {filterVersion > 0 && (
              <p className="mt-2 text-xs font-medium text-erp-accent">
                Showing {REPORT_PLANT_LABELS[appliedFilters.plant]} · {REPORT_DATE_LABELS[appliedFilters.dateRange]}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-erp-border bg-erp-bg/50 px-4 py-2.5">
              <Filter className="h-4 w-4 text-erp-muted" />
              <select
                value={draftPlant}
                onChange={(e) => setDraftPlant(e.target.value as ReportPlant)}
                className="bg-transparent text-sm font-medium text-erp-text outline-none"
              >
                <option value="all">{REPORT_PLANT_LABELS.all}</option>
                <option value="plant01">{REPORT_PLANT_LABELS.plant01}</option>
                <option value="plant02">{REPORT_PLANT_LABELS.plant02}</option>
              </select>
              <ChevronDown className="h-4 w-4 text-erp-muted" />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-erp-border bg-erp-bg/50 px-4 py-2.5">
              <Calendar className="h-4 w-4 text-erp-muted" />
              <select
                value={draftDateRange}
                onChange={(e) => setDraftDateRange(e.target.value as ReportDateRange)}
                className="bg-transparent text-sm font-medium text-erp-text outline-none"
              >
                <option value="6m">{REPORT_DATE_LABELS['6m']}</option>
                <option value="30d">{REPORT_DATE_LABELS['30d']}</option>
                <option value="quarter">{REPORT_DATE_LABELS.quarter}</option>
                <option value="ytd">{REPORT_DATE_LABELS.ytd}</option>
              </select>
              <ChevronDown className="h-4 w-4 text-erp-muted" />
            </div>

            <Button variant="ghost" size="sm" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
