'use client';

import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Can } from '@/components/shared/can';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/erp/modules/data-table';
import { FormInput, FormSelect, ModuleFormPanel } from '@/components/erp/modules/module-form-panel';
import { ModuleHeader, ModuleTabs } from '@/components/erp/modules/module-primitives';
import { RecordDetailPanel } from '@/components/erp/modules/record-detail-panel';
import { StatusBadge, statusVariant } from '@/components/erp/modules/status-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTransition } from '@/components/ui/motion';
import { useManagedTable } from '@/hooks/use-managed-table';
import { maintenanceModule } from '@/lib/data/manufacturing-mock';
import { daysFromNow, nextRecordId } from '@/lib/module-utils';
import { required, validateFields } from '@/lib/form-validation';
import { cn } from '@/lib/utils';

type CalendarTask = (typeof maintenanceModule.calendar)[number];

const CALENDAR_LABELS: Record<string, string> = {
  id: 'Task ID',
  machine: 'Machine',
  type: 'Type',
  date: 'Date',
  technician: 'Technician',
  status: 'Status',
};

const EMPTY_TASK: {
  machine: string;
  type: string;
  date: string;
  technician: string;
  status: CalendarTask['status'];
} = {
  machine: '',
  type: 'Preventive',
  date: daysFromNow(7),
  technician: '',
  status: 'Scheduled',
};

export function MaintenanceView() {
  const data = maintenanceModule;
  const [tab, setTab] = useState('machines');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_TASK);
  const [formError, setFormError] = useState('');

  const calendarTable = useManagedTable<CalendarTask>(data.calendar, (r) => r.id, CALENDAR_LABELS, {
    onEdit: (row) => {
      setEditingId(row.id);
      setForm({ machine: row.machine, type: row.type, date: row.date, technician: row.technician, status: row.status });
      setShowForm(true);
      setTab('calendar');
    },
  });

  const openForm = () => {
    setEditingId(null);
    setForm({ ...EMPTY_TASK, date: daysFromNow(7) });
    setFormError('');
    setTab('calendar');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_TASK, date: daysFromNow(7) });
    setFormError('');
  };

  const handleSave = () => {
    const error = validateFields([
      () => required(form.machine, 'Machine'),
      () => required(form.type, 'Type'),
      () => required(form.date, 'Date'),
      () => required(form.technician, 'Technician'),
    ]);
    if (error) {
      setFormError(error);
      return;
    }
    if (editingId) {
      calendarTable.setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId ? { ...r, machine: form.machine, type: form.type, date: form.date, technician: form.technician, status: form.status } : r,
        ),
      );
    } else {
      calendarTable.setRecords((prev) => [
        { id: nextRecordId('MNT', prev), machine: form.machine, type: form.type, date: form.date, technician: form.technician, status: form.status },
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
          <Can permission="maintenance.schedule">
            <Button className="gap-2" onClick={openForm}>
              <Plus className="h-4 w-4" />
              Schedule Maintenance
            </Button>
          </Can>
        }
      />
      <ModuleFormPanel open={showForm} onClose={closeForm} onSubmit={handleSave} title={editingId ? 'Edit Maintenance Task' : 'Schedule Maintenance'} subtitle={editingId ? 'Update maintenance task details' : 'Schedule a new maintenance task for equipment'} submitLabel={editingId ? 'Save Changes' : 'Schedule Task'} error={formError}>
        <FormInput label="Machine" value={form.machine} onChange={(v) => { setForm((f) => ({ ...f, machine: v })); setFormError(''); }} placeholder="e.g. CNC Lathe Beta" required />
        <FormSelect label="Type" value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v }))} options={[{ value: 'Preventive', label: 'Preventive' }, { value: 'Calibration', label: 'Calibration' }, { value: 'Inspection', label: 'Inspection' }, { value: 'Lubrication', label: 'Lubrication' }]} required />
        <FormInput label="Date" value={form.date} onChange={(v) => { setForm((f) => ({ ...f, date: v })); setFormError(''); }} placeholder="Jun 20" required />
        <FormInput label="Technician" value={form.technician} onChange={(v) => { setForm((f) => ({ ...f, technician: v })); setFormError(''); }} placeholder="Technician name" required />
        <FormSelect label="Status" value={form.status} onChange={(v) => setForm((f) => ({ ...f, status: v as CalendarTask['status'] }))} options={[{ value: 'Scheduled', label: 'Scheduled' }, { value: 'Overdue', label: 'Overdue' }]} />
      </ModuleFormPanel>

      <RecordDetailPanel open={!!calendarTable.viewRecord} title="Maintenance Task" fields={calendarTable.detailFields} onClose={() => calendarTable.setViewRecord(null)} />

      <div className="erp-glass rounded-2xl p-1">
        <ModuleTabs
          tabs={[
            { id: 'machines', label: 'Machines' },
            { id: 'calendar', label: 'Maintenance Calendar' },
            { id: 'monitoring', label: 'Equipment Monitoring' },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="p-4">
          {tab === 'machines' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.machines.map((machine) => (
                <Card key={machine.id} className="erp-glass-hover">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{machine.name}</CardTitle>
                        <p className="text-xs text-erp-muted">{machine.id}</p>
                      </div>
                      <Badge variant={statusVariant(machine.status === 'optimal' ? 'Active' : machine.status === 'warning' ? 'Warning' : 'Critical')}>
                        {machine.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-erp-muted">Uptime</p>
                        <p className="font-semibold">{machine.uptime}%</p>
                      </div>
                      <div>
                        <p className="text-erp-muted">Load</p>
                        <p className="font-semibold">{machine.load}%</p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-erp-bg">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          machine.status === 'optimal' && 'bg-erp-success',
                          machine.status === 'warning' && 'bg-erp-warning',
                          machine.status === 'critical' && 'bg-erp-danger',
                        )}
                        style={{ width: `${machine.uptime}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tab === 'calendar' && (
            <DataTable
              columns={[
                { key: 'id', header: 'Task ID', mono: true },
                { key: 'machine', header: 'Machine' },
                { key: 'type', header: 'Type' },
                {
                  key: 'date',
                  header: 'Date',
                  render: (r) => (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-erp-muted" />
                      {r.date}
                    </span>
                  ),
                },
                { key: 'technician', header: 'Technician' },
                { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              ]}
              data={calendarTable.records}
              rowKey={(r) => r.id}
              rowActions={calendarTable.rowActions}
            />
          )}

          {tab === 'monitoring' && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.monitoring.map((row) => (
                <div key={row.week} className="erp-glass rounded-xl p-4">
                  <p className="erp-label mb-2">{row.week}</p>
                  <p className="font-display text-2xl font-semibold text-erp-success">{row.uptime}%</p>
                  <p className="mt-1 text-xs text-erp-muted">Downtime {row.downtime}%</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
