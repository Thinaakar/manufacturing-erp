'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Can } from '@/components/shared/can';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/erp/modules/data-table';
import { FormInput, FormSelect, ModuleFormPanel } from '@/components/erp/modules/module-form-panel';
import { ModuleHeader, ModuleTabs } from '@/components/erp/modules/module-primitives';
import { RecordDetailPanel } from '@/components/erp/modules/record-detail-panel';
import { StatusBadge } from '@/components/erp/modules/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTransition } from '@/components/ui/motion';
import { useManagedTable } from '@/hooks/use-managed-table';
import { employeesModule } from '@/lib/data/manufacturing-mock';
import { nextRecordId } from '@/lib/module-utils';
import { required, validateFields } from '@/lib/form-validation';
import { cn } from '@/lib/utils';

type Attendance = (typeof employeesModule.attendance)[number];

const ATTENDANCE_LABELS: Record<string, string> = {
  id: 'Employee ID',
  name: 'Name',
  department: 'Department',
  shift: 'Shift',
  status: 'Status',
  hours: 'Hours Today',
};

const EMPTY_EMPLOYEE: {
  name: string;
  department: string;
  shift: string;
  status: Attendance['status'];
  hours: string;
} = {
  name: '',
  department: 'Production',
  shift: 'Shift 2',
  status: 'Present',
  hours: '0h 00m',
};

export function EmployeesView() {
  const data = employeesModule;
  const [tab, setTab] = useState('attendance');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_EMPLOYEE);
  const [formError, setFormError] = useState('');

  const attendanceTable = useManagedTable<Attendance>(data.attendance, (r) => r.id, ATTENDANCE_LABELS, {
    onEdit: (row) => {
      setEditingId(row.id);
      setForm({ name: row.name, department: row.department, shift: row.shift, status: row.status, hours: row.hours });
      setShowForm(true);
      setTab('attendance');
    },
  });

  const openForm = () => {
    setEditingId(null);
    setForm(EMPTY_EMPLOYEE);
    setFormError('');
    setTab('attendance');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_EMPLOYEE);
    setFormError('');
  };

  const handleSave = () => {
    const error = validateFields([
      () => required(form.name, 'Full name'),
      () => required(form.department, 'Department'),
      () => required(form.shift, 'Shift'),
    ]);
    if (error) {
      setFormError(error);
      return;
    }
    if (editingId) {
      attendanceTable.setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId ? { ...r, name: form.name, department: form.department, shift: form.shift, status: form.status, hours: form.hours } : r,
        ),
      );
    } else {
      attendanceTable.setRecords((prev) => [
        { id: nextRecordId('EMP', prev), name: form.name, department: form.department, shift: form.shift, status: form.status, hours: form.hours },
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
          <Can permission="employees.edit">
            <Button className="gap-2" onClick={openForm}>
              <UserPlus className="h-4 w-4" />
              Add Employee
            </Button>
          </Can>
        }
      />
      <ModuleFormPanel open={showForm} onClose={closeForm} onSubmit={handleSave} title={editingId ? 'Edit Employee' : 'Add Employee'} subtitle={editingId ? 'Update employee attendance details' : 'Register a new employee record'} submitLabel={editingId ? 'Save Changes' : 'Add Employee'} error={formError}>
        <FormInput label="Full Name" value={form.name} onChange={(v) => { setForm((f) => ({ ...f, name: v })); setFormError(''); }} placeholder="Employee name" required />
        <FormSelect label="Department" value={form.department} onChange={(v) => setForm((f) => ({ ...f, department: v }))} options={[{ value: 'Production', label: 'Production' }, { value: 'Quality Control', label: 'Quality Control' }, { value: 'Maintenance', label: 'Maintenance' }, { value: 'Logistics', label: 'Logistics' }]} required />
        <FormSelect label="Shift" value={form.shift} onChange={(v) => setForm((f) => ({ ...f, shift: v }))} options={[{ value: 'Shift 1', label: 'Shift 1' }, { value: 'Shift 2', label: 'Shift 2' }, { value: 'Shift 3', label: 'Shift 3' }]} required />
        <FormSelect label="Status" value={form.status} onChange={(v) => setForm((f) => ({ ...f, status: v as Attendance['status'] }))} options={[{ value: 'Present', label: 'Present' }, { value: 'Late', label: 'Late' }, { value: 'Absent', label: 'Absent' }]} />
        <FormInput label="Hours Today" value={form.hours} onChange={(v) => setForm((f) => ({ ...f, hours: v }))} placeholder="6h 32m" />
      </ModuleFormPanel>

      <RecordDetailPanel open={!!attendanceTable.viewRecord} title="Employee Record" fields={attendanceTable.detailFields} onClose={() => attendanceTable.setViewRecord(null)} />

      <div className="erp-glass rounded-2xl p-1">
        <ModuleTabs
          tabs={[
            { id: 'attendance', label: 'Attendance', count: attendanceTable.records.length },
            { id: 'departments', label: 'Workforce Overview', count: data.departments.length },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="p-4">
          {tab === 'attendance' && (
            <DataTable
              columns={[
                { key: 'id', header: 'Employee ID', mono: true },
                { key: 'name', header: 'Name' },
                { key: 'department', header: 'Department' },
                { key: 'shift', header: 'Shift' },
                { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
                { key: 'hours', header: 'Hours Today', mono: true },
              ]}
              data={attendanceTable.records}
              rowKey={(r) => r.id}
              rowActions={attendanceTable.rowActions}
            />
          )}

          {tab === 'departments' && (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.departments.map((dept) => (
                <Card key={dept.name} className="erp-glass-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{dept.name}</CardTitle>
                    <p className="text-xs text-erp-muted">{dept.shift}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-erp-muted">Headcount</p>
                        <p className="font-semibold">{dept.headcount}</p>
                      </div>
                      <div>
                        <p className="text-erp-muted">Present</p>
                        <p className="font-semibold text-erp-success">{dept.present}</p>
                      </div>
                      <div>
                        <p className="text-erp-muted">Utilization</p>
                        <p className="font-semibold">{dept.utilization}%</p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-erp-bg">
                      <div className={cn('h-full rounded-full bg-erp-accent')} style={{ width: `${dept.utilization}%` }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
