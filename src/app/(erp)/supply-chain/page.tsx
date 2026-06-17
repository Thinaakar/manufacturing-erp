import { Suspense } from 'react';
import { SupplyChainHubView } from '@/components/erp/hubs/supply-chain-hub-view';

export const dynamic = 'force-dynamic';

export default function SupplyChainPage() {
  return (
    <Suspense fallback={null}>
      <SupplyChainHubView />
    </Suspense>
  );
}
