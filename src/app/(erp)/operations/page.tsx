import { Suspense } from 'react';
import { OperationsHubView } from '@/components/erp/hubs/operations-hub-view';

export const dynamic = 'force-dynamic';

export default function OperationsPage() {
  return (
    <Suspense fallback={null}>
      <OperationsHubView />
    </Suspense>
  );
}
