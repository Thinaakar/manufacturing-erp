import { Sidebar } from '@/components/erp/shell/sidebar';
import { TopNav } from '@/components/erp/shell/top-nav';
import { AppShellMain } from '@/components/erp/shell/app-shell-main';
import { SidebarProvider } from '@/providers/sidebar-store';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-erp-bg">
        <Sidebar />
        <AppShellMain>
          <TopNav />
          <main className="px-6 py-8 lg:px-10 lg:py-10">{children}</main>
        </AppShellMain>
      </div>
    </SidebarProvider>
  );
}
