export interface PermissionItem {
  key: string;
  label: string;
}

export interface PermissionModuleGroup {
  key: string;
  label: string;
  permissions: PermissionItem[];
}

export const PERMISSION_MODULES: PermissionModuleGroup[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    permissions: [{ key: 'dashboard.view', label: 'View Dashboard' }],
  },
  {
    key: 'production',
    label: 'Production',
    permissions: [
      { key: 'production.view', label: 'View Production' },
      { key: 'production.create', label: 'Create Work Orders' },
      { key: 'production.edit', label: 'Edit Production' },
    ],
  },
  {
    key: 'inventory',
    label: 'Inventory',
    permissions: [
      { key: 'inventory.view', label: 'View Inventory' },
      { key: 'inventory.edit', label: 'Edit Stock' },
      { key: 'inventory.reorder', label: 'Trigger Reorders' },
    ],
  },
  {
    key: 'purchasing',
    label: 'Purchasing',
    permissions: [
      { key: 'purchasing.view', label: 'View Purchasing' },
      { key: 'purchasing.create', label: 'Create Purchase Orders' },
      { key: 'purchasing.approve', label: 'Approve Purchase Orders' },
    ],
  },
  {
    key: 'sales',
    label: 'Sales',
    permissions: [
      { key: 'sales.view', label: 'View Sales' },
      { key: 'sales.create', label: 'Create Sales Orders' },
      { key: 'sales.edit', label: 'Edit Sales Orders' },
    ],
  },
  {
    key: 'maintenance',
    label: 'Maintenance',
    permissions: [
      { key: 'maintenance.view', label: 'View Maintenance' },
      { key: 'maintenance.schedule', label: 'Schedule Maintenance' },
    ],
  },
  {
    key: 'employees',
    label: 'Employees',
    permissions: [
      { key: 'employees.view', label: 'View Employees' },
      { key: 'employees.edit', label: 'Edit Employee Records' },
    ],
  },
  {
    key: 'quality',
    label: 'Quality Control',
    permissions: [
      { key: 'quality.view', label: 'View Quality Checks' },
      { key: 'quality.inspect', label: 'Run Inspections' },
      { key: 'quality.resolve', label: 'Resolve Defects' },
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    permissions: [
      { key: 'finance.view', label: 'View Finance' },
      { key: 'finance.create', label: 'Record Expenses' },
      { key: 'finance.invoice', label: 'Manage Invoices' },
    ],
  },
  {
    key: 'reports',
    label: 'Reports & Analytics',
    permissions: [
      { key: 'reports.view', label: 'View Reports' },
      { key: 'reports.export', label: 'Export Reports' },
    ],
  },
  {
    key: 'users',
    label: 'User Management',
    permissions: [
      { key: 'users.view', label: 'View Users' },
      { key: 'users.create', label: 'Create Users' },
      { key: 'users.edit', label: 'Edit Users' },
      { key: 'users.delete', label: 'Delete Users' },
    ],
  },
  {
    key: 'roles',
    label: 'Roles',
    permissions: [
      { key: 'roles.view', label: 'View Roles' },
      { key: 'roles.create', label: 'Create Roles' },
      { key: 'roles.edit', label: 'Edit Roles' },
      { key: 'roles.delete', label: 'Delete Roles' },
    ],
  },
  {
    key: 'permissions',
    label: 'Permissions',
    permissions: [
      { key: 'permissions.view', label: 'View Permissions' },
      { key: 'permissions.assign', label: 'Assign Permissions' },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    permissions: [
      { key: 'settings.view', label: 'View Settings' },
      { key: 'settings.update', label: 'Update Company Settings' },
    ],
  },
];

export const ALL_PERMISSION_KEYS = PERMISSION_MODULES.flatMap((m) => m.permissions.map((p) => p.key));

export function getModulePermissionKeys(moduleKey: string): string[] {
  const mod = PERMISSION_MODULES.find((m) => m.key === moduleKey);
  return mod?.permissions.map((p) => p.key) ?? [];
}
