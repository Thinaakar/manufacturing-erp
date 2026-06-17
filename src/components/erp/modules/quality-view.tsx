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
import { qualityModule } from '@/lib/data/manufacturing-mock';
import { nextRecordId } from '@/lib/module-utils';
import { required, scorePercent, validateFields } from '@/lib/form-validation';

type QualityCheck = (typeof qualityModule.checks)[number];
type Defect = (typeof qualityModule.defects)[number];

const CHECK_LABELS: Record<string, string> = {
  id: 'Check ID',
  product: 'Product',
  line: 'Line',
  inspector: 'Inspector',
  result: 'Result',
  score: 'Score',
};

const DEFECT_LABELS: Record<string, string> = {
  id: 'Defect ID',
  product: 'Product',
  type: 'Type',
  severity: 'Severity',
  qty: 'Quantity',
  status: 'Status',
};

const EMPTY_CHECK: {
  product: string;
  line: string;
  inspector: string;
  result: QualityCheck['result'];
  score: string;
} = {
  product: '',
  line: 'A-1',
  inspector: '',
  result: 'Pass',
  score: '95',
};

export function QualityView() {
  const data = qualityModule;
  const [tab, setTab] = useState('checks');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_CHECK);
  const [formError, setFormError] = useState('');

  const checkTable = useManagedTable<QualityCheck>(data.checks, (r) => r.id, CHECK_LABELS, {
    onEdit: (row) => {
      setEditingId(row.id);
      setForm({ product: row.product, line: row.line, inspector: row.inspector, result: row.result, score: String(row.score) });
      setShowForm(true);
      setTab('checks');
    },
  });
  const defectTable = useManagedTable<Defect>(data.defects, (r) => r.id, DEFECT_LABELS);

  const openForm = () => {
    setEditingId(null);
    setForm(EMPTY_CHECK);
    setFormError('');
    setTab('checks');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_CHECK);
    setFormError('');
  };

  const handleSave = () => {
    const error = validateFields([
      () => required(form.product, 'Product'),
      () => required(form.inspector, 'Inspector'),
      () => scorePercent(form.score, 'Score'),
    ]);
    if (error) {
      setFormError(error);
      return;
    }
    const score = parseFloat(form.score);
    if (editingId) {
      checkTable.setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId ? { ...r, product: form.product, line: form.line, inspector: form.inspector, result: form.result, score } : r,
        ),
      );
    } else {
      checkTable.setRecords((prev) => [
        { id: nextRecordId('QC', prev), product: form.product, line: form.line, inspector: form.inspector, result: form.result, score },
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
          <Can permission="quality.inspect">
            <Button className="gap-2" onClick={openForm}>
              <Plus className="h-4 w-4" />
              New Inspection
            </Button>
          </Can>
        }
      />
      <ModuleFormPanel open={showForm} onClose={closeForm} onSubmit={handleSave} title={editingId ? 'Edit Inspection' : 'New Inspection'} subtitle={editingId ? 'Update quality inspection details' : 'Log a new quality inspection result'} submitLabel={editingId ? 'Save Changes' : 'Save Inspection'} error={formError}>
        <FormInput label="Product" value={form.product} onChange={(v) => { setForm((f) => ({ ...f, product: v })); setFormError(''); }} placeholder="Product name" required />
        <FormSelect label="Line" value={form.line} onChange={(v) => setForm((f) => ({ ...f, line: v }))} options={[{ value: 'A-1', label: 'Line A-1' }, { value: 'A-3', label: 'Line A-3' }, { value: 'B-2', label: 'Line B-2' }, { value: 'C-1', label: 'Line C-1' }]} required />
        <FormInput label="Inspector" value={form.inspector} onChange={(v) => { setForm((f) => ({ ...f, inspector: v })); setFormError(''); }} placeholder="Inspector name" required />
        <FormInput label="Score (%)" value={form.score} onChange={(v) => { setForm((f) => ({ ...f, score: v })); setFormError(''); }} type="number" placeholder="95" required />
        <FormSelect label="Result" value={form.result} onChange={(v) => setForm((f) => ({ ...f, result: v as QualityCheck['result'] }))} options={[{ value: 'Pass', label: 'Pass' }, { value: 'Review', label: 'Review' }, { value: 'Fail', label: 'Fail' }]} />
      </ModuleFormPanel>

      <RecordDetailPanel open={!!checkTable.viewRecord} title="Quality Check" fields={checkTable.detailFields} onClose={() => checkTable.setViewRecord(null)} />
      <RecordDetailPanel open={!!defectTable.viewRecord} title="Defect Report" fields={defectTable.detailFields} onClose={() => defectTable.setViewRecord(null)} />
      <GenericRecordForm open={!!defectTable.editRecord} record={defectTable.editRecord} labels={DEFECT_LABELS} onClose={() => defectTable.setEditRecord(null)} onSave={defectTable.saveEdit} readOnlyKeys={['id']} requiredKeys={['product', 'type', 'qty']} numericKeys={['qty']} />

      <div className="erp-glass rounded-2xl p-1">
        <ModuleTabs
          tabs={[
            { id: 'checks', label: 'Quality Checks', count: checkTable.records.length },
            { id: 'defects', label: 'Defect Reports', count: defectTable.records.length },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="p-4">
          {tab === 'checks' && (
            <DataTable
              columns={[
                { key: 'id', header: 'Check ID', mono: true },
                { key: 'product', header: 'Product' },
                { key: 'line', header: 'Line', mono: true },
                { key: 'inspector', header: 'Inspector' },
                { key: 'result', header: 'Result', render: (r) => <StatusBadge status={r.result} /> },
                { key: 'score', header: 'Score', render: (r) => `${r.score}%`, mono: true },
              ]}
              data={checkTable.records}
              rowKey={(r) => r.id}
              rowActions={checkTable.rowActions}
            />
          )}

          {tab === 'defects' && (
            <DataTable
              columns={[
                { key: 'id', header: 'Defect ID', mono: true },
                { key: 'product', header: 'Product' },
                { key: 'type', header: 'Type' },
                { key: 'severity', header: 'Severity', render: (r) => <StatusBadge status={r.severity} /> },
                { key: 'qty', header: 'Qty', mono: true },
                { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              ]}
              data={defectTable.records}
              rowKey={(r) => r.id}
              rowActions={defectTable.rowActions}
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
