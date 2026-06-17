'use client';

import { useState } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import { PermissionsMatrix } from '@/components/user-management/permissions-matrix';
import { Button } from '@/components/ui/button';
import { canManageRolesAndPermissions } from '@/lib/permissions';
import { useAuthStore } from '@/providers/auth-store';

export function PermissionsSection() {
  const { roles, updateRolePermissions, currentUser } = useAuthStore();
  const editableRoles = roles.filter((r) => r.name !== 'super_admin');
  const [selectedId, setSelectedId] = useState(editableRoles[0]?.id ?? '');
  const [draft, setDraft] = useState<string[]>(editableRoles[0]?.permissions ?? []);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const selected = editableRoles.find((r) => r.id === selectedId);
  const canEdit = canManageRolesAndPermissions(currentUser);

  const selectRole = (id: string) => {
    const role = editableRoles.find((r) => r.id === id);
    setSelectedId(id);
    setDraft(role?.permissions ?? []);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!selectedId || !canEdit) return;
    setSaving(true);
    try {
      await updateRolePermissions(selectedId, draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Failed to save permissions.');
    } finally {
      setSaving(false);
    }
  };

  if (!canEdit) {
    return (
      <div className="erp-glass rounded-xl p-8 text-center">
        <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-erp-muted" />
        <p className="font-medium text-erp-text">Super Admin access required</p>
        <p className="mt-1 text-sm text-erp-muted">
          Only super admins can assign permissions to roles.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2 space-y-2">
        <p className="erp-label mb-2">Select Role</p>
        {editableRoles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => selectRole(role.id)}
            className={`w-full rounded-xl border p-3 text-left text-sm transition-all ${
              selectedId === role.id
                ? 'border-erp-accent/40 bg-erp-accent/10 text-erp-accent'
                : 'border-erp-border text-erp-text hover:border-erp-accent/20'
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>

      <div className="lg:col-span-3">
        {selected && (
          <div className="erp-glass rounded-xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-erp-text">
                  {selected.label} Permissions
                </h3>
                <p className="text-sm text-erp-muted">{selected.description}</p>
              </div>
              <Button className="gap-2" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
              </Button>
            </div>
            <PermissionsMatrix selected={draft} onChange={setDraft} />
          </div>
        )}
      </div>
    </div>
  );
}
