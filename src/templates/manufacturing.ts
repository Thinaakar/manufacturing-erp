export type TemplateFieldType = 'string' | 'number' | 'boolean' | 'timestamp' | 'reference';

export type TemplateField = {
  key: string;
  label: string;
  type: TemplateFieldType;
  required?: boolean;
  refTable?: string;
};

export type TemplateTable = {
  key: string;
  label: string;
  order: number;
  fields: TemplateField[];
};

const ts = (): TemplateField[] => [
  { key: 'createdAt', label: 'Created', type: 'timestamp', required: true },
  { key: 'updatedAt', label: 'Updated', type: 'timestamp', required: true },
];

const statusField = (): TemplateField => ({
  key: 'status',
  label: 'Status',
  type: 'string',
  required: true,
});

/** ForgeOS Manufacturing — Firestore tables under templates/manufacturing/tables/{key}/records */
export const appTemplate = {
  key: 'manufacturing',
  label: 'Manufacturing ERP',
  tables: [
    {
      key: 'companySettings',
      label: 'Company Settings',
      order: 5,
      fields: [
        { key: 'companyName', label: 'Company Name', type: 'string', required: true },
        { key: 'primaryPlantId', label: 'Primary Plant', type: 'reference', refTable: 'plants', required: true },
        { key: 'fiscalYearStart', label: 'Fiscal Year Start', type: 'string', required: true },
        { key: 'currency', label: 'Currency', type: 'string', required: true },
        { key: 'timeZone', label: 'Time Zone', type: 'string', required: true },
        { key: 'shiftModel', label: 'Shift Model', type: 'string', required: true },
        ...ts(),
      ],
    },
    {
      key: 'users',
      label: 'Users',
      order: 10,
      fields: [
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'email', label: 'Email', type: 'string', required: true },
        { key: 'role', label: 'Role', type: 'reference', refTable: 'roles', required: true },
        statusField(),
        { key: 'avatar', label: 'Avatar', type: 'string' },
        { key: 'department', label: 'Department', type: 'reference', refTable: 'departments' },
        { key: 'passwordHash', label: 'Password Hash', type: 'string', required: true },
        ...ts(),
      ],
    },
    {
      key: 'roles',
      label: 'Roles',
      order: 20,
      fields: [
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'label', label: 'Label', type: 'string', required: true },
        { key: 'description', label: 'Description', type: 'string', required: true },
        { key: 'permissions', label: 'Permissions', type: 'string' },
        { key: 'color', label: 'Color', type: 'string' },
        statusField(),
        { key: 'isSystem', label: 'System Role', type: 'boolean' },
        ...ts(),
      ],
    },
    {
      key: 'plants',
      label: 'Plants',
      order: 30,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'location', label: 'Location', type: 'string', required: true },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'shifts',
      label: 'Shifts',
      order: 40,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'startTime', label: 'Start Time', type: 'string', required: true },
        { key: 'endTime', label: 'End Time', type: 'string', required: true },
        { key: 'plantId', label: 'Plant', type: 'reference', refTable: 'plants', required: true },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'departments',
      label: 'Departments',
      order: 50,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'unitsOfMeasure',
      label: 'Units of Measure',
      order: 60,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'itemCategories',
      label: 'Item Categories',
      order: 70,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'type', label: 'Type', type: 'string', required: true },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'items',
      label: 'Items',
      order: 80,
      fields: [
        { key: 'sku', label: 'SKU', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'categoryId', label: 'Category', type: 'reference', refTable: 'itemCategories', required: true },
        { key: 'type', label: 'Type', type: 'string', required: true },
        { key: 'unitId', label: 'Unit', type: 'reference', refTable: 'unitsOfMeasure', required: true },
        { key: 'reorderLevel', label: 'Reorder Level', type: 'number' },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'warehouses',
      label: 'Warehouses',
      order: 90,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'plantId', label: 'Plant', type: 'reference', refTable: 'plants', required: true },
        { key: 'location', label: 'Location', type: 'string', required: true },
        { key: 'capacity', label: 'Capacity', type: 'number' },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'productionLines',
      label: 'Production Lines',
      order: 100,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'plantId', label: 'Plant', type: 'reference', refTable: 'plants', required: true },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'machines',
      label: 'Machines',
      order: 110,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'lineId', label: 'Line', type: 'reference', refTable: 'productionLines', required: true },
        { key: 'plantId', label: 'Plant', type: 'reference', refTable: 'plants', required: true },
        { key: 'type', label: 'Type', type: 'string', required: true },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'operations',
      label: 'Operations',
      order: 120,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'description', label: 'Description', type: 'string' },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'suppliers',
      label: 'Suppliers',
      order: 130,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'category', label: 'Category', type: 'string', required: true },
        { key: 'email', label: 'Email', type: 'string' },
        { key: 'phone', label: 'Phone', type: 'string' },
        { key: 'rating', label: 'Rating', type: 'number' },
        { key: 'leadTimeDays', label: 'Lead Time Days', type: 'number' },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'customers',
      label: 'Customers',
      order: 140,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'segment', label: 'Segment', type: 'string', required: true },
        { key: 'email', label: 'Email', type: 'string' },
        { key: 'phone', label: 'Phone', type: 'string' },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'defectTypes',
      label: 'Defect Types',
      order: 150,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'severityDefault', label: 'Default Severity', type: 'string', required: true },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'maintenanceTypes',
      label: 'Maintenance Types',
      order: 160,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'expenseCategories',
      label: 'Expense Categories',
      order: 170,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        statusField(),
        ...ts(),
      ],
    },
    {
      key: 'appAssets',
      label: 'App Assets',
      order: 180,
      fields: [
        { key: 'url', label: 'URL', type: 'string', required: true },
        { key: 'contentType', label: 'Content Type', type: 'string' },
        { key: 'path', label: 'Storage Path', type: 'string' },
        ...ts(),
      ],
    },
  ],
} as const;

export type AppTableKey = (typeof appTemplate.tables)[number]['key'];
