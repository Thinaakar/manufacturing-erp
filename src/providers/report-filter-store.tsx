'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  DEFAULT_REPORT_FILTERS,
  type AppliedReportFilters,
  type ReportDateRange,
  type ReportPlant,
} from '@/lib/report-filter-utils';

type ReportFilterContextValue = {
  draftPlant: ReportPlant;
  draftDateRange: ReportDateRange;
  appliedFilters: AppliedReportFilters;
  filterVersion: number;
  setDraftPlant: (plant: ReportPlant) => void;
  setDraftDateRange: (dateRange: ReportDateRange) => void;
  applyFilters: () => void;
};

const ReportFilterContext = createContext<ReportFilterContextValue | null>(null);

export function ReportFilterProvider({ children }: { children: React.ReactNode }) {
  const [draftPlant, setDraftPlant] = useState<ReportPlant>(DEFAULT_REPORT_FILTERS.plant);
  const [draftDateRange, setDraftDateRange] = useState<ReportDateRange>(DEFAULT_REPORT_FILTERS.dateRange);
  const [appliedFilters, setAppliedFilters] = useState<AppliedReportFilters>(DEFAULT_REPORT_FILTERS);
  const [filterVersion, setFilterVersion] = useState(0);

  const applyFilters = useCallback(() => {
    setAppliedFilters({ plant: draftPlant, dateRange: draftDateRange });
    setFilterVersion((v) => v + 1);
  }, [draftPlant, draftDateRange]);

  const value = useMemo(
    () => ({
      draftPlant,
      draftDateRange,
      appliedFilters,
      filterVersion,
      setDraftPlant,
      setDraftDateRange,
      applyFilters,
    }),
    [draftPlant, draftDateRange, appliedFilters, filterVersion, applyFilters],
  );

  return <ReportFilterContext.Provider value={value}>{children}</ReportFilterContext.Provider>;
}

export function useReportFilters() {
  const ctx = useContext(ReportFilterContext);
  if (!ctx) throw new Error('useReportFilters must be used within ReportFilterProvider');
  return ctx;
}
