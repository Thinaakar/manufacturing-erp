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
import {
  Bar,
  BarChart,
  ChartGrid,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  ResponsiveContainer,
  Tooltip,
  useChartTheme,
} from '@/components/erp/charts/chart-primitives';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTransition } from '@/components/ui/motion';
import { useManagedTable } from '@/hooks/use-managed-table';
import { productionModule } from '@/lib/data/manufacturing-mock';
import { nextRecordId } from '@/lib/module-utils';
import { required, validateFields } from '@/lib/form-validation';
import { cn } from '@/lib/utils';

type WorkOrder = (typeof productionModule.workOrders)[number];
type ProductionOrder = (typeof productionModule.orders)[number];
type ScheduleRow = (typeof productionModule.schedule)[number];

const ORDER_LABELS: Record<string, string> = {
  id: 'Order ID',
  product: 'Product',
  qty: 'Quantity',
  line: 'Line',
  status: 'Status',
  due: 'Due Date',
};

const WORK_ORDER_LABELS: Record<string, string> = {
  id: 'Work Order',
  operation: 'Operation',
  machine: 'Machine',
  operator: 'Operator',
  shift: 'Shift',
  status: 'Status',
};

const SCHEDULE_LABELS: Record<string, string> = {
  line: 'Line',
  shift: 'Shift',
  product: 'Product',
  start: 'Start',
  end: 'End',
  load: 'Load %',
};

const EMPTY_WORK_ORDER: {
  operation: string;
  machine: string;
  operator: string;
  shift: string;
  status: WorkOrder['status'];
} = {
  operation: '',
  machine: '',
  operator: '',
  shift: 'Shift 2',
  status: 'Pending',
};

export function ProductionView() {
  const data = productionModule;
  const chart = useChartTheme();
  const [tab, setTab] = useState('orders');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_WORK_ORDER);
  const [formError, setFormError] = useState('');

  const orderTable = useManagedTable<ProductionOrder>(data.orders, (r) => r.id, ORDER_LABELS);
  const workOrderTable = useManagedTable<WorkOrder>(
    data.workOrders,
    (r) => r.id,
    WORK_ORDER_LABELS,
    {
      onEdit: (row) => {
        setEditingId(row.id);
        setForm({
          operation: row.operation,
          machine: row.machine,
          operator: row.operator,
          shift: row.shift,
          status: row.status,
        });
        setShowForm(true);
        setTab('work');
      },
    },
  );
  const scheduleTable = useManagedTable<ScheduleRow>(data.schedule, (r) => r.line, SCHEDULE_LABELS);

  const openForm = () => {
    setEditingId(null);
    setForm(EMPTY_WORK_ORDER);
    setFormError('');
    setTab('work');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_WORK_ORDER);
    setFormError('');
  };

  const handleSave = () => {
    const error = validateFields([
      () => required(form.operation, 'Operation'),
      () => required(form.machine, 'Machine'),
      () => required(form.operator, 'Operator'),
    ]);
    if (error) {
      setFormError(error);
      return;
    }
    if (editingId) {
      workOrderTable.setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, operation: form.operation, machine: form.machine, operator: form.operator, shift: form.shift, status: form.status }
            : r,
        ),
      );
    } else {
      workOrderTable.setRecords((prev) => [
        {
          id: nextRecordId('WO', prev),
          operation: form.operation,
          machine: form.machine,
          operator: form.operator,
          shift: form.shift,
          status: form.status,
        },
        ...prev,
      ]);
    }
    closeForm();
  };

  const detailPanels = [
    { table: orderTable, title: 'Production Order' },
    { table: workOrderTable, title: 'Work Order' },
    { table: scheduleTable, title: 'Schedule Entry' },
  ];

  return (
    <PageTransition className="space-y-6">
      <ModuleHeader
        badge={data.header.badge}
        title={data.header.title}
        subtitle={data.header.subtitle}
        description={data.header.description}
        action={
          <Can permission="production.create">
            <Button className="gap-2" onClick={openForm}>
              <Plus className="h-4 w-4" />
              New Work Order
            </Button>
          </Can>
        }
      />
      <ModuleFormPanel
        open={showForm}
        onClose={closeForm}
        onSubmit={handleSave}
        title={editingId ? 'Edit Work Order' : 'New Work Order'}
        subtitle={editingId ? 'Update work order details' : 'Create a new production work order'}
        submitLabel={editingId ? 'Save Changes' : 'Create Work Order'}
        error={formError}
      >
        <FormInput label="Operation" value={form.operation} onChange={(v) => { setForm((f) => ({ ...f, operation: v })); setFormError(''); }} placeholder="e.g. CNC Milling" required />
        <FormInput label="Machine" value={form.machine} onChange={(v) => { setForm((f) => ({ ...f, machine: v })); setFormError(''); }} placeholder="e.g. CNC-01" required />
        <FormInput label="Operator" value={form.operator} onChange={(v) => { setForm((f) => ({ ...f, operator: v })); setFormError(''); }} placeholder="Operator name" required />
        <FormSelect label="Shift" value={form.shift} onChange={(v) => setForm((f) => ({ ...f, shift: v }))} options={[{ value: 'Shift 1', label: 'Shift 1' }, { value: 'Shift 2', label: 'Shift 2' }, { value: 'Shift 3', label: 'Shift 3' }]} />
        <FormSelect label="Status" value={form.status} onChange={(v) => setForm((f) => ({ ...f, status: v as WorkOrder['status'] }))} options={[{ value: 'Pending', label: 'Pending' }, { value: 'Active', label: 'Active' }]} />
      </ModuleFormPanel>

      {detailPanels.map(({ table, title }) => (
        <RecordDetailPanel
          key={title}
          open={!!table.viewRecord}
          title={title}
          fields={table.detailFields}
          onClose={() => table.setViewRecord(null)}
        />
      ))}

      <GenericRecordForm open={!!orderTable.editRecord} record={orderTable.editRecord} labels={ORDER_LABELS} onClose={() => orderTable.setEditRecord(null)} onSave={orderTable.saveEdit} readOnlyKeys={['id']} requiredKeys={['product', 'qty', 'line', 'due']} numericKeys={['qty']} />
      <GenericRecordForm open={!!scheduleTable.editRecord} record={scheduleTable.editRecord} labels={SCHEDULE_LABELS} onClose={() => scheduleTable.setEditRecord(null)} onSave={scheduleTable.saveEdit} requiredKeys={['line', 'product', 'start', 'end', 'load']} numericKeys={['load']} />

      <div className="erp-glass rounded-2xl p-1">
        <ModuleTabs
          tabs={[
            { id: 'orders', label: 'Production Orders', count: orderTable.records.length },
            { id: 'work', label: 'Work Orders', count: workOrderTable.records.length },
            { id: 'schedule', label: 'Schedule', count: scheduleTable.records.length },
            { id: 'tracking', label: 'Tracking' },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="p-4">
          {tab === 'orders' && (
            <DataTable
              columns={[
                { key: 'id', header: 'Order ID', mono: true },
                { key: 'product', header: 'Product' },
                { key: 'qty', header: 'Qty', mono: true },
                { key: 'line', header: 'Line' },
                { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
                { key: 'due', header: 'Due' },
              ]}
              data={orderTable.records}
              rowKey={(r) => r.id}
              rowActions={orderTable.rowActions}
            />
          )}

          {tab === 'work' && (
            <DataTable
              columns={[
                { key: 'id', header: 'Work Order', mono: true },
                { key: 'operation', header: 'Operation' },
                { key: 'machine', header: 'Machine', mono: true },
                { key: 'operator', header: 'Operator' },
                { key: 'shift', header: 'Shift' },
                { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              ]}
              data={workOrderTable.records}
              rowKey={(r) => r.id}
              rowActions={workOrderTable.rowActions}
            />
          )}

          {tab === 'schedule' && (
            <DataTable
              columns={[
                { key: 'line', header: 'Line' },
                { key: 'shift', header: 'Shift' },
                { key: 'product', header: 'Product' },
                { key: 'start', header: 'Start', mono: true },
                { key: 'end', header: 'End', mono: true },
                {
                  key: 'load',
                  header: 'Load',
                  render: (r) => (
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-erp-bg">
                        <div className={cn('h-full rounded-full', r.load >= 90 ? 'bg-erp-warning' : 'bg-erp-accent')} style={{ width: `${r.load}%` }} />
                      </div>
                      <span className="font-mono text-xs">{r.load}%</span>
                    </div>
                  ),
                },
              ]}
              data={scheduleTable.records}
              rowKey={(r) => r.line}
              rowActions={scheduleTable.rowActions}
            />
          )}

          {tab === 'tracking' && (
            <div className="grid gap-6 lg:grid-cols-5">
              <Card className="erp-glass-hover lg:col-span-3">
                <CardHeader>
                  <CardTitle>Hourly Output Tracking</CardTitle>
                  <p className="text-sm text-erp-muted">Planned vs actual production this shift</p>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.tracking} barGap={4}>
                        <ChartGrid />
                        <ChartXAxis dataKey="hour" />
                        <ChartYAxis />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="planned" name="Planned" fill={chart.muted} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actual" name="Actual" fill={chart.accent} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="erp-glass-hover lg:col-span-2">
                <CardHeader>
                  <CardTitle>Shift Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.tracking.slice(-3).map((row) => (
                    <div key={row.hour} className="rounded-xl border border-erp-border bg-erp-bg/40 p-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-erp-muted">{row.hour}</span>
                        <span className="font-semibold text-erp-text">{row.actual} units</span>
                      </div>
                      <p className="mt-1 text-xs text-erp-success">{((row.actual / row.planned) * 100).toFixed(1)}% of plan</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
