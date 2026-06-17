import {
  inventorySummary as inventorySummaryBase,
  performanceSummary as performanceSummaryBase,
  productionSummary as productionSummaryBase,
  reportAnalytics as reportAnalyticsBase,
  reportInventoryChart as reportInventoryChartBase,
  reportProductionChart as reportProductionChartBase,
  reportRevenueChart as reportRevenueChartBase,
  revenueAnalysis as revenueAnalysisBase,
} from '@/lib/data/manufacturing-mock';

export type ReportPlant = 'all' | 'plant01' | 'plant02';
export type ReportDateRange = '6m' | '30d' | 'quarter' | 'ytd';

export type AppliedReportFilters = {
  plant: ReportPlant;
  dateRange: ReportDateRange;
};

export const DEFAULT_REPORT_FILTERS: AppliedReportFilters = {
  plant: 'all',
  dateRange: '6m',
};

export const REPORT_PLANT_LABELS: Record<ReportPlant, string> = {
  all: 'All Plants',
  plant01: 'Plant 01 — Apex Precision',
  plant02: 'Plant 02 — North Valley',
};

export const REPORT_DATE_LABELS: Record<ReportDateRange, string> = {
  '6m': 'Last 6 Months',
  '30d': 'Last 30 Days',
  quarter: 'Last Quarter',
  ytd: 'Year to Date',
};

function getMonthCount(dateRange: ReportDateRange) {
  switch (dateRange) {
    case '30d':
      return 1;
    case 'quarter':
      return 3;
    case 'ytd':
    case '6m':
    default:
      return 6;
  }
}

function getPlantFactor(plant: ReportPlant) {
  switch (plant) {
    case 'plant01':
      return 1;
    case 'plant02':
      return 0.79;
    case 'all':
    default:
      return 1.58;
  }
}

function sliceByRange<T>(items: T[], dateRange: ReportDateRange) {
  return items.slice(-getMonthCount(dateRange));
}

function scaleNumber(value: number, factor: number, decimals = 0) {
  const scaled = value * factor;
  return decimals > 0 ? Number(scaled.toFixed(decimals)) : Math.round(scaled);
}

export function getFilteredReportAnalytics(filters: AppliedReportFilters) {
  const factor = getPlantFactor(filters.plant);
  const rangeFactor = getMonthCount(filters.dateRange) / 6;

  return reportAnalyticsBase.map((item) => ({
    ...item,
    value:
      item.unit === 'units'
        ? scaleNumber(item.value * rangeFactor, factor)
        : scaleNumber(item.value * rangeFactor, factor, item.unit === '$M' || item.unit === '%' ? 1 : 0),
    change: Number((item.change * (filters.plant === 'plant02' ? 0.85 : filters.plant === 'all' ? 1.1 : 1)).toFixed(1)),
  }));
}

export function getFilteredProductionChart(filters: AppliedReportFilters) {
  const factor = getPlantFactor(filters.plant);
  return sliceByRange(reportProductionChartBase, filters.dateRange).map((row) => ({
    ...row,
    actual: scaleNumber(row.actual, factor),
    planned: scaleNumber(row.planned, factor),
    efficiency: Number((row.efficiency * (filters.plant === 'plant02' ? 0.96 : 1)).toFixed(1)),
  }));
}

export function getFilteredRevenueChart(filters: AppliedReportFilters) {
  const factor = getPlantFactor(filters.plant);
  return sliceByRange(reportRevenueChartBase, filters.dateRange).map((row) => ({
    ...row,
    gross: scaleNumber(row.gross, factor, 1),
    net: scaleNumber(row.net, factor, 1),
    margin: Number((row.margin * (filters.plant === 'plant02' ? 0.97 : 1)).toFixed(1)),
  }));
}

export function getFilteredFinancialOverview(filters: AppliedReportFilters) {
  const factor = getPlantFactor(filters.plant);
  return sliceByRange(revenueAnalysisBase, filters.dateRange).map((row) => ({
    ...row,
    revenue: scaleNumber(row.revenue, factor, 1),
    cost: scaleNumber(row.cost, factor, 1),
  }));
}

export function getFilteredInventoryChart(filters: AppliedReportFilters) {
  const shift = filters.plant === 'plant02' ? -4 : filters.plant === 'all' ? 2 : 0;
  return reportInventoryChartBase.map((row, index) => {
    const adjusted = Math.max(5, Math.min(55, row.value + shift + (index === 0 ? 2 : 0)));
    return { ...row, value: adjusted };
  });
}

export function getFilteredProductionSummary(filters: AppliedReportFilters) {
  const factor = getPlantFactor(filters.plant);
  return productionSummaryBase.map((row) => ({
    ...row,
    planned: scaleNumber(row.planned, factor),
    actual: scaleNumber(row.actual, factor),
    variance: Number((row.variance * (filters.plant === 'plant02' ? 0.9 : 1)).toFixed(1)),
    efficiency: Number((row.efficiency * (filters.plant === 'plant02' ? 0.97 : 1)).toFixed(1)),
  }));
}

export function getFilteredInventorySummary(filters: AppliedReportFilters) {
  const prefix = filters.plant === 'plant02' ? 0.79 : filters.plant === 'all' ? 1.58 : 1;
  return inventorySummaryBase.map((row) => {
    const numeric = parseFloat(row.value.replace(/[$M]/g, ''));
    return {
      ...row,
      value: `$${(numeric * prefix).toFixed(2)}M`,
    };
  });
}

export function getFilteredPerformanceSummary(filters: AppliedReportFilters) {
  if (filters.plant === 'all' && filters.dateRange === '6m') {
    return performanceSummaryBase;
  }

  return performanceSummaryBase.map((row) => {
    if (filters.plant === 'plant02' && row.metric === 'On-Time Delivery') {
      return { ...row, value: '91.2%', status: 'Below Target' };
    }
    if (filters.dateRange === '30d' && row.metric === 'Overall Equipment Effectiveness') {
      return { ...row, value: '84.1%', status: 'Below Target' };
    }
    return row;
  });
}
