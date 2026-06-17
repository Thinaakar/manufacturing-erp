'use client';

import { useState } from 'react';
import { ModuleHeader, ModuleTabs } from '@/components/erp/modules/module-primitives';
import { CompanySettingsSection } from '@/components/settings/company-settings-section';
import { MasterDataPanel } from '@/components/settings/master-data-panel';
import { PermissionsSection } from '@/components/user-management/permissions-section';
import { RolesSection } from '@/components/user-management/roles-section';
import { UsersSection } from '@/components/user-management/users-section';
import { Can } from '@/components/shared/can';
import { PageTransition } from '@/components/ui/motion';
import { settingsModule } from '@/lib/data/manufacturing-mock';
import { useAuthStore } from '@/providers/auth-store';

export function SettingsView() {
  const { users, roles } = useAuthStore();
  const [tab, setTab] = useState('users');

  return (
    <PageTransition className="space-y-6">
      <ModuleHeader
        badge={settingsModule.header.badge}
        title={settingsModule.header.title}
        subtitle={settingsModule.header.subtitle}
        description={settingsModule.header.description}
      />

      <div className="erp-glass rounded-2xl p-1">
        <ModuleTabs
          tabs={[
            { id: 'users', label: 'Users', count: users.length },
            { id: 'roles', label: 'Roles', count: roles.length },
            { id: 'permissions', label: 'Permissions' },
            { id: 'company', label: 'Company' },
            { id: 'master', label: 'Master Data' },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="p-4">
          {tab === 'users' && (
            <Can permission="users.view" fallback={<AccessDenied message="You cannot view users." />}>
              <UsersSection />
            </Can>
          )}
          {tab === 'roles' && (
            <Can permission="roles.view" fallback={<AccessDenied message="You cannot view roles." />}>
              <RolesSection />
            </Can>
          )}
          {tab === 'permissions' && (
            <Can permission="permissions.view" fallback={<AccessDenied message="You cannot view permissions." />}>
              <PermissionsSection />
            </Can>
          )}
          {tab === 'company' && (
            <Can permission="settings.view" fallback={<AccessDenied message="You cannot view settings." />}>
              <CompanySettingsSection />
            </Can>
          )}
          {tab === 'master' && (
            <Can permission="settings.view" fallback={<AccessDenied message="You cannot view master data." />}>
              <MasterDataPanel />
            </Can>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

function AccessDenied({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-erp-border bg-erp-bg/40 p-8 text-center text-sm text-erp-muted">
      {message}
    </div>
  );
}
