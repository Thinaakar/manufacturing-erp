export type HubTab = {
  id: string;
  label: string;
  permission: string;
};

export const HUB_TABS: Record<string, HubTab[]> = {
  '/operations': [
    { id: 'production', label: 'Production', permission: 'production.view' },
    { id: 'maintenance', label: 'Maintenance', permission: 'maintenance.view' },
    { id: 'quality', label: 'Quality Control', permission: 'quality.view' },
  ],
  '/supply-chain': [
    { id: 'inventory', label: 'Inventory', permission: 'inventory.view' },
    { id: 'purchasing', label: 'Purchasing', permission: 'purchasing.view' },
    { id: 'sales', label: 'Sales', permission: 'sales.view' },
  ],
};

export const NAV_ALIASES: Record<string, string[]> = {
  '/operations': ['/production', '/maintenance', '/quality'],
  '/supply-chain': ['/inventory', '/purchasing', '/sales'],
};

export const LEGACY_HUB_PATHS: Record<string, string> = {
  '/production': '/operations',
  '/maintenance': '/operations',
  '/quality': '/operations',
  '/inventory': '/supply-chain',
  '/purchasing': '/supply-chain',
  '/sales': '/supply-chain',
};

export const LEGACY_HUB_TABS: Record<string, string> = {
  '/production': 'production',
  '/maintenance': 'maintenance',
  '/quality': 'quality',
  '/inventory': 'inventory',
  '/purchasing': 'purchasing',
  '/sales': 'sales',
};
