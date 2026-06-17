'use client';

import { useState } from 'react';
import { Plus, Shield, Trash2 } from 'lucide-react';
import { Can } from '@/components/shared/can';
import { PermissionsMatrix } from '@/components/user-management/permissions-matrix';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/providers/auth-store';
import { FormInput, ModuleFormPanel } from '@/components/erp/modules/module-form-panel';
import { required, validateFields } from '@/lib/form-validation';

export function RolesSection() {
  const { roles, addRole, deleteRole, countUsersByRole } = useAuthStore();
  const [selectedId, setSelectedId] = useState(roles[0]?.id ?? '');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: '', description: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const selected = roles.find((r) => r.id === selectedId);

  const handleCreate = async () => {
    const error = validateFields([() => required(form.label, 'Role name')]);
    if (error) {
      setFormError(error);
      return;
    }
    setSaving(true);
    try {
      await addRole({
        label: form.label,
        description: form.description || 'Custom role',
        permissions: ['dashboard.view'],
        color: 'default',
        status: 'active',
      });
      setForm({ label: '', description: '' });
      setFormError('');
      setShowForm(false);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to create role.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2 space-y-3">
        <Can permission="roles.create">
          <Button
            className="w-full gap-2"
            onClick={() => {
              setForm({ label: '', description: '' });
              setFormError('');
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Create Role
          </Button>
        </Can>

        <ModuleFormPanel
          open={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          title="Create Role"
          subtitle="Define a new role and assign permissions later"
          submitLabel={saving ? 'Saving...' : 'Save Role'}
          error={formError}
        >
          <FormInput
            label="Role Name"
            value={form.label}
            onChange={(v) => { setForm((f) => ({ ...f, label: v })); setFormError(''); }}
            placeholder="Role name"
            required
          />
          <FormInput
            label="Description"
            value={form.description}
            onChange={(v) => setForm((f) => ({ ...f, description: v }))}
            placeholder="Description"
          />
        </ModuleFormPanel>

        <div className="space-y-2">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelectedId(role.id)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                selectedId === role.id
                  ? 'border-erp-accent/40 bg-erp-accent/10'
                  : 'border-erp-border bg-erp-card/40 hover:border-erp-accent/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-erp-text">{role.label}</p>
                  <p className="mt-1 text-xs text-erp-muted">{role.description}</p>
                </div>
                {role.isSystem && <Badge variant="muted">System</Badge>}
              </div>
              <p className="mt-2 text-xs text-erp-muted">
                {countUsersByRole(role.name)} users · {role.permissions.length} permissions
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3">
        {selected ? (
          <div className="erp-glass rounded-xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-erp-accent" />
                <h3 className="font-display text-lg font-semibold text-erp-text">{selected.label}</h3>
              </div>
              <Can permission="roles.delete">
                {!selected.isSystem && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-erp-danger"
                    onClick={async () => {
                      try {
                        const ok = await deleteRole(selected.id);
                        if (!ok) alert('Cannot delete role with assigned users or system roles.');
                      } catch (e) {
                        alert(e instanceof Error ? e.message : 'Failed to delete role.');
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </Can>
            </div>
            <PermissionsMatrix selected={selected.permissions} onChange={() => {}} readOnly />
            <p className="mt-3 text-xs text-erp-muted">
              Edit permissions in the Permissions tab (super admin only).
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
