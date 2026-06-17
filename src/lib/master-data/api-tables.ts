/** Maps API path segments to Firestore table keys. */
export const MASTER_TABLE_ROUTES: Record<string, string> = {
  plants: 'plants',
  shifts: 'shifts',
  departments: 'departments',
  'units-of-measure': 'unitsOfMeasure',
  'item-categories': 'itemCategories',
  items: 'items',
  warehouses: 'warehouses',
  'production-lines': 'productionLines',
  machines: 'machines',
  operations: 'operations',
  suppliers: 'suppliers',
  customers: 'customers',
  'defect-types': 'defectTypes',
  'maintenance-types': 'maintenanceTypes',
  'expense-categories': 'expenseCategories',
};

export const COLLECTION_TO_ROUTE: Record<string, string> = Object.fromEntries(
  Object.entries(MASTER_TABLE_ROUTES).map(([route, key]) => [key, route]),
);

export const MASTER_TABLE_KEYS = Object.values(MASTER_TABLE_ROUTES);

export function resolveMasterTable(routeSegment: string): string | null {
  return MASTER_TABLE_ROUTES[routeSegment] ?? null;
}

export function collectionToRoute(collectionKey: string): string | null {
  return COLLECTION_TO_ROUTE[collectionKey] ?? null;
}

export function isMasterTableKey(key: string): boolean {
  return MASTER_TABLE_KEYS.includes(key);
}
