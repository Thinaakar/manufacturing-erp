import { redirect } from 'next/navigation';

export default function QualityPage() {
  redirect('/operations?tab=quality');
}
