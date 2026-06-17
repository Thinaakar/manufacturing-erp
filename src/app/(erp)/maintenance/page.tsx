import { redirect } from 'next/navigation';

export default function MaintenancePage() {
  redirect('/operations?tab=maintenance');
}
