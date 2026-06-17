'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
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
import { salesModule } from '@/lib/data/manufacturing-mock';
import { daysFromNow, formatCurrency, nextRecordId, stripCurrency } from '@/lib/module-utils';
import { positiveNumber, required, validateFields } from '@/lib/form-validation';

type SalesOrder = (typeof salesModule.orders)[number];
type Customer = (typeof salesModule.customers)[number];

const ORDER_LABELS: Record<string, string> = {
  id: 'Order ID',
  customer: 'Customer',
  product: 'Product',
  value: 'Value',
  status: 'Status',
  due: 'Due Date',
};

const CUSTOMER_LABELS: Record<string, string> = {
  id: 'Customer ID',
  name: 'Name',
  segment: 'Segment',
  orders: 'Orders',
  revenue: 'Revenue',
  status: 'Status',
};

const EMPTY_ORDER: {
  customer: string;
  product: string;
  value: string;
  status: SalesOrder['status'];
  due: string;
} = {
  customer: '',
  product: '',
  value: '',
  status: 'Confirmed',
  due: daysFromNow(14),
};

export function SalesView() {
  const data = salesModule;
  const [tab, setTab] = useState('orders');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_ORDER);
  const [formError, setFormError] = useState('');

  const orderTable = useManagedTable<SalesOrder>(data.orders, (r) => r.id, ORDER_LABELS, {
    onEdit: (row) => {
      setEditingId(row.id);
      setForm({
        customer: row.customer,
        product: row.product,
        value: stripCurrency(row.value),
        status: row.status,
        due: row.due,
      });
      setShowForm(true);
      setTab('orders');
    },
  });
  const customerTable = useManagedTable<Customer>(data.customers, (r) => r.id, CUSTOMER_LABELS);

  const openForm = () => {
    setEditingId(null);
    setForm({ ...EMPTY_ORDER, due: daysFromNow(14) });
    setFormError('');
    setTab('orders');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_ORDER, due: daysFromNow(14) });
    setFormError('');
  };

  const handleSave = () => {
    const error = validateFields([
      () => required(form.customer, 'Customer'),
      () => required(form.product, 'Product'),
      () => positiveNumber(form.value, 'Value'),
      () => required(form.due, 'Due date'),
    ]);
    if (error) {
      setFormError(error);
      return;
    }
    if (editingId) {
      orderTable.setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, customer: form.customer, product: form.product, value: formatCurrency(form.value), status: form.status, due: form.due }
            : r,
        ),
      );
    } else {
      orderTable.setRecords((prev) => [
        {
          id: nextRecordId('SO', prev),
          customer: form.customer,
          product: form.product,
          value: formatCurrency(form.value),
          status: form.status,
          due: form.due,
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
          <Can permission="sales.create">
            <Button className="gap-2" onClick={openForm}>
              <Plus className="h-4 w-4" />
              New Sales Order
            </Button>
          </Can>
        }
      />

      <ModuleFormPanel open={showForm} onClose={closeForm} onSubmit={handleSave} title={editingId ? 'Edit Sales Order' : 'New Sales Order'} subtitle={editingId ? 'Update sales order details' : 'Create a new customer sales order'} submitLabel={editingId ? 'Save Changes' : 'Create Order'} error={formError}>
        <FormInput label="Customer" value={form.customer} onChange={(v) => { setForm((f) => ({ ...f, customer: v })); setFormError(''); }} placeholder="Customer name" required />
        <FormInput label="Product" value={form.product} onChange={(v) => { setForm((f) => ({ ...f, product: v })); setFormError(''); }} placeholder="Product name" required />
        <FormInput label="Value" value={form.value} onChange={(v) => { setForm((f) => ({ ...f, value: v })); setFormError(''); }} placeholder="e.g. 128000" type="number" required />
        <FormInput label="Due Date" value={form.due} onChange={(v) => { setForm((f) => ({ ...f, due: v })); setFormError(''); }} placeholder="Jul 10" required />
        <FormSelect label="Status" value={form.status} onChange={(v) => setForm((f) => ({ ...f, status: v as SalesOrder['status'] }))} options={[{ value: 'Quote', label: 'Quote' }, { value: 'Confirmed', label: 'Confirmed' }, { value: 'In Production', label: 'In Production' }, { value: 'Shipped', label: 'Shipped' }]} />
      </ModuleFormPanel>

      <RecordDetailPanel open={!!orderTable.viewRecord} title="Sales Order" fields={orderTable.detailFields} onClose={() => orderTable.setViewRecord(null)} />
      <RecordDetailPanel open={!!customerTable.viewRecord} title="Customer" fields={customerTable.detailFields} onClose={() => customerTable.setViewRecord(null)} />
      <GenericRecordForm open={!!customerTable.editRecord} record={customerTable.editRecord} labels={CUSTOMER_LABELS} onClose={() => customerTable.setEditRecord(null)} onSave={customerTable.saveEdit} readOnlyKeys={['id']} requiredKeys={['name', 'segment']} numericKeys={['orders', 'rating']} />

      <div className="erp-glass rounded-2xl p-1">
        <ModuleTabs
          tabs={[
            { id: 'orders', label: 'Orders', count: orderTable.records.length },
            { id: 'customers', label: 'Customers', count: customerTable.records.length },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="p-4">
          {tab === 'orders' && (
            <DataTable
              columns={[
                { key: 'id', header: 'Order ID', mono: true },
                { key: 'customer', header: 'Customer' },
                { key: 'product', header: 'Product' },
                { key: 'value', header: 'Value', mono: true },
                { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
                { key: 'due', header: 'Due' },
              ]}
              data={orderTable.records}
              rowKey={(r) => r.id}
              rowActions={orderTable.rowActions}
            />
          )}

          {tab === 'customers' && (
            <DataTable
              columns={[
                { key: 'id', header: 'ID', mono: true },
                { key: 'name', header: 'Customer' },
                { key: 'segment', header: 'Segment' },
                { key: 'orders', header: 'Orders', mono: true },
                { key: 'revenue', header: 'Revenue', mono: true },
                { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              ]}
              data={customerTable.records}
              rowKey={(r) => r.id}
              rowActions={customerTable.rowActions}
            />
          )}

        </div>
      </div>
    </PageTransition>
  );
}
