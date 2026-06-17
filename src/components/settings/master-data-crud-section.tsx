'use client';

import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { DataTable, type DataColumn } from '@/components/erp/modules/data-table';
import { RecordDetailPanel } from '@/components/erp/modules/record-detail-panel';
import { StatusBadge } from '@/components/erp/modules/status-badge';
import { Button } from '@/components/ui/button';
import { FormInput, FormSelect, ModuleFormPanel } from '@/components/erp/modules/module-form-panel';
import { required, validateFields } from '@/lib/form-validation';
import type { MasterDataCollection } from '@/lib/data/master-data';
import { useMasterDataStore } from '@/providers/master-data-store';

type FieldType = 'text' | 'number' | 'select' | 'status';

export type MasterFieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  readOnlyOnEdit?: boolean;
};

type MasterDataCrudSectionProps<T extends { id: string; status?: string }> = {
  title: string;
  subtitle?: string;
  collection: MasterDataCollection;
  records: T[];
  columns: DataColumn<T>[];
  fields: MasterFieldConfig[];
  detailLabels: Record<string, string>;
  createPermission?: string;
  emptyForm: Record<string, string>;
  mapFormToRecord: (form: Record<string, string>) => Omit<T, 'id'>;
  mapRecordToForm: (record: T) => Record<string, string>;
};

export function MasterDataCrudSection<T extends { id: string; status?: string }>({
  title,
  subtitle,
  collection,
  records,
  columns,
  fields,
  detailLabels,
  emptyForm,
  mapFormToRecord,
  mapRecordToForm,
}: MasterDataCrudSectionProps<T>) {
  const { addRecord, updateRecord, deleteRecord } = useMasterDataStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewRecord, setViewRecord] = useState<T | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return records;
    return records.filter((row) =>
      Object.values(row as object).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [records, search]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (row: T) => {
    setEditingId(row.id);
    setForm(mapRecordToForm(row));
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSave = async () => {
    const validators = fields
      .filter((f) => f.required && f.type !== 'status')
      .map((f) => () => required(form[f.key], f.label));

    const error = validateFields(validators);
    if (error) {
      setFormError(error);
      return;
    }

    const payload = mapFormToRecord(form);
    setSaving(true);
    setFormError('');

    try {
      if (editingId) {
        await updateRecord(collection, editingId, payload as Record<string, unknown>);
      } else {
        await addRecord(collection, payload as Record<string, unknown>);
      }
      closeForm();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save record.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: T) => {
    if (!window.confirm(`Delete this ${title.replace(/s$/, '').toLowerCase()}?`)) return;
    try {
      await deleteRecord(collection, row.id);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Failed to delete record.');
    }
  };

  const detailFields = viewRecord
    ? Object.entries(detailLabels).map(([key, label]) => ({
        label,
        value: String((viewRecord as Record<string, unknown>)[key] ?? '—'),
      }))
    : [];

  const statusColumn: DataColumn<T> = {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status ?? 'active'} />,
  };

  const tableColumns = columns.some((c) => c.key === 'status')
    ? columns
    : [...columns, statusColumn];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-erp-text">{title}</h3>
          {subtitle && <p className="text-sm text-erp-muted">{subtitle}</p>}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-erp-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="erp-input pl-10"
            />
          </div>
          <Button className="gap-2 shrink-0" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      <DataTable
        columns={tableColumns}
        data={filtered}
        rowKey={(r) => r.id}
        rowActions={{
          onView: setViewRecord,
          onEdit: openEdit,
          onDelete: handleDelete,
        }}
      />

      <ModuleFormPanel
        open={showForm}
        onClose={closeForm}
        onSubmit={handleSave}
        title={editingId ? `Edit ${title.replace(/s$/, '')}` : `New ${title.replace(/s$/, '')}`}
        submitLabel={saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create'}
        error={formError}
      >
        {fields.map((field) => {
          if (field.type === 'select') {
            return (
              <FormSelect
                key={field.key}
                label={field.label}
                value={form[field.key] ?? ''}
                onChange={(v) => {
                  setForm((f) => ({ ...f, [field.key]: v }));
                  setFormError('');
                }}
                options={field.options ?? []}
                required={field.required}
              />
            );
          }
          if (field.type === 'status') {
            return (
              <FormSelect
                key={field.key}
                label={field.label}
                value={form[field.key] ?? 'active'}
                onChange={(v) => setForm((f) => ({ ...f, [field.key]: v }))}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
              />
            );
          }
          return (
            <FormInput
              key={field.key}
              label={field.label}
              type={field.type === 'number' ? 'number' : 'text'}
              value={form[field.key] ?? ''}
              onChange={(v) => {
                setForm((f) => ({ ...f, [field.key]: v }));
                setFormError('');
              }}
              placeholder={field.placeholder}
              required={field.required}
            />
          );
        })}
      </ModuleFormPanel>

      <RecordDetailPanel
        open={!!viewRecord}
        title={title.replace(/s$/, '')}
        fields={detailFields}
        onClose={() => setViewRecord(null)}
      />
    </div>
  );
}
