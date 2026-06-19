'use client';

import { useState } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { Can } from '@/components/shared/can';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/erp/modules/data-table';
import { GenericRecordForm } from '@/components/erp/modules/generic-record-form';
import { FormInput, FormSelect, ModuleFormPanel } from '@/components/erp/modules/module-form-panel';
import { ModuleHeader, ModuleTabs } from '@/components/erp/modules/module-primitives';
import { RecordDetailPanel } from '@/components/erp/modules/record-detail-panel';
import { StatusBadge } from '@/components/erp/modules/status-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTransition } from '@/components/ui/motion';
import { useManagedTable } from '@/hooks/use-managed-table';
import { inventoryModule } from '@/lib/data/manufacturing-mock';
import { positiveNumber, required, validateFields } from '@/lib/form-validation';
import { cn } from '@/lib/utils';

type RawMaterial = (typeof inventoryModule.rawMaterials)[number];
type FinishedGood = (typeof inventoryModule.finishedGoods)[number];

const RAW_LABELS: Record<string, string> = {
  sku: 'SKU',
  item: 'Item',
  qty: 'Quantity',
  unit: 'Unit',
  warehouse: 'Warehouse',
  status: 'Status',
};

const FINISHED_LABELS: Record<string, string> = {
  sku: 'SKU',
  item: 'Item',
  qty: 'Quantity',
  unit: 'Unit',
  warehouse: 'Warehouse',
  status: 'Status',
};

const EMPTY_STOCK: {
  item: string;
  sku: string;
  qty: string;
  unit: string;
  warehouse: string;
  status: RawMaterial['status'];
} = {
  item: '',
  sku: '',
  qty: '',
  unit: 'units',
  warehouse: 'WH-A',
  status: 'Normal',
};

function nextSku(existing: RawMaterial[]): string {
  const nums = existing
    .map((r) => {
      const match = r.sku.match(/(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !Number.isNaN(n));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `RM-NEW-${String(next).padStart(3, '0')}`;
}

export function InventoryView() {
  const data = inventoryModule;
  const [tab, setTab] = useState('raw');
  const [showForm, setShowForm] = useState(false);
  const [editingSku, setEditingSku] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_STOCK);
  const [formError, setFormError] = useState('');

  const rawTable = useManagedTable<RawMaterial>(data.rawMaterials, (r) => r.sku, RAW_LABELS, {
    onEdit: (row) => {
      setEditingSku(row.sku);
      setForm({
        item: row.item,
        sku: row.sku,
        qty: String(row.qty),
        unit: row.unit,
        warehouse: row.warehouse,
        status: row.status,
      });
      setShowForm(true);
      setTab('raw');
    },
  });
  const finishedTable = useManagedTable<FinishedGood>(data.finishedGoods, (r) => r.sku, FINISHED_LABELS);

  const openForm = () => {
    setEditingSku(null);
    setForm(EMPTY_STOCK);
    setFormError('');
    setTab('raw');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSku(null);
    setForm(EMPTY_STOCK);
    setFormError('');
  };

  const handleSave = () => {
    const error = validateFields([
      () => required(form.item, 'Item name'),
      () => positiveNumber(form.qty, 'Quantity'),
    ]);
    if (error) {
      setFormError(error);
      return;
    }
    const qty = parseInt(form.qty, 10);
    if (editingSku) {
      rawTable.setRecords((prev) =>
        prev.map((r) =>
          r.sku === editingSku
            ? { sku: form.sku || r.sku, item: form.item, qty, unit: form.unit, warehouse: form.warehouse, status: form.status }
            : r,
        ),
      );
    } else {
      rawTable.setRecords((prev) => [
        { sku: form.sku || nextSku(prev), item: form.item, qty, unit: form.unit, warehouse: form.warehouse, status: form.status },
        ...prev,
      ]);
    }
    closeForm();
  };

  return (
    <PageTransition className="space-y-6">
      <ModuleHeader
        badge={data.header.badge}
        title={data.header.title}
        subtitle={data.header.subtitle}
        description={data.header.description}
        action={
          <Can permission="inventory.edit">
            <Button className="gap-2" onClick={openForm}>
              <Plus className="h-4 w-4" />
              Add Stock Item
            </Button>
          </Can>
        }
      />
      <ModuleFormPanel open={showForm} onClose={closeForm} onSubmit={handleSave} title={editingSku ? 'Edit Stock Item' : 'Add Stock Item'} subtitle={editingSku ? 'Update stock item details' : 'Add a new item to inventory'} submitLabel={editingSku ? 'Save Changes' : 'Add Item'} error={formError}>
        <FormInput label="Item Name" value={form.item} onChange={(v) => { setForm((f) => ({ ...f, item: v })); setFormError(''); }} placeholder="e.g. Steel Alloy 304" required />
        <FormInput label="SKU" value={form.sku} onChange={(v) => setForm((f) => ({ ...f, sku: v }))} placeholder="Auto-generated if empty" />
        <FormInput label="Quantity" value={form.qty} onChange={(v) => { setForm((f) => ({ ...f, qty: v })); setFormError(''); }} placeholder="e.g. 500" type="number" required />
        <FormSelect label="Unit" value={form.unit} onChange={(v) => setForm((f) => ({ ...f, unit: v }))} options={[{ value: 'units', label: 'Units' }, { value: 'kg', label: 'Kilograms' }, { value: 'L', label: 'Liters' }, { value: 'sheets', label: 'Sheets' }]} />
        <FormSelect label="Warehouse" value={form.warehouse} onChange={(v) => setForm((f) => ({ ...f, warehouse: v }))} options={[{ value: 'WH-A', label: 'WH-A — Raw Materials Hub' }, { value: 'WH-B', label: 'WH-B — Component Storage' }, { value: 'WH-C', label: 'WH-C — Finished Goods' }, { value: 'WH-D', label: 'WH-D — Distribution Buffer' }]} />
        <FormSelect label="Status" value={form.status} onChange={(v) => setForm((f) => ({ ...f, status: v as RawMaterial['status'] }))} options={[{ value: 'Normal', label: 'Normal' }, { value: 'Warning', label: 'Warning' }, { value: 'Critical', label: 'Critical' }, { value: 'High', label: 'High' }]} />
      </ModuleFormPanel>

      <RecordDetailPanel open={!!rawTable.viewRecord} title="Raw Material" fields={rawTable.detailFields} onClose={() => rawTable.setViewRecord(null)} />
      <RecordDetailPanel open={!!finishedTable.viewRecord} title="Finished Good" fields={finishedTable.detailFields} onClose={() => finishedTable.setViewRecord(null)} />
      <GenericRecordForm open={!!finishedTable.editRecord} record={finishedTable.editRecord} labels={FINISHED_LABELS} onClose={() => finishedTable.setEditRecord(null)} onSave={finishedTable.saveEdit} readOnlyKeys={['sku']} requiredKeys={['item', 'qty', 'warehouse']} numericKeys={['qty']} />

      <div className="erp-glass rounded-2xl p-1">
        <ModuleTabs
          tabs={[
            { id: 'raw', label: 'Raw Materials' },
            { id: 'finished', label: 'Finished Goods' },
            { id: 'warehouses', label: 'Warehouses' },
            { id: 'monitoring', label: 'Stock Monitoring' },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="p-4">
          {tab === 'raw' && (
            <DataTable
              columns={[
                { key: 'sku', header: 'SKU', mono: true },
                { key: 'item', header: 'Item' },
                { key: 'qty', header: 'Qty', mono: true },
                { key: 'unit', header: 'Unit' },
                { key: 'warehouse', header: 'Warehouse', mono: true },
                { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              ]}
              data={rawTable.records}
              rowKey={(r) => r.sku}
              rowActions={rawTable.rowActions}
            />
          )}

          {tab === 'finished' && (
            <DataTable
              columns={[
                { key: 'sku', header: 'SKU', mono: true },
                { key: 'item', header: 'Item' },
                { key: 'qty', header: 'Qty', mono: true },
                { key: 'unit', header: 'Unit' },
                { key: 'warehouse', header: 'Warehouse', mono: true },
                { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              ]}
              data={finishedTable.records}
              rowKey={(r) => r.sku}
              rowActions={finishedTable.rowActions}
            />
          )}

          {tab === 'warehouses' && (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.warehouses.map((wh) => (
                <Card key={wh.id} className="erp-glass-hover">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{wh.name}</CardTitle>
                        <p className="text-xs text-erp-muted">{wh.location}</p>
                      </div>
                      <Badge variant="muted">{wh.id}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-erp-muted">Capacity</span>
                      <span className="font-semibold">{wh.capacity}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-erp-bg">
                      <div className={cn('h-full rounded-full', wh.capacity >= 80 ? 'bg-erp-warning' : 'bg-erp-accent')} style={{ width: `${wh.capacity}%` }} />
                    </div>
                    <p className="mt-3 text-xs text-erp-muted">{wh.items.toLocaleString()} items stored</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tab === 'monitoring' && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {data.stockTrend.slice(-4).map((week) => (
                  <div key={week.week} className="erp-glass rounded-xl p-4">
                    <p className="erp-label mb-2">{week.week}</p>
                    <p className="text-sm text-erp-muted">
                      Raw: <span className="font-semibold text-erp-text">{week.raw.toLocaleString()}</span>
                    </p>
                    <p className="text-sm text-erp-muted">
                      Finished: <span className="font-semibold text-erp-text">{week.finished.toLocaleString()}</span>
                    </p>
                  </div>
                ))}
              </div>
              <Card className="border-erp-warning/30 bg-erp-warning/5">
                <CardContent className="flex items-center gap-3 p-4">
                  <AlertTriangle className="h-5 w-5 text-erp-warning" />
                  <p className="text-sm text-erp-text">
                    2 raw material SKUs below reorder threshold — review Raw Materials tab to place orders.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
