export type RecordStatus = 'active' | 'inactive';

export interface CompanySettings {
  companyName: string;
  primaryPlantId: string;
  fiscalYearStart: string;
  currency: string;
  timeZone: string;
  shiftModel: string;
}

export interface Plant {
  id: string;
  code: string;
  name: string;
  location: string;
  status: RecordStatus;
}

export interface Shift {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  plantId: string;
  status: RecordStatus;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  status: RecordStatus;
}

export interface UnitOfMeasure {
  id: string;
  code: string;
  name: string;
  status: RecordStatus;
}

export interface ItemCategory {
  id: string;
  code: string;
  name: string;
  type: 'raw' | 'wip' | 'finished' | 'spare';
  status: RecordStatus;
}

export interface Item {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  type: 'raw' | 'finished' | 'spare';
  unitId: string;
  reorderLevel: number;
  status: RecordStatus;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  plantId: string;
  location: string;
  capacity: number;
  status: RecordStatus;
}

export interface ProductionLine {
  id: string;
  code: string;
  name: string;
  plantId: string;
  status: RecordStatus;
}

export interface Machine {
  id: string;
  code: string;
  name: string;
  lineId: string;
  plantId: string;
  type: string;
  status: RecordStatus;
}

export interface Operation {
  id: string;
  code: string;
  name: string;
  description: string;
  status: RecordStatus;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  rating: number;
  leadTimeDays: number;
  status: RecordStatus;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  segment: string;
  email: string;
  phone: string;
  status: RecordStatus;
}

export interface DefectType {
  id: string;
  code: string;
  name: string;
  severityDefault: 'low' | 'medium' | 'high';
  status: RecordStatus;
}

export interface MaintenanceType {
  id: string;
  code: string;
  name: string;
  status: RecordStatus;
}

export interface ExpenseCategory {
  id: string;
  code: string;
  name: string;
  status: RecordStatus;
}

export type MasterDataCollection =
  | 'plants'
  | 'shifts'
  | 'departments'
  | 'unitsOfMeasure'
  | 'itemCategories'
  | 'items'
  | 'warehouses'
  | 'productionLines'
  | 'machines'
  | 'operations'
  | 'suppliers'
  | 'customers'
  | 'defectTypes'
  | 'maintenanceTypes'
  | 'expenseCategories';

export interface MasterDataState {
  companySettings: CompanySettings;
  plants: Plant[];
  shifts: Shift[];
  departments: Department[];
  unitsOfMeasure: UnitOfMeasure[];
  itemCategories: ItemCategory[];
  items: Item[];
  warehouses: Warehouse[];
  productionLines: ProductionLine[];
  machines: Machine[];
  operations: Operation[];
  suppliers: Supplier[];
  customers: Customer[];
  defectTypes: DefectType[];
  maintenanceTypes: MaintenanceType[];
  expenseCategories: ExpenseCategory[];
}

export const ID_PREFIX: Record<MasterDataCollection, string> = {
  plants: 'PLT',
  shifts: 'SHF',
  departments: 'DEP',
  unitsOfMeasure: 'UOM',
  itemCategories: 'CAT',
  items: 'ITM',
  warehouses: 'WH',
  productionLines: 'LN',
  machines: 'MCH',
  operations: 'OP',
  suppliers: 'SUP',
  customers: 'CUS',
  defectTypes: 'DFT',
  maintenanceTypes: 'MNT',
  expenseCategories: 'EXP',
};

const PLANT_01 = 'PLT-001';
const PLANT_02 = 'PLT-002';

export const DEFAULT_MASTER_DATA: MasterDataState = {
  companySettings: {
    companyName: 'Apex Precision Manufacturing',
    primaryPlantId: PLANT_01,
    fiscalYearStart: 'January 1',
    currency: 'USD ($)',
    timeZone: 'America/Detroit (EST)',
    shiftModel: '3 Shifts · 8 Hours',
  },
  plants: [
    { id: PLANT_01, code: 'P01', name: 'Plant 01 — Detroit', location: 'Detroit, MI', status: 'active' },
    { id: PLANT_02, code: 'P02', name: 'Plant 02 — Chicago', location: 'Chicago, IL', status: 'active' },
    { id: 'PLT-003', code: 'P03', name: 'Plant 03 — Austin', location: 'Austin, TX', status: 'active' },
  ],
  shifts: [
    { id: 'SHF-001', code: 'S1', name: 'Shift 1', startTime: '22:00', endTime: '06:00', plantId: PLANT_01, status: 'active' },
    { id: 'SHF-002', code: 'S2', name: 'Shift 2', startTime: '06:00', endTime: '14:00', plantId: PLANT_01, status: 'active' },
    { id: 'SHF-003', code: 'S3', name: 'Shift 3', startTime: '14:00', endTime: '22:00', plantId: PLANT_01, status: 'active' },
  ],
  departments: [
    { id: 'DEP-001', code: 'PROD', name: 'Production', status: 'active' },
    { id: 'DEP-002', code: 'QC', name: 'Quality Control', status: 'active' },
    { id: 'DEP-003', code: 'MNT', name: 'Maintenance', status: 'active' },
    { id: 'DEP-004', code: 'LOG', name: 'Logistics', status: 'active' },
  ],
  unitsOfMeasure: [
    { id: 'UOM-001', code: 'units', name: 'Units', status: 'active' },
    { id: 'UOM-002', code: 'kg', name: 'Kilograms', status: 'active' },
    { id: 'UOM-003', code: 'L', name: 'Liters', status: 'active' },
    { id: 'UOM-004', code: 'sheets', name: 'Sheets', status: 'active' },
  ],
  itemCategories: [
    { id: 'CAT-001', code: 'RAW', name: 'Raw Materials', type: 'raw', status: 'active' },
    { id: 'CAT-002', code: 'WIP', name: 'Work in Progress', type: 'wip', status: 'active' },
    { id: 'CAT-003', code: 'FG', name: 'Finished Goods', type: 'finished', status: 'active' },
    { id: 'CAT-004', code: 'SPR', name: 'Spare Parts', type: 'spare', status: 'active' },
  ],
  items: [
    { id: 'ITM-001', sku: 'RM-ST-304', name: 'Steel Alloy 304', categoryId: 'CAT-001', type: 'raw', unitId: 'UOM-002', reorderLevel: 25, status: 'active' },
    { id: 'ITM-002', sku: 'RM-TI-002', name: 'Titanium Sheet 2mm', categoryId: 'CAT-001', type: 'raw', unitId: 'UOM-004', reorderLevel: 35, status: 'active' },
    { id: 'ITM-003', sku: 'RM-HF-009', name: 'Hydraulic Fluid HFX-9', categoryId: 'CAT-001', type: 'raw', unitId: 'UOM-003', reorderLevel: 30, status: 'active' },
    { id: 'ITM-004', sku: 'RM-BA-440', name: 'Bearing Assembly BA-440', categoryId: 'CAT-001', type: 'raw', unitId: 'UOM-001', reorderLevel: 20, status: 'active' },
    { id: 'ITM-005', sku: 'FG-AV-101', name: 'Aerospace Valve Assembly', categoryId: 'CAT-003', type: 'finished', unitId: 'UOM-001', reorderLevel: 50, status: 'active' },
    { id: 'ITM-006', sku: 'FG-PG-088', name: 'Precision Gear Set GS-88', categoryId: 'CAT-003', type: 'finished', unitId: 'UOM-001', reorderLevel: 40, status: 'active' },
    { id: 'ITM-007', sku: 'FG-HC-012', name: 'Hydraulic Cylinder HC-12', categoryId: 'CAT-003', type: 'finished', unitId: 'UOM-001', reorderLevel: 30, status: 'active' },
  ],
  warehouses: [
    { id: 'WH-001', code: 'WH-A', name: 'Raw Materials Hub', plantId: PLANT_01, location: 'Building A', capacity: 85, status: 'active' },
    { id: 'WH-002', code: 'WH-B', name: 'Component Storage', plantId: PLANT_01, location: 'Building B', capacity: 72, status: 'active' },
    { id: 'WH-003', code: 'WH-C', name: 'Finished Goods Center', plantId: PLANT_01, location: 'Building C', capacity: 68, status: 'active' },
    { id: 'WH-004', code: 'WH-D', name: 'Distribution Buffer', plantId: PLANT_01, location: 'Logistics Wing', capacity: 54, status: 'active' },
  ],
  productionLines: [
    { id: 'LN-001', code: 'A-1', name: 'Line A-1', plantId: PLANT_01, status: 'active' },
    { id: 'LN-002', code: 'A-3', name: 'Line A-3', plantId: PLANT_01, status: 'active' },
    { id: 'LN-003', code: 'B-2', name: 'Line B-2', plantId: PLANT_01, status: 'active' },
    { id: 'LN-004', code: 'C-1', name: 'Line C-1', plantId: PLANT_01, status: 'active' },
  ],
  machines: [
    { id: 'MCH-001', code: 'CNC-01', name: 'CNC Mill Alpha', lineId: 'LN-001', plantId: PLANT_01, type: 'CNC Mill', status: 'active' },
    { id: 'MCH-002', code: 'CNC-02', name: 'CNC Lathe Beta', lineId: 'LN-001', plantId: PLANT_01, type: 'CNC Lathe', status: 'active' },
    { id: 'MCH-003', code: 'ASM-01', name: 'Assembly Line A-3', lineId: 'LN-002', plantId: PLANT_01, type: 'Assembly', status: 'active' },
    { id: 'MCH-004', code: 'WLD-01', name: 'Robotic Welder X7', lineId: 'LN-003', plantId: PLANT_01, type: 'Welder', status: 'active' },
    { id: 'MCH-005', code: 'QC-01', name: 'Quality Scanner Q2', lineId: 'LN-002', plantId: PLANT_01, type: 'QC Scanner', status: 'active' },
    { id: 'MCH-006', code: 'PKG-01', name: 'Packaging Unit P4', lineId: 'LN-004', plantId: PLANT_01, type: 'Packaging', status: 'active' },
  ],
  operations: [
    { id: 'OP-001', code: 'CNC-MILL', name: 'CNC Milling', description: 'Precision milling operations', status: 'active' },
    { id: 'OP-002', code: 'ASM', name: 'Assembly', description: 'Component assembly', status: 'active' },
    { id: 'OP-003', code: 'WLD', name: 'Welding', description: 'Robotic and manual welding', status: 'active' },
    { id: 'OP-004', code: 'QC', name: 'Quality Inspection', description: 'In-line quality checks', status: 'active' },
    { id: 'OP-005', code: 'SFT', name: 'Surface Treatment', description: 'Coating and finishing', status: 'active' },
  ],
  suppliers: [
    { id: 'SUP-001', code: 'SUP-001', name: 'Titan Metals Corp', category: 'Raw Materials', email: 'orders@titanmetals.com', phone: '+1 313-555-0101', rating: 4.8, leadTimeDays: 10, status: 'active' },
    { id: 'SUP-002', code: 'SUP-014', name: 'Precision Components Ltd', category: 'Components', email: 'sales@precisioncomp.com', phone: '+1 312-555-0142', rating: 4.6, leadTimeDays: 14, status: 'active' },
    { id: 'SUP-003', code: 'SUP-022', name: 'Global Hydraulics Inc', category: 'Fluids & Lubricants', email: 'supply@globalhyd.com', phone: '+1 734-555-0220', rating: 4.2, leadTimeDays: 7, status: 'active' },
    { id: 'SUP-004', code: 'SUP-031', name: 'EuroBearings AG', category: 'Bearings', email: 'export@eurobearings.de', phone: '+49 30 555 0310', rating: 3.9, leadTimeDays: 21, status: 'active' },
  ],
  customers: [
    { id: 'CUS-001', code: 'CUS-001', name: 'AeroTech Industries', segment: 'Aerospace', email: 'procurement@aerotech.com', phone: '+1 206-555-1001', status: 'active' },
    { id: 'CUS-002', code: 'CUS-018', name: 'Meridian Automotive', segment: 'Automotive', email: 'buyers@meridianauto.com', phone: '+1 248-555-1018', status: 'active' },
    { id: 'CUS-003', code: 'CUS-042', name: 'Pacific Energy Systems', segment: 'Energy', email: 'orders@pacificenergy.com', phone: '+1 415-555-1042', status: 'active' },
    { id: 'CUS-004', code: 'CUS-067', name: 'Nova Robotics Ltd', segment: 'Robotics', email: 'hello@novarobotics.io', phone: '+1 512-555-1067', status: 'active' },
  ],
  defectTypes: [
    { id: 'DFT-001', code: 'SURF', name: 'Surface Finish', severityDefault: 'medium', status: 'active' },
    { id: 'DFT-002', code: 'DIM', name: 'Dimensional', severityDefault: 'high', status: 'active' },
    { id: 'DFT-003', code: 'COAT', name: 'Coating', severityDefault: 'low', status: 'active' },
    { id: 'DFT-004', code: 'ASSY', name: 'Assembly', severityDefault: 'medium', status: 'active' },
  ],
  maintenanceTypes: [
    { id: 'MNT-001', code: 'PM', name: 'Preventive', status: 'active' },
    { id: 'MNT-002', code: 'CAL', name: 'Calibration', status: 'active' },
    { id: 'MNT-003', code: 'INSP', name: 'Inspection', status: 'active' },
    { id: 'MNT-004', code: 'LUB', name: 'Lubrication', status: 'active' },
  ],
  expenseCategories: [
    { id: 'EXP-001', code: 'RAW', name: 'Raw Materials', status: 'active' },
    { id: 'EXP-002', code: 'UTIL', name: 'Utilities', status: 'active' },
    { id: 'EXP-003', code: 'MNT', name: 'Maintenance', status: 'active' },
    { id: 'EXP-004', code: 'LOG', name: 'Logistics', status: 'active' },
    { id: 'EXP-005', code: 'PAY', name: 'Payroll', status: 'active' },
    { id: 'EXP-006', code: 'OH', name: 'Overhead', status: 'active' },
  ],
};
