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
import { financeModule } from '@/lib/data/manufacturing-mock';
import { formatCurrency, nextRecordId, stripCurrency, todayLabel } from '@/lib/module-utils';
import { positiveNumber, required, validateFields } from '@/lib/form-validation';

type Expense = (typeof financeModule.expenses)[number];
type Invoice = (typeof financeModule.invoices)[number];

const EXPENSE_LABELS: Record<string, string> = {
  id: 'Expense ID',
  category: 'Category',
  vendor: 'Vendor',
  amount: 'Amount',
  date: 'Date',
  status: 'Status',
};

const INVOICE_LABELS: Record<string, string> = {
  id: 'Invoice ID',
  customer: 'Customer',
  amount: 'Amount',
  due: 'Due Date',
  status: 'Status',
};

const EMPTY_EXPENSE: { category: string; vendor: string; amount: string; status: Expense['status'] } = {
  category: '',
  vendor: '',
  amount: '',
  status: 'Pending',
};

export function FinanceView() {
  const data = financeModule;
  const [tab, setTab] = useState('expenses');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_EXPENSE);
  const [formError, setFormError] = useState('');

  const expenseTable = useManagedTable<Expense>(
    data.expenses,
    (r) => r.id,
    EXPENSE_LABELS,
    {
      onEdit: (row) => {
        setEditingId(row.id);
        setForm({
          category: row.category,
          vendor: row.vendor,
          amount: stripCurrency(row.amount),
          status: row.status,
        });
        setShowForm(true);
        setTab('expenses');
      },
    },
  );

  const invoiceTable = useManagedTable<Invoice>(data.invoices, (r) => r.id, INVOICE_LABELS);

  const openForm = () => {
    setEditingId(null);
    setForm(EMPTY_EXPENSE);
    setFormError('');
    setTab('expenses');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_EXPENSE);
    setFormError('');
  };

  const handleSave = () => {
    const error = validateFields([
      () => required(form.category, 'Category'),
      () => required(form.vendor, 'Vendor'),
      () => positiveNumber(form.amount, 'Amount'),
    ]);
    if (error) {
      setFormError(error);
      return;
    }
    if (editingId) {
      expenseTable.setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                category: form.category,
                vendor: form.vendor,
                amount: formatCurrency(form.amount),
                status: form.status,
              }
            : r,
        ),
      );
    } else {
      expenseTable.setRecords((prev) => [
        {
          id: nextRecordId('EXP', prev),
          category: form.category,
          vendor: form.vendor,
          amount: formatCurrency(form.amount),
          date: todayLabel(),
          status: form.status,
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
          <Can permission="finance.create">
            <Button className="gap-2" onClick={openForm}>
              <Plus className="h-4 w-4" />
              Record Expense
            </Button>
          </Can>
        }
      />
      <ModuleFormPanel
        open={showForm}
        onClose={closeForm}
        onSubmit={handleSave}
        title={editingId ? 'Edit Expense' : 'Record Expense'}
        subtitle={editingId ? 'Update expense details' : 'Add a new expense to the finance ledger'}
        submitLabel={editingId ? 'Save Changes' : 'Record Expense'}
        error={formError}
      >
        <FormInput
          label="Category"
          value={form.category}
          onChange={(v) => { setForm((f) => ({ ...f, category: v })); setFormError(''); }}
          placeholder="e.g. Raw Materials"
          required
        />
        <FormInput
          label="Vendor"
          value={form.vendor}
          onChange={(v) => { setForm((f) => ({ ...f, vendor: v })); setFormError(''); }}
          placeholder="Vendor name"
          required
        />
        <FormInput
          label="Amount"
          value={form.amount}
          onChange={(v) => { setForm((f) => ({ ...f, amount: v })); setFormError(''); }}
          placeholder="e.g. 4800"
          type="number"
          required
        />
        <FormSelect
          label="Status"
          value={form.status}
          onChange={(v) => setForm((f) => ({ ...f, status: v as Expense['status'] }))}
          options={[
            { value: 'Pending', label: 'Pending' },
            { value: 'Paid', label: 'Paid' },
          ]}
        />
      </ModuleFormPanel>

      <RecordDetailPanel
        open={!!expenseTable.viewRecord}
        title="Expense Details"
        fields={expenseTable.detailFields}
        onClose={() => expenseTable.setViewRecord(null)}
      />

      <RecordDetailPanel
        open={!!invoiceTable.viewRecord}
        title="Invoice Details"
        fields={invoiceTable.detailFields}
        onClose={() => invoiceTable.setViewRecord(null)}
      />

      <GenericRecordForm
        open={!!invoiceTable.editRecord}
        record={invoiceTable.editRecord}
        labels={INVOICE_LABELS}
        onClose={() => invoiceTable.setEditRecord(null)}
        onSave={invoiceTable.saveEdit}
        readOnlyKeys={['id']}
        requiredKeys={['customer', 'amount', 'due']}
        numericKeys={['amount']}
      />

      <div className="erp-glass rounded-2xl p-1">
        <ModuleTabs
          tabs={[
            { id: 'expenses', label: 'Expenses' },
            { id: 'invoices', label: 'Invoices' },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="p-4">
          {tab === 'expenses' && (
            <DataTable
              columns={[
                { key: 'id', header: 'Expense ID', mono: true },
                { key: 'category', header: 'Category' },
                { key: 'vendor', header: 'Vendor' },
                { key: 'amount', header: 'Amount', mono: true },
                { key: 'date', header: 'Date' },
                { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              ]}
              data={expenseTable.records}
              rowKey={(r) => r.id}
              rowActions={expenseTable.rowActions}
            />
          )}

          {tab === 'invoices' && (
            <DataTable
              columns={[
                { key: 'id', header: 'Invoice ID', mono: true },
                { key: 'customer', header: 'Customer' },
                { key: 'amount', header: 'Amount', mono: true },
                { key: 'due', header: 'Due Date' },
                { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              ]}
              data={invoiceTable.records}
              rowKey={(r) => r.id}
              rowActions={invoiceTable.rowActions}
            />
          )}

        </div>
      </div>
    </PageTransition>
  );
}
