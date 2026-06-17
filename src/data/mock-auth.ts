import type { ErpRole, ErpUser } from '@/data/types';
import { ALL_PERMISSION_KEYS } from '@/data/permission-modules';

const ADMIN_PERMISSIONS = ALL_PERMISSION_KEYS.filter(
  (k) => !k.startsWith('roles.') && !k.startsWith('permissions.'),
);

const PRODUCTION_MANAGER_PERMISSIONS = [
  'dashboard.view',
  'production.view',
  'production.create',
  'production.edit',
  'inventory.view',
  'inventory.edit',
  'maintenance.view',
  'employees.view',
  'reports.view',
  'settings.view',
];

const PLANT_SUPERVISOR_PERMISSIONS = [
  'dashboard.view',
  'production.view',
  'production.edit',
  'inventory.view',
  'maintenance.view',
  'quality.view',
  'employees.view',
];

const QUALITY_LEAD_PERMISSIONS = [
  'dashboard.view',
  'quality.view',
  'quality.inspect',
  'quality.resolve',
  'production.view',
  'reports.view',
  'reports.export',
];

const FINANCE_ANALYST_PERMISSIONS = [
  'dashboard.view',
  'finance.view',
  'finance.create',
  'finance.invoice',
  'purchasing.view',
  'sales.view',
  'reports.view',
  'reports.export',
];

const OPERATOR_PERMISSIONS = ['dashboard.view', 'production.view', 'maintenance.view'];

export const MOCK_ROLES: ErpRole[] = [
  {
    id: 'role_super_admin',
    name: 'super_admin',
    label: 'Super Admin',
    description: 'Full system access including roles and permissions management.',
    color: 'accent',
    status: 'active',
    isSystem: true,
    permissions: [...ALL_PERMISSION_KEYS],
  },
  {
    id: 'role_operations_director',
    name: 'operations_director',
    label: 'Operations Director',
    description: 'Executive access to all plant operations. Cannot modify roles or permissions.',
    color: 'success',
    status: 'active',
    isSystem: true,
    permissions: [...ADMIN_PERMISSIONS],
  },
  {
    id: 'role_production_manager',
    name: 'production_manager',
    label: 'Production Manager',
    description: 'Manages production lines, inventory, and plant workforce.',
    color: 'warning',
    status: 'active',
    isSystem: true,
    permissions: PRODUCTION_MANAGER_PERMISSIONS,
  },
  {
    id: 'role_plant_supervisor',
    name: 'plant_supervisor',
    label: 'Plant Supervisor',
    description: 'Supervises daily line operations and quality on the floor.',
    color: 'default',
    status: 'active',
    isSystem: true,
    permissions: PLANT_SUPERVISOR_PERMISSIONS,
  },
  {
    id: 'role_quality_lead',
    name: 'quality_lead',
    label: 'Quality Lead',
    description: 'Runs inspections, tracks defects, and exports quality reports.',
    color: 'default',
    status: 'active',
    isSystem: true,
    permissions: QUALITY_LEAD_PERMISSIONS,
  },
  {
    id: 'role_finance_analyst',
    name: 'finance_analyst',
    label: 'Finance Analyst',
    description: 'Handles expenses, invoices, and financial reporting.',
    color: 'default',
    status: 'active',
    isSystem: true,
    permissions: FINANCE_ANALYST_PERMISSIONS,
  },
  {
    id: 'role_operator',
    name: 'operator',
    label: 'Operator',
    description: 'Floor operator with read-only access to assigned modules.',
    color: 'muted',
    status: 'active',
    isSystem: true,
    permissions: OPERATOR_PERMISSIONS,
  },
];

export const MOCK_USERS: ErpUser[] = [
  {
    id: 'USR-DEMO',
    name: 'Demo Super Admin',
    email: 'demo@forgeos.com',
    role: 'super_admin',
    status: 'active',
    avatar: 'DS',
    department: 'Executive',
    createdAt: '2024-01-01',
  },
  {
    id: 'USR-001',
    name: 'Marcus Chen',
    email: 'marcus.chen@apexprecision.com',
    role: 'super_admin',
    status: 'active',
    avatar: 'MC',
    department: 'Executive',
    createdAt: '2024-01-15',
  },
  {
    id: 'USR-002',
    name: 'Sarah Kim',
    email: 'sarah.kim@apexprecision.com',
    role: 'production_manager',
    status: 'active',
    avatar: 'SK',
    department: 'Production',
    createdAt: '2024-02-10',
  },
  {
    id: 'USR-003',
    name: 'James Ortiz',
    email: 'james.ortiz@apexprecision.com',
    role: 'plant_supervisor',
    status: 'active',
    avatar: 'JO',
    department: 'Production',
    createdAt: '2024-03-05',
  },
  {
    id: 'USR-004',
    name: 'Lisa Nguyen',
    email: 'lisa.nguyen@apexprecision.com',
    role: 'quality_lead',
    status: 'active',
    avatar: 'LN',
    department: 'Quality Control',
    createdAt: '2024-03-18',
  },
  {
    id: 'USR-005',
    name: 'David Park',
    email: 'david.park@apexprecision.com',
    role: 'finance_analyst',
    status: 'active',
    avatar: 'DP',
    department: 'Finance',
    createdAt: '2024-04-01',
  },
  {
    id: 'USR-006',
    name: 'Elena Rossi',
    email: 'elena.rossi@apexprecision.com',
    role: 'operator',
    status: 'active',
    avatar: 'ER',
    department: 'Production',
    createdAt: '2024-05-10',
  },
];

/** Demo credentials — password123 for all demo users except super admin uses admin123 */
export const DEMO_CREDENTIALS: Record<string, string> = {
  'marcus.chen@apexprecision.com': 'admin123',
  'sarah.kim@apexprecision.com': 'manager123',
  'james.ortiz@apexprecision.com': 'supervisor123',
  'lisa.nguyen@apexprecision.com': 'quality123',
  'david.park@apexprecision.com': 'finance123',
  'elena.rossi@apexprecision.com': 'operator123',
  'demo@forgeos.com': 'demo123',
};

export const DEMO_SUPER_ADMIN_EMAIL = 'demo@forgeos.com';
export const DEMO_SUPER_ADMIN_PASSWORD = 'demo123';

export function getRoleByName(name: string, roles: ErpRole[]): ErpRole | undefined {
  return roles.find((r) => r.name === name);
}

export function slugifyRoleName(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}
