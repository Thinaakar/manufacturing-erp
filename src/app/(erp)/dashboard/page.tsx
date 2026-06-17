import { AnalyticsSection } from '@/components/erp/dashboard/analytics-section';
import { DashboardHero } from '@/components/erp/dashboard/dashboard-hero';
import { DashboardTables } from '@/components/erp/dashboard/dashboard-tables';
import { KpiCards } from '@/components/erp/dashboard/kpi-cards';
import { PageTransition } from '@/components/ui/motion';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <PageTransition className="erp-page-shell">
      <DashboardHero />
      <KpiCards />
      <AnalyticsSection />
      <DashboardTables />
    </PageTransition>
  );
}
