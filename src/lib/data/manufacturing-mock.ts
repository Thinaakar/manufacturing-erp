import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Boxes,
  ClipboardList,
  DollarSign,
  Factory,
  Gauge,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';

export type ModuleKpi = {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  change: number;
  icon: LucideIcon;
};

export const executiveUser = {
  name: 'Marcus Chen',
  role: 'Operations Director',
  avatar: 'MC',
  factory: 'Apex Precision Manufacturing',
};

export const dashboardHero = {
  title: 'Manufacturing Overview',
  subtitle: 'Factory Performance Summary',
  status: 'Production Active',
  statusDetail: 'Line A-3 running at 94% capacity · Shift 2 of 3',
  welcome: 'Good morning, Marcus. All critical systems are operational.',
  lastUpdated: 'Updated 2 min ago',
  date: 'Tuesday, June 16, 2026',
  shift: 'Shift 2 · Day Operations · 06:00 – 14:00',
};

export const kpiMetrics = [
  {
    id: 'production',
    label: 'Total Production',
    value: 24850,
    suffix: ' units',
    change: +12.4,
    trend: 'up' as const,
    icon: 'factory',
  },
  {
    id: 'orders',
    label: 'Active Orders',
    value: 186,
    suffix: '',
    change: +8.2,
    trend: 'up' as const,
    icon: 'clipboard',
  },
  {
    id: 'inventory',
    label: 'Inventory Value',
    value: 4.2,
    prefix: '$',
    suffix: 'M',
    change: -2.1,
    trend: 'down' as const,
    icon: 'warehouse',
  },
  {
    id: 'revenue',
    label: 'Revenue',
    value: 8.7,
    prefix: '$',
    suffix: 'M',
    change: +18.6,
    trend: 'up' as const,
    icon: 'dollar',
  },
  {
    id: 'efficiency',
    label: 'Machine Efficiency',
    value: 91.3,
    suffix: '%',
    change: +3.8,
    trend: 'up' as const,
    icon: 'gauge',
  },
  {
    id: 'workforce',
    label: 'Workforce Utilization',
    value: 87.5,
    suffix: '%',
    change: +1.2,
    trend: 'up' as const,
    icon: 'users',
  },
];

export const productionTrend = [
  { month: 'Jan', production: 18200, target: 19000 },
  { month: 'Feb', production: 19400, target: 19500 },
  { month: 'Mar', production: 20100, target: 20000 },
  { month: 'Apr', production: 21300, target: 21000 },
  { month: 'May', production: 22800, target: 22000 },
  { month: 'Jun', production: 24850, target: 24000 },
];

export const revenueAnalysis = [
  { month: 'Jan', revenue: 6.2, cost: 4.1 },
  { month: 'Feb', revenue: 6.8, cost: 4.3 },
  { month: 'Mar', revenue: 7.1, cost: 4.5 },
  { month: 'Apr', revenue: 7.6, cost: 4.7 },
  { month: 'May', revenue: 8.1, cost: 4.9 },
  { month: 'Jun', revenue: 8.7, cost: 5.1 },
];

export const inventoryMovement = [
  { week: 'W1', inbound: 4200, outbound: 3800 },
  { week: 'W2', inbound: 3900, outbound: 4100 },
  { week: 'W3', inbound: 4500, outbound: 4200 },
  { week: 'W4', inbound: 4800, outbound: 4600 },
  { week: 'W5', inbound: 5100, outbound: 4900 },
  { week: 'W6', inbound: 4700, outbound: 5200 },
];

export const machineHealth = [
  { id: 'CNC-01', name: 'CNC Mill Alpha', status: 'optimal', uptime: 98.2, load: 87 },
  { id: 'CNC-02', name: 'CNC Lathe Beta', status: 'optimal', uptime: 96.8, load: 92 },
  { id: 'ASM-01', name: 'Assembly Line A-3', status: 'warning', uptime: 89.4, load: 94 },
  { id: 'WLD-01', name: 'Robotic Welder X7', status: 'optimal', uptime: 97.1, load: 78 },
  { id: 'QC-01', name: 'Quality Scanner Q2', status: 'critical', uptime: 72.3, load: 65 },
  { id: 'PKG-01', name: 'Packaging Unit P4', status: 'optimal', uptime: 95.6, load: 81 },
];

export const productionStatus = [
  { line: 'Line A-1', product: 'Titanium Brackets', progress: 78, units: 1240, eta: '4h 20m' },
  { line: 'Line A-3', product: 'Hydraulic Valves', progress: 62, units: 890, eta: '6h 45m' },
  { line: 'Line B-2', product: 'Precision Gears', progress: 91, units: 2100, eta: '1h 15m' },
  { line: 'Line C-1', product: 'Aluminum Housings', progress: 45, units: 680, eta: '9h 30m' },
];

export const inventoryAlerts = [
  { item: 'Steel Alloy 304', sku: 'RM-ST-304', level: 12, threshold: 25, severity: 'critical' },
  { item: 'Hydraulic Fluid HFX-9', sku: 'RM-HF-009', level: 18, threshold: 30, severity: 'warning' },
  { item: 'Titanium Sheet 2mm', sku: 'RM-TI-002', level: 22, threshold: 35, severity: 'warning' },
  { item: 'Bearing Assembly BA-440', sku: 'RM-BA-440', level: 8, threshold: 20, severity: 'critical' },
];

export const recentProductionOrders = [
  { id: 'PO-2847', product: 'Aerospace Valve Assembly', qty: 500, line: 'A-3', status: 'In Progress', due: 'Jun 22' },
  { id: 'PO-2846', product: 'Industrial Pump Housing', qty: 1200, line: 'B-2', status: 'In Progress', due: 'Jun 21' },
  { id: 'PO-2845', product: 'Precision Gear Set GS-88', qty: 800, line: 'A-1', status: 'Quality Check', due: 'Jun 20' },
  { id: 'PO-2844', product: 'Hydraulic Cylinder HC-12', qty: 350, line: 'C-1', status: 'Scheduled', due: 'Jun 24' },
  { id: 'PO-2843', product: 'Titanium Bracket TB-44', qty: 2000, line: 'A-1', status: 'Completed', due: 'Jun 18' },
];

export const activeManufacturingJobs = [
  { id: 'JOB-9012', operation: 'CNC Milling', machine: 'CNC-01', operator: 'Sarah Kim', shift: 'Shift 2', efficiency: 94 },
  { id: 'JOB-9011', operation: 'Assembly', machine: 'ASM-01', operator: 'James Ortiz', shift: 'Shift 2', efficiency: 88 },
  { id: 'JOB-9010', operation: 'Welding', machine: 'WLD-01', operator: 'David Park', shift: 'Shift 2', efficiency: 96 },
  { id: 'JOB-9009', operation: 'Quality Inspection', machine: 'QC-01', operator: 'Lisa Nguyen', shift: 'Shift 2', efficiency: 72 },
];

export const inventoryWarnings = [
  { sku: 'RM-ST-304', item: 'Steel Alloy 304', warehouse: 'WH-A', daysLeft: 3, action: 'Reorder Now' },
  { sku: 'RM-BA-440', item: 'Bearing Assembly BA-440', warehouse: 'WH-B', daysLeft: 2, action: 'Urgent PO' },
  { sku: 'RM-HF-009', item: 'Hydraulic Fluid HFX-9', warehouse: 'WH-A', daysLeft: 5, action: 'Schedule PO' },
];

export const dashboardWidgets = {
  topLine: {
    name: 'Assembly Line A-3',
    efficiency: 94.2,
    output: '890 units/shift',
    trend: +5.4,
  },
  maintenance: [
    { machine: 'QC Scanner Q2', issue: 'Calibration overdue', priority: 'high', due: 'Today' },
    { machine: 'CNC Lathe Beta', issue: 'Scheduled maintenance', priority: 'medium', due: 'Jun 20' },
  ],
  qualityScore: { score: 97.8, defects: 12, inspected: 5420 },
  delivery: { onTime: 94.6, late: 5.4, avgDelay: '1.2 days' },
};

export const reportAnalytics = [
  { label: 'Monthly Production', value: 24850, change: +12.4, unit: 'units' },
  { label: 'Revenue Performance', value: 8.7, change: +18.6, unit: '$M' },
  { label: 'Inventory Utilization', value: 78.4, change: -2.1, unit: '%' },
  { label: 'Machine Uptime', value: 93.2, change: +3.8, unit: '%' },
];

export const reportProductionChart = [
  { month: 'Jan', actual: 18200, planned: 19000, efficiency: 95.8 },
  { month: 'Feb', actual: 19400, planned: 19500, efficiency: 99.5 },
  { month: 'Mar', actual: 20100, planned: 20000, efficiency: 100.5 },
  { month: 'Apr', actual: 21300, planned: 21000, efficiency: 101.4 },
  { month: 'May', actual: 22800, planned: 22000, efficiency: 103.6 },
  { month: 'Jun', actual: 24850, planned: 24000, efficiency: 103.5 },
];

export const reportRevenueChart = [
  { month: 'Jan', gross: 6.2, net: 2.1, margin: 33.9 },
  { month: 'Feb', gross: 6.8, net: 2.5, margin: 36.8 },
  { month: 'Mar', gross: 7.1, net: 2.6, margin: 36.6 },
  { month: 'Apr', gross: 7.6, net: 2.9, margin: 38.2 },
  { month: 'May', gross: 8.1, net: 3.2, margin: 39.5 },
  { month: 'Jun', gross: 8.7, net: 3.6, margin: 41.4 },
];

export const reportInventoryChart = [
  { category: 'Raw Materials', value: 42, fill: '#14B8A6' },
  { category: 'WIP', value: 28, fill: '#0F766E' },
  { category: 'Finished Goods', value: 22, fill: '#2DD4BF' },
  { category: 'Spare Parts', value: 8, fill: '#94A3B8' },
];

export const productionSummary = [
  { line: 'Line A-1', planned: 4200, actual: 4380, variance: +4.3, efficiency: 96.2 },
  { line: 'Line A-3', planned: 3800, actual: 3920, variance: +3.2, efficiency: 94.8 },
  { line: 'Line B-2', planned: 5100, actual: 5240, variance: +2.7, efficiency: 97.1 },
  { line: 'Line C-1', planned: 2900, actual: 2680, variance: -7.6, efficiency: 88.4 },
];

export const inventorySummary = [
  { category: 'Raw Materials', value: '$1.76M', turnover: 4.2, status: 'Normal' },
  { category: 'Work in Progress', value: '$1.18M', turnover: 8.6, status: 'Normal' },
  { category: 'Finished Goods', value: '$0.92M', turnover: 6.1, status: 'High' },
  { category: 'Spare Parts', value: '$0.34M', turnover: 2.8, status: 'Low' },
];

export const performanceSummary = [
  { metric: 'Overall Equipment Effectiveness', value: '87.4%', target: '85%', status: 'Above Target' },
  { metric: 'First Pass Yield', value: '96.8%', target: '95%', status: 'Above Target' },
  { metric: 'On-Time Delivery', value: '94.6%', target: '95%', status: 'Below Target' },
  { metric: 'Scrap Rate', value: '1.8%', target: '2%', status: 'Above Target' },
];

export const utilityPanelData = {
  shift: {
    name: 'Shift 2 · Day Operations',
    plant: 'Apex Precision · Plant 01',
    elapsed: '4h 32m',
  },
  plantLoad: [
    { label: 'Production Lines', value: 94 },
    { label: 'Assembly', value: 87 },
    { label: 'Logistics', value: 72 },
  ],
  alerts: [
    { id: '1', title: 'QC Scanner calibration overdue', severity: 'critical' as const, time: '12 min ago' },
    { id: '2', title: 'Steel Alloy 304 below threshold', severity: 'warning' as const, time: '28 min ago' },
    { id: '3', title: 'Line C-1 running below target', severity: 'warning' as const, time: '45 min ago' },
  ],
  oee: 87.4,
};

export const productionModule = {
  header: {
    badge: 'Production Control',
    title: 'Production Operations',
    subtitle: 'Orders, schedules & line tracking',
    description: 'Monitor work orders, production schedules, and real-time line performance across all manufacturing facilities.',
    meta: [
      { label: 'Active Lines', value: '12 of 14' },
      { label: 'Today Output', value: '4,280 units' },
      { label: 'Schedule Adherence', value: '96.2%' },
    ],
  },
  kpis: [
    { id: 'orders', label: 'Production Orders', value: 42, suffix: '', change: 6.4, icon: ClipboardList },
    { id: 'work', label: 'Active Work Orders', value: 186, suffix: '', change: 8.2, icon: Factory },
    { id: 'efficiency', label: 'Line Efficiency', value: 94.8, suffix: '%', change: 2.1, icon: Gauge },
    { id: 'output', label: 'Daily Output', value: 4280, suffix: ' units', change: 5.6, icon: Activity },
  ] satisfies ModuleKpi[],
  orders: [
    { id: 'PO-2847', product: 'Aerospace Valve Assembly', qty: 500, line: 'A-3', status: 'In Progress', due: 'Jun 22' },
    { id: 'PO-2846', product: 'Industrial Pump Housing', qty: 1200, line: 'B-2', status: 'In Progress', due: 'Jun 21' },
    { id: 'PO-2845', product: 'Precision Gear Set GS-88', qty: 800, line: 'A-1', status: 'Quality Check', due: 'Jun 20' },
    { id: 'PO-2844', product: 'Hydraulic Cylinder HC-12', qty: 350, line: 'C-1', status: 'Scheduled', due: 'Jun 24' },
    { id: 'PO-2842', product: 'Carbon Fiber Panel CF-22', qty: 640, line: 'B-1', status: 'In Progress', due: 'Jun 23' },
  ],
  workOrders: [
    { id: 'WO-7821', operation: 'CNC Milling', machine: 'CNC-01', operator: 'Sarah Kim', shift: 'Shift 2', status: 'Active' },
    { id: 'WO-7820', operation: 'Assembly', machine: 'ASM-01', operator: 'James Ortiz', shift: 'Shift 2', status: 'Active' },
    { id: 'WO-7819', operation: 'Welding', machine: 'WLD-01', operator: 'David Park', shift: 'Shift 2', status: 'Active' },
    { id: 'WO-7818', operation: 'Surface Treatment', machine: 'SFT-02', operator: 'Elena Rossi', shift: 'Shift 2', status: 'Pending' },
  ],
  schedule: [
    { line: 'Line A-1', shift: 'Shift 2', product: 'Titanium Brackets', start: '06:00', end: '14:00', load: 94 },
    { line: 'Line A-3', shift: 'Shift 2', product: 'Hydraulic Valves', start: '06:00', end: '14:00', load: 88 },
    { line: 'Line B-2', shift: 'Shift 2', product: 'Precision Gears', start: '06:00', end: '14:00', load: 91 },
    { line: 'Line C-1', shift: 'Shift 2', product: 'Aluminum Housings', start: '06:00', end: '14:00', load: 76 },
  ],
  tracking: [
    { hour: '06:00', planned: 420, actual: 398 },
    { hour: '08:00', planned: 840, actual: 812 },
    { hour: '10:00', planned: 1260, actual: 1248 },
    { hour: '12:00', planned: 1680, actual: 1692 },
    { hour: '14:00', planned: 2100, actual: 2140 },
  ],
};

export const inventoryModule = {
  header: {
    badge: 'Inventory Control',
    title: 'Inventory Management',
    subtitle: 'Raw materials, finished goods & warehouses',
    description: 'Track stock levels, warehouse utilization, and inventory movement across all storage facilities.',
    meta: [
      { label: 'Total SKUs', value: '2,847' },
      { label: 'Warehouses', value: '4 Active' },
      { label: 'Stock Value', value: '$4.2M' },
    ],
  },
  kpis: [
    { id: 'value', label: 'Inventory Value', value: 4.2, prefix: '$', suffix: 'M', change: -2.1, icon: DollarSign },
    { id: 'raw', label: 'Raw Materials', value: 1240, suffix: ' SKUs', change: 1.4, icon: Package },
    { id: 'finished', label: 'Finished Goods', value: 680, suffix: ' SKUs', change: 3.8, icon: Boxes },
    { id: 'turnover', label: 'Turnover Rate', value: 6.4, suffix: 'x', decimals: 1, change: 0.8, icon: TrendingUp },
  ] satisfies ModuleKpi[],
  rawMaterials: [
    { sku: 'RM-ST-304', item: 'Steel Alloy 304', qty: 1240, unit: 'kg', warehouse: 'WH-A', status: 'Critical' },
    { sku: 'RM-TI-002', item: 'Titanium Sheet 2mm', qty: 860, unit: 'sheets', warehouse: 'WH-A', status: 'Normal' },
    { sku: 'RM-HF-009', item: 'Hydraulic Fluid HFX-9', qty: 420, unit: 'L', warehouse: 'WH-B', status: 'Warning' },
    { sku: 'RM-BA-440', item: 'Bearing Assembly BA-440', qty: 180, unit: 'units', warehouse: 'WH-B', status: 'Critical' },
  ],
  finishedGoods: [
    { sku: 'FG-AV-101', item: 'Aerospace Valve Assembly', qty: 240, unit: 'units', warehouse: 'WH-C', status: 'Normal' },
    { sku: 'FG-PG-088', item: 'Precision Gear Set GS-88', qty: 520, unit: 'sets', warehouse: 'WH-C', status: 'High' },
    { sku: 'FG-HC-012', item: 'Hydraulic Cylinder HC-12', qty: 86, unit: 'units', warehouse: 'WH-D', status: 'Normal' },
  ],
  warehouses: [
    { id: 'WH-A', name: 'Raw Materials Hub', capacity: 85, items: 1240, location: 'Building A' },
    { id: 'WH-B', name: 'Component Storage', capacity: 72, items: 890, location: 'Building B' },
    { id: 'WH-C', name: 'Finished Goods Center', capacity: 68, items: 680, location: 'Building C' },
    { id: 'WH-D', name: 'Distribution Buffer', capacity: 54, items: 420, location: 'Logistics Wing' },
  ],
  stockTrend: [
    { week: 'W1', raw: 4200, finished: 2800 },
    { week: 'W2', raw: 3900, finished: 3100 },
    { week: 'W3', raw: 4500, finished: 2900 },
    { week: 'W4', raw: 4800, finished: 3400 },
    { week: 'W5', raw: 5100, finished: 3600 },
    { week: 'W6', raw: 4700, finished: 3800 },
  ],
};

export const purchasingModule = {
  header: {
    badge: 'Procurement',
    title: 'Purchasing & Suppliers',
    subtitle: 'Purchase orders & procurement pipeline',
    description: 'Manage supplier relationships, purchase orders, and procurement status across the supply chain.',
    meta: [
      { label: 'Active POs', value: '28' },
      { label: 'Pending Approval', value: '6' },
      { label: 'Avg Lead Time', value: '12.4 days' },
    ],
  },
  kpis: [
    { id: 'pos', label: 'Open POs', value: 28, suffix: '', change: 4.2, icon: ShoppingCart },
    { id: 'spend', label: 'Monthly Spend', value: 1.8, prefix: '$', suffix: 'M', change: 6.8, icon: DollarSign },
    { id: 'suppliers', label: 'Active Suppliers', value: 64, suffix: '', change: 2.0, icon: Factory },
    { id: 'onTime', label: 'On-Time Delivery', value: 91.2, suffix: '%', change: 1.4, icon: TrendingUp },
  ] satisfies ModuleKpi[],
  suppliers: [
    { id: 'SUP-001', name: 'Titan Metals Corp', category: 'Raw Materials', rating: 4.8, orders: 42, status: 'Preferred' },
    { id: 'SUP-014', name: 'Precision Components Ltd', category: 'Components', rating: 4.6, orders: 28, status: 'Active' },
    { id: 'SUP-022', name: 'Global Hydraulics Inc', category: 'Fluids & Lubricants', rating: 4.2, orders: 16, status: 'Active' },
    { id: 'SUP-031', name: 'EuroBearings AG', category: 'Bearings', rating: 3.9, orders: 12, status: 'Review' },
  ],
  purchaseOrders: [
    { id: 'PUR-4401', supplier: 'Titan Metals Corp', items: 'Steel Alloy 304', amount: '$48,200', status: 'Approved', eta: 'Jun 19' },
    { id: 'PUR-4400', supplier: 'EuroBearings AG', items: 'Bearing Assembly BA-440', amount: '$12,800', status: 'Pending', eta: 'Jun 21' },
    { id: 'PUR-4399', supplier: 'Global Hydraulics Inc', items: 'Hydraulic Fluid HFX-9', amount: '$6,400', status: 'In Transit', eta: 'Jun 18' },
    { id: 'PUR-4398', supplier: 'Precision Components Ltd', items: 'CNC Tooling Set', amount: '$24,600', status: 'Approved', eta: 'Jun 22' },
  ],
  procurementTrend: [
    { month: 'Jan', spend: 1.2, savings: 0.08 },
    { month: 'Feb', spend: 1.4, savings: 0.1 },
    { month: 'Mar', spend: 1.5, savings: 0.12 },
    { month: 'Apr', spend: 1.6, savings: 0.14 },
    { month: 'May', spend: 1.7, savings: 0.16 },
    { month: 'Jun', spend: 1.8, savings: 0.18 },
  ],
};

export const salesModule = {
  header: {
    badge: 'Commercial Operations',
    title: 'Sales & Revenue',
    subtitle: 'Customers, orders & revenue tracking',
    description: 'Track customer orders, revenue performance, and commercial pipeline across all market segments.',
    meta: [
      { label: 'Active Customers', value: '148' },
      { label: 'Open Orders', value: '$2.4M' },
      { label: 'Win Rate', value: '68.4%' },
    ],
  },
  kpis: [
    { id: 'revenue', label: 'Monthly Revenue', value: 8.7, prefix: '$', suffix: 'M', change: 18.6, icon: DollarSign },
    { id: 'orders', label: 'Open Orders', value: 94, suffix: '', change: 12.4, icon: ClipboardList },
    { id: 'customers', label: 'Active Customers', value: 148, suffix: '', change: 4.8, icon: Users },
    { id: 'pipeline', label: 'Pipeline Value', value: 12.4, prefix: '$', suffix: 'M', change: 22.1, icon: TrendingUp },
  ] satisfies ModuleKpi[],
  customers: [
    { id: 'CUS-001', name: 'AeroTech Industries', segment: 'Aerospace', orders: 24, revenue: '$1.2M', status: 'Active' },
    { id: 'CUS-018', name: 'Meridian Automotive', segment: 'Automotive', orders: 18, revenue: '$840K', status: 'Active' },
    { id: 'CUS-042', name: 'Pacific Energy Systems', segment: 'Energy', orders: 12, revenue: '$620K', status: 'Active' },
    { id: 'CUS-067', name: 'Nova Robotics Ltd', segment: 'Robotics', orders: 8, revenue: '$380K', status: 'Prospect' },
  ],
  orders: [
    { id: 'SO-8821', customer: 'AeroTech Industries', product: 'Aerospace Valve Assembly', value: '$420K', status: 'In Production', due: 'Jun 28' },
    { id: 'SO-8820', customer: 'Meridian Automotive', product: 'Precision Gear Set GS-88', value: '$186K', status: 'Confirmed', due: 'Jul 02' },
    { id: 'SO-8819', customer: 'Pacific Energy Systems', product: 'Hydraulic Cylinder HC-12', value: '$94K', status: 'Shipped', due: 'Jun 16' },
    { id: 'SO-8818', customer: 'Nova Robotics Ltd', product: 'Carbon Fiber Panel CF-22', value: '$128K', status: 'Quote', due: 'Jul 10' },
  ],
  revenueTrend: [
    { month: 'Jan', revenue: 6.2, target: 5.8 },
    { month: 'Feb', revenue: 6.8, target: 6.4 },
    { month: 'Mar', revenue: 7.1, target: 6.8 },
    { month: 'Apr', revenue: 7.6, target: 7.2 },
    { month: 'May', revenue: 8.1, target: 7.8 },
    { month: 'Jun', revenue: 8.7, target: 8.2 },
  ],
};

export const maintenanceModule = {
  header: {
    badge: 'Asset Management',
    title: 'Maintenance & Equipment',
    subtitle: 'Machines, monitoring & service calendar',
    description: 'Monitor machine health, schedule preventive maintenance, and track equipment performance across the plant.',
    meta: [
      { label: 'Total Machines', value: '86' },
      { label: 'Scheduled Today', value: '4 tasks' },
      { label: 'Avg Uptime', value: '93.2%' },
    ],
  },
  kpis: [
    { id: 'uptime', label: 'Machine Uptime', value: 93.2, suffix: '%', change: 3.8, icon: Gauge },
    { id: 'scheduled', label: 'Scheduled Tasks', value: 18, suffix: '', change: -4.2, icon: Wrench },
    { id: 'critical', label: 'Critical Alerts', value: 2, suffix: '', change: -50, icon: Activity },
    { id: 'mtbf', label: 'MTBF', value: 840, suffix: ' hrs', change: 6.2, icon: Factory },
  ] satisfies ModuleKpi[],
  machines: machineHealth,
  calendar: [
    { id: 'MNT-101', machine: 'QC Scanner Q2', type: 'Calibration', date: 'Jun 16', technician: 'Mike Torres', status: 'Overdue' },
    { id: 'MNT-102', machine: 'CNC Lathe Beta', type: 'Preventive', date: 'Jun 20', technician: 'Anna Weber', status: 'Scheduled' },
    { id: 'MNT-103', machine: 'Robotic Welder X7', type: 'Inspection', date: 'Jun 22', technician: 'Carlos Mendez', status: 'Scheduled' },
    { id: 'MNT-104', machine: 'Packaging Unit P4', type: 'Lubrication', date: 'Jun 24', technician: 'Mike Torres', status: 'Scheduled' },
  ],
  monitoring: [
    { week: 'W1', uptime: 91.2, downtime: 8.8 },
    { week: 'W2', uptime: 92.4, downtime: 7.6 },
    { week: 'W3', uptime: 91.8, downtime: 8.2 },
    { week: 'W4', uptime: 93.1, downtime: 6.9 },
    { week: 'W5', uptime: 93.6, downtime: 6.4 },
    { week: 'W6', uptime: 93.2, downtime: 6.8 },
  ],
};

export const employeesModule = {
  header: {
    badge: 'Workforce Management',
    title: 'Employees & Attendance',
    subtitle: 'Workforce overview & shift attendance',
    description: 'Monitor workforce utilization, shift attendance, and department staffing across all manufacturing operations.',
    meta: [
      { label: 'Total Staff', value: '842' },
      { label: 'On Shift Now', value: '286' },
      { label: 'Attendance Rate', value: '96.8%' },
    ],
  },
  kpis: [
    { id: 'staff', label: 'Total Employees', value: 842, suffix: '', change: 2.4, icon: Users },
    { id: 'utilization', label: 'Utilization', value: 87.5, suffix: '%', change: 1.2, icon: Gauge },
    { id: 'attendance', label: 'Attendance Rate', value: 96.8, suffix: '%', change: 0.6, icon: Activity },
    { id: 'overtime', label: 'Overtime Hours', value: 1240, suffix: ' hrs', change: -3.2, icon: Factory },
  ] satisfies ModuleKpi[],
  departments: [
    { name: 'Production', headcount: 420, present: 398, utilization: 91.2, shift: 'Shift 2' },
    { name: 'Quality Control', headcount: 86, present: 82, utilization: 88.4, shift: 'Shift 2' },
    { name: 'Maintenance', headcount: 64, present: 58, utilization: 84.6, shift: 'Shift 2' },
    { name: 'Logistics', headcount: 112, present: 108, utilization: 86.2, shift: 'Shift 2' },
  ],
  attendance: [
    { id: 'EMP-1042', name: 'Sarah Kim', department: 'Production', shift: 'Shift 2', status: 'Present', hours: '6h 32m' },
    { id: 'EMP-0891', name: 'James Ortiz', department: 'Production', shift: 'Shift 2', status: 'Present', hours: '6h 28m' },
    { id: 'EMP-0764', name: 'Lisa Nguyen', department: 'Quality Control', shift: 'Shift 2', status: 'Present', hours: '6h 15m' },
    { id: 'EMP-0623', name: 'David Park', department: 'Production', shift: 'Shift 2', status: 'Late', hours: '5h 48m' },
  ],
  workforceTrend: [
    { month: 'Jan', utilization: 84.2, attendance: 95.8 },
    { month: 'Feb', utilization: 85.1, attendance: 96.2 },
    { month: 'Mar', utilization: 86.4, attendance: 96.4 },
    { month: 'Apr', utilization: 86.8, attendance: 96.6 },
    { month: 'May', utilization: 87.2, attendance: 96.5 },
    { month: 'Jun', utilization: 87.5, attendance: 96.8 },
  ],
};

export const qualityModule = {
  header: {
    badge: 'Quality Assurance',
    title: 'Quality Control',
    subtitle: 'Inspections, checks & defect tracking',
    description: 'Monitor quality checks, defect reports, and first-pass yield across all production lines and products.',
    meta: [
      { label: 'Quality Score', value: '97.8%' },
      { label: 'Inspected Today', value: '5,420 units' },
      { label: 'Open Defects', value: '12' },
    ],
  },
  kpis: [
    { id: 'score', label: 'Quality Score', value: 97.8, suffix: '%', change: 0.4, icon: Gauge },
    { id: 'yield', label: 'First Pass Yield', value: 96.8, suffix: '%', change: 1.2, icon: Activity },
    { id: 'defects', label: 'Defect Rate', value: 1.8, suffix: '%', change: -0.3, icon: ClipboardList },
    { id: 'inspected', label: 'Units Inspected', value: 5420, suffix: '', change: 8.6, icon: Factory },
  ] satisfies ModuleKpi[],
  checks: [
    { id: 'QC-4401', product: 'Aerospace Valve Assembly', line: 'A-3', inspector: 'Lisa Nguyen', result: 'Pass', score: 98.2 },
    { id: 'QC-4400', product: 'Precision Gear Set GS-88', line: 'A-1', inspector: 'Tom Bradley', result: 'Pass', score: 97.6 },
    { id: 'QC-4399', product: 'Hydraulic Cylinder HC-12', line: 'C-1', inspector: 'Lisa Nguyen', result: 'Review', score: 92.4 },
    { id: 'QC-4398', product: 'Industrial Pump Housing', line: 'B-2', inspector: 'Tom Bradley', result: 'Pass', score: 99.1 },
  ],
  defects: [
    { id: 'DEF-881', product: 'Hydraulic Valves', type: 'Surface Finish', severity: 'Medium', qty: 4, status: 'Open' },
    { id: 'DEF-880', product: 'Precision Gears', type: 'Dimensional', severity: 'High', qty: 2, status: 'Open' },
    { id: 'DEF-879', product: 'Aluminum Housings', type: 'Coating', severity: 'Low', qty: 6, status: 'Resolved' },
  ],
  qualityTrend: [
    { week: 'W1', score: 96.8, defects: 18 },
    { week: 'W2', score: 97.2, defects: 16 },
    { week: 'W3', score: 97.4, defects: 14 },
    { week: 'W4', score: 97.6, defects: 13 },
    { week: 'W5', score: 97.7, defects: 12 },
    { week: 'W6', score: 97.8, defects: 12 },
  ],
};

export const financeModule = {
  header: {
    badge: 'Financial Operations',
    title: 'Finance Overview',
    subtitle: 'Expenses, invoices & financial performance',
    description: 'Track expenses, invoices, and financial performance with executive-level visibility into manufacturing economics.',
    meta: [
      { label: 'Net Margin', value: '41.4%' },
      { label: 'Outstanding AR', value: '$1.8M' },
      { label: 'Monthly Burn', value: '$5.1M' },
    ],
  },
  kpis: [
    { id: 'revenue', label: 'Revenue', value: 8.7, prefix: '$', suffix: 'M', change: 18.6, icon: DollarSign },
    { id: 'expenses', label: 'Expenses', value: 5.1, prefix: '$', suffix: 'M', change: 4.2, icon: Wallet },
    { id: 'margin', label: 'Net Margin', value: 41.4, suffix: '%', change: 2.8, icon: TrendingUp },
    { id: 'invoices', label: 'Open Invoices', value: 34, suffix: '', change: -8.4, icon: ClipboardList },
  ] satisfies ModuleKpi[],
  expenses: [
    { id: 'EXP-2201', category: 'Raw Materials', vendor: 'Titan Metals Corp', amount: '$48,200', date: 'Jun 14', status: 'Paid' },
    { id: 'EXP-2200', category: 'Utilities', vendor: 'GridPower Energy', amount: '$12,400', date: 'Jun 12', status: 'Paid' },
    { id: 'EXP-2199', category: 'Maintenance', vendor: 'TechServ Industrial', amount: '$8,600', date: 'Jun 10', status: 'Pending' },
    { id: 'EXP-2198', category: 'Logistics', vendor: 'FastFreight Global', amount: '$6,200', date: 'Jun 08', status: 'Paid' },
  ],
  invoices: [
    { id: 'INV-4401', customer: 'AeroTech Industries', amount: '$420,000', due: 'Jun 28', status: 'Pending' },
    { id: 'INV-4400', customer: 'Meridian Automotive', amount: '$186,000', due: 'Jul 02', status: 'Pending' },
    { id: 'INV-4399', customer: 'Pacific Energy Systems', amount: '$94,000', due: 'Jun 16', status: 'Paid' },
  ],
  financialTrend: revenueAnalysis,
};

export const settingsModule = {
  header: {
    badge: 'System Configuration',
    title: 'Settings',
    subtitle: 'Users, roles & company configuration',
    description: 'Manage user access, role permissions, and company-wide configuration for the ForgeOS platform.',
    meta: [
      { label: 'Active Users', value: '48' },
      { label: 'Roles', value: '6' },
      { label: 'Plants', value: '3' },
    ],
  },
  users: [
    { id: 'USR-001', name: 'Marcus Chen', email: 'm.chen@apexprecision.com', role: 'Operations Director', status: 'Active' },
    { id: 'USR-002', name: 'Sarah Kim', email: 's.kim@apexprecision.com', role: 'Production Manager', status: 'Active' },
    { id: 'USR-003', name: 'Lisa Nguyen', email: 'l.nguyen@apexprecision.com', role: 'Quality Lead', status: 'Active' },
    { id: 'USR-004', name: 'James Ortiz', email: 'j.ortiz@apexprecision.com', role: 'Plant Supervisor', status: 'Active' },
  ],
  roles: [
    { role: 'Operations Director', users: 2, permissions: 'Full Access', level: 'Executive' },
    { role: 'Production Manager', users: 6, permissions: 'Production + Inventory', level: 'Manager' },
    { role: 'Quality Lead', users: 4, permissions: 'Quality + Reports', level: 'Manager' },
    { role: 'Plant Supervisor', users: 12, permissions: 'Production View', level: 'Supervisor' },
    { role: 'Operator', users: 420, permissions: 'Work Orders Only', level: 'Operator' },
    { role: 'Finance Analyst', users: 4, permissions: 'Finance + Reports', level: 'Analyst' },
  ],
  company: [
    { setting: 'Company Name', value: 'Apex Precision Manufacturing' },
    { setting: 'Primary Plant', value: 'Plant 01 — Detroit, MI' },
    { setting: 'Fiscal Year Start', value: 'January 1' },
    { setting: 'Default Currency', value: 'USD ($)' },
    { setting: 'Time Zone', value: 'America/Detroit (EST)' },
    { setting: 'Shift Model', value: '3 Shifts · 8 Hours' },
  ],
};

