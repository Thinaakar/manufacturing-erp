import { redirect } from 'next/navigation';

export default function InventoryPage() {
  redirect('/supply-chain?tab=inventory');
}
