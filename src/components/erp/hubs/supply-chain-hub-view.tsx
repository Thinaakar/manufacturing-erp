'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { InventoryView } from '@/components/erp/modules/inventory-view';
import { ModuleTabs } from '@/components/erp/modules/module-primitives';
import { PurchasingView } from '@/components/erp/modules/purchasing-view';
import { SalesView } from '@/components/erp/modules/sales-view';
import { getHubTabs, resolveHubTab } from '@/lib/navigation';
import { useAuthStore } from '@/providers/auth-store';

export function SupplyChainHubView() {
  const { currentUser } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const visibleTabs = useMemo(
    () => getHubTabs('/supply-chain', currentUser),
    [currentUser],
  );

  const tabParam = searchParams.get('tab');
  const activeTab = resolveHubTab('/supply-chain', tabParam, currentUser);

  useEffect(() => {
    if (visibleTabs.length && tabParam !== activeTab) {
      router.replace(`/supply-chain?tab=${activeTab}`);
    }
  }, [tabParam, activeTab, visibleTabs.length, router]);

  if (!visibleTabs.length) return null;

  return (
    <div className="space-y-6">
      <div className="erp-glass rounded-2xl p-1">
        <ModuleTabs
          tabs={visibleTabs}
          active={activeTab}
          onChange={(id) => router.push(`/supply-chain?tab=${id}`)}
        />
      </div>
      {activeTab === 'inventory' && <InventoryView />}
      {activeTab === 'purchasing' && <PurchasingView />}
      {activeTab === 'sales' && <SalesView />}
    </div>
  );
}
