'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MaintenanceView } from '@/components/erp/modules/maintenance-view';
import { ModuleTabs } from '@/components/erp/modules/module-primitives';
import { ProductionView } from '@/components/erp/modules/production-view';
import { QualityView } from '@/components/erp/modules/quality-view';
import { getHubTabs, resolveHubTab } from '@/lib/navigation';
import { useAuthStore } from '@/providers/auth-store';

export function OperationsHubView() {
  const { currentUser } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const visibleTabs = useMemo(
    () => getHubTabs('/operations', currentUser),
    [currentUser],
  );

  const tabParam = searchParams.get('tab');
  const activeTab = resolveHubTab('/operations', tabParam, currentUser);

  useEffect(() => {
    if (visibleTabs.length && tabParam !== activeTab) {
      router.replace(`/operations?tab=${activeTab}`);
    }
  }, [tabParam, activeTab, visibleTabs.length, router]);

  if (!visibleTabs.length) return null;

  return (
    <div className="space-y-6">
      <div className="erp-glass rounded-2xl p-1">
        <ModuleTabs
          tabs={visibleTabs}
          active={activeTab}
          onChange={(id) => router.push(`/operations?tab=${id}`)}
        />
      </div>
      {activeTab === 'production' && <ProductionView />}
      {activeTab === 'maintenance' && <MaintenanceView />}
      {activeTab === 'quality' && <QualityView />}
    </div>
  );
}
