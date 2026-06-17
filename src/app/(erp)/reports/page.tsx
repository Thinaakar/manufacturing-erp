import { ExportSection } from '@/components/erp/reports/export-section';
import { ReportAnalyticsCards } from '@/components/erp/reports/report-analytics';
import { ReportCharts } from '@/components/erp/reports/report-charts';
import { ReportFinancialOverview } from '@/components/erp/reports/report-financial-overview';
import { ReportFilters } from '@/components/erp/reports/report-filters';
import { ReportTables } from '@/components/erp/reports/report-tables';
import { PageTransition } from '@/components/ui/motion';
import { ReportFilterProvider } from '@/providers/report-filter-store';

export const dynamic = 'force-dynamic';

export default function ReportsPage() {
  return (
    <ReportFilterProvider>
      <PageTransition className="erp-page-shell">
        <ReportFilters />
        <ReportAnalyticsCards />
        <ReportFinancialOverview />
        <ReportCharts />
        <ReportTables />
        <ExportSection />
      </PageTransition>
    </ReportFilterProvider>
  );
}
