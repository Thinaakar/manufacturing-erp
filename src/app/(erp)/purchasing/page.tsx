import { redirect } from 'next/navigation';

export default function PurchasingPage() {
  redirect('/supply-chain?tab=purchasing');
}
