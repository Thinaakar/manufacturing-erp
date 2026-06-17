import { AppShell } from '@/components/erp/shell/app-shell';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function ErpLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
