import { redirect } from 'next/navigation';

export default function SalesPage() {
  redirect('/supply-chain?tab=sales');
}
