'use client';

import { useMemo, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Can } from '@/components/shared/can';
import { StatusBadge } from '@/components/erp/modules/status-badge';
import { Button } from '@/components/ui/button';
import { FormInput, FormSelect, ModuleFormPanel } from '@/components/erp/modules/module-form-panel';
import { useAuthStore } from '@/providers/auth-store';
import { required, validateFields } from '@/lib/form-validation';

export function UsersSection() {
  const { users, roles, addUser, updateUser, deleteUser } = useAuthStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'operator', department: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.includes(q),
    );
  }, [users, search]);

  const roleLabel = (name: string) => roles.find((r) => r.name === name)?.label ?? name;

  const handleCreate = async () => {
    setFormError('');
    const error = validateFields([
      () => required(form.name, 'Name'),
      () => required(form.email, 'Email'),
      () => required(form.password, 'Password'),
      () => (form.password.length < 6 ? 'Password must be at least 6 characters.' : null),
    ]);
    if (error) {
      setFormError(error);
      return;
    }

    setSaving(true);
    try {
      await addUser(
        {
          name: form.name,
          email: form.email,
          role: form.role,
          status: 'active',
          avatar: form.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          department: form.department || 'General',
        },
        form.password,
      );
      setForm({ name: '', email: '', password: '', role: 'operator', department: '' });
      setShowForm(false);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to create user.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-erp-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="erp-input pl-10"
          />
        </div>
        <Can permission="users.create">
          <Button
            className="gap-2"
            onClick={() => {
              setForm({ name: '', email: '', password: '', role: 'operator', department: '' });
              setFormError('');
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </Can>
      </div>

      <ModuleFormPanel
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
        title="Add User"
        subtitle="Create a new account with email and password login"
        submitLabel={saving ? 'Saving...' : 'Save User'}
        error={formError}
      >
        <FormInput
          label="Full Name"
          value={form.name}
          onChange={(v) => { setForm((f) => ({ ...f, name: v })); setFormError(''); }}
          placeholder="Full name"
          required
        />
        <FormInput
          label="Email"
          value={form.email}
          onChange={(v) => { setForm((f) => ({ ...f, email: v })); setFormError(''); }}
          placeholder="Email"
          type="email"
          required
        />
        <FormInput
          label="Password"
          value={form.password}
          onChange={(v) => { setForm((f) => ({ ...f, password: v })); setFormError(''); }}
          placeholder="Min 6 characters"
          type="password"
          required
        />
        <FormSelect
          label="Role"
          value={form.role}
          onChange={(v) => setForm((f) => ({ ...f, role: v }))}
          options={roles.map((r) => ({ value: r.name, label: r.label }))}
        />
        <FormInput
          label="Department"
          value={form.department}
          onChange={(v) => setForm((f) => ({ ...f, department: v }))}
          placeholder="Department"
          className="sm:col-span-2"
        />
      </ModuleFormPanel>

      <div className="overflow-x-auto rounded-xl border border-erp-border">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-erp-border bg-erp-bg/40">
              <th className="erp-table-head">User</th>
              <th className="erp-table-head">Email</th>
              <th className="erp-table-head">Role</th>
              <th className="erp-table-head">Department</th>
              <th className="erp-table-head">Status</th>
              <th className="erp-table-head" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-erp-border/50 hover:bg-erp-accent/5">
                <td className="erp-table-cell">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-erp-accent/15 text-xs font-bold text-erp-accent">
                      {user.avatar}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="erp-table-cell text-erp-muted">{user.email}</td>
                <td className="erp-table-cell">{roleLabel(user.role)}</td>
                <td className="erp-table-cell text-erp-muted">{user.department}</td>
                <td className="erp-table-cell">
                  <Can permission="users.edit">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await updateUser(user.id, {
                            status: user.status === 'active' ? 'inactive' : 'active',
                          });
                        } catch (e) {
                          window.alert(e instanceof Error ? e.message : 'Failed to update user.');
                        }
                      }}
                    >
                      <StatusBadge status={user.status === 'active' ? 'Active' : 'Inactive'} />
                    </button>
                  </Can>
                </td>
                <td className="erp-table-cell text-right">
                  <Can permission="users.delete">
                    {user.id !== 'USR-DEMO' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-erp-danger"
                        onClick={async () => {
                          try {
                            await deleteUser(user.id);
                          } catch (e) {
                            window.alert(e instanceof Error ? e.message : 'Failed to delete user.');
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </Can>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
