'use client';

import { useState } from 'react';
import { Plus, Star } from 'lucide-react';
import { Can } from '@/components/shared/can';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/erp/modules/data-table';
import { GenericRecordForm } from '@/components/erp/modules/generic-record-form';
import { FormInput, FormSelect, ModuleFormPanel } from '@/components/erp/modules/module-form-panel';
import { ModuleHeader, ModuleTabs } from '@/components/erp/modules/module-primitives';
import { RecordDetailPanel } from '@/components/erp/modules/record-detail-panel';
import { StatusBadge } from '@/components/erp/modules/status-badge';
import { PageTransition } from '@/components/ui/motion';
import { useManagedTable } from '@/hooks/use-managed-table';
import { purchasingModule } from '@/lib/data/manufacturing-mock';
import { daysFromNow, formatCurrency, nextRecordId, stripCurrency } from '@/lib/module-utils';
import { positiveNumber, required, validateFields } from '@/lib/form-validation';

type PurchaseOrder = (typeof purchasingModule.purchaseOrders)[number];
type Supplier = (typeof purchasingModule.suppliers)[number];

const PO_LABELS: Record<string, string> = {
  id: 'PO ID',
  supplier: 'Supplier',
  items: 'Items',
  amount: 'Amount',
  status: 'Status',
  eta: 'ETA',
};

const SUPPLIER_LABELS: Record<string, string> = {
  id: 'Supplier ID',
  name: 'Name',
  category: 'Category',
  rating: 'Rating',
  orders: 'Orders',
  status: 'Status',
};

const EMPTY_PO: {
  supplier: string;
  items: string;
  amount: string;
  status: PurchaseOrder['status'];
  eta: string;
} = {
  supplier: '',
  items: '',
  amount: '',
  status: 'Pending',
  eta: daysFromNow(5),
};

export function PurchasingView() {
  const data = purchasingModule;
  const [tab, setTab] = useState('orders');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_PO);
  const [formError, setFormError] = useState('');

  const poTable = useManagedTable<PurchaseOrder>(data.purchaseOrders, (r) => r.id, PO_LABELS, {
    onEdit: (row) => {
      setEditingId(row.id);
      setForm({
        supplier: row.supplier,
        items: row.items,
        amount: stripCurrency(row.amount),
        status: row.status,
        eta: row.eta,
      });
      setShowForm(true);
      setTab('orders');
    },
  });
  const supplierTable = useManagedTable<Supplier>(data.suppliers, (r) => r.id, SUPPLIER_LABELS);

  const openForm = () => {
    setEditingId(null);
    setForm({ ...EMPTY_PO, eta: daysFromNow(5) });
    setFormError('');
    setTab('orders');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_PO, eta: daysFromNow(5) });
    setFormError('');
  };

  const handleSave = () => {
    const error = validateFields([
      () => required(form.supplier, 'Supplier'),
      () => required(form.items, 'Items'),
      () => positiveNumber(form.amount, 'Amount'),
      () => required(form.eta, 'ETA'),
    ]);
    if (error) {
      setFormError(error);
      return;
    }
    if (editingId) {
      poTable.setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, supplier: form.supplier, items: form.items, amount: formatCurrency(form.amount), status: form.status, eta: form.eta }
            : r,
        ),
      );
    } else {
      poTable.setRecords((prev) => [
        {
          id: nextRecordId('PUR', prev),
          supplier: form.supplier,
          items: form.items,
          amount: formatCurrency(form.amount),
          status: form.status,
          eta: form.eta,
        },
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
          <Can permission="purchasing.create">
            <Button className="gap-2" onClick={openForm}>
              <Plus className="h-4 w-4" />
              New Purchase Order
            </Button>
          </Can>
        }
      />
      <ModuleFormPanel open={showForm} onClose={closeForm} onSubmit={handleSave} title={editingId ? 'Edit Purchase Order' : 'New Purchase Order'} subtitle={editingId ? 'Update purchase order details' : 'Create a new purchase order for suppliers'} submitLabel={editingId ? 'Save Changes' : 'Create PO'} error={formError}>
        <FormInput label="Supplier" value={form.supplier} onChange={(v) => { setForm((f) => ({ ...f, supplier: v })); setFormError(''); }} placeholder="Supplier name" required />
        <FormInput label="Items" value={form.items} onChange={(v) => { setForm((f) => ({ ...f, items: v })); setFormError(''); }} placeholder="Items description" required />
        <FormInput label="Amount" value={form.amount} onChange={(v) => { setForm((f) => ({ ...f, amount: v })); setFormError(''); }} placeholder="e.g. 24800" type="number" required />
        <FormInput label="ETA" value={form.eta} onChange={(v) => { setForm((f) => ({ ...f, eta: v })); setFormError(''); }} placeholder="Jun 22" required />
        <FormSelect label="Status" value={form.status} onChange={(v) => setForm((f) => ({ ...f, status: v as PurchaseOrder['status'] }))} options={[{ value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }, { value: 'In Transit', label: 'In Transit' }]} />
      </ModuleFormPanel>

      <RecordDetailPanel open={!!poTable.viewRecord} title="Purchase Order" fields={poTable.detailFields} onClose={() => poTable.setViewRecord(null)} />
      <RecordDetailPanel open={!!supplierTable.viewRecord} title="Supplier" fields={supplierTable.detailFields} onClose={() => supplierTable.setViewRecord(null)} />
      <GenericRecordForm open={!!supplierTable.editRecord} record={supplierTable.editRecord} labels={SUPPLIER_LABELS} onClose={() => supplierTable.setEditRecord(null)} onSave={supplierTable.saveEdit} readOnlyKeys={['id']} requiredKeys={['name', 'category']} numericKeys={['rating', 'orders']} />

      <div className="erp-glass rounded-2xl p-1">
        <ModuleTabs
          tabs={[
            { id: 'orders', label: 'Purchase Orders' },
            { id: 'suppliers', label: 'Suppliers' },
            { id: 'status', label: 'Procurement Status' },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="p-4">
          {tab === 'orders' && (
            <DataTable
              columns={[
                { key: 'id', header: 'PO ID', mono: true },
                { key: 'supplier', header: 'Supplier' },
                { key: 'items', header: 'Items' },
                { key: 'amount', header: 'Amount', mono: true },
                { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
                { key: 'eta', header: 'ETA' },
              ]}
              data={poTable.records}
              rowKey={(r) => r.id}
              rowActions={poTable.rowActions}
            />
          )}

          {tab === 'suppliers' && (
            <DataTable
              columns={[
                { key: 'id', header: 'ID', mono: true },
                { key: 'name', header: 'Supplier' },
                { key: 'category', header: 'Category' },
                {
                  key: 'rating',
                  header: 'Rating',
                  render: (r) => (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-erp-warning text-erp-warning" />
                      {r.rating}
                    </span>
                  ),
                },
                { key: 'orders', header: 'Orders', mono: true },
                { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              ]}
              data={supplierTable.records}
              rowKey={(r) => r.id}
              rowActions={supplierTable.rowActions}
            />
          )}

          {tab === 'status' && (
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Open POs', value: '28', detail: '6 pending approval' },
                { label: 'In Transit', value: '12', detail: 'Avg 4.2 days remaining' },
                { label: 'Delivered (30d)', value: '64', detail: '91.2% on-time' },
              ].map((item) => (
                <div key={item.label} className="erp-glass-hover rounded-xl p-5">
                  <p className="erp-label mb-2">{item.label}</p>
                  <p className="font-display text-3xl font-semibold text-erp-text">{item.value}</p>
                  <p className="mt-2 text-xs text-erp-muted">{item.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
