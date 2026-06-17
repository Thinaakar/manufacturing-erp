'use client';

import { useState } from 'react';
import { ModuleTabs } from '@/components/erp/modules/module-primitives';
import { MasterDataCrudSection } from '@/components/settings/master-data-crud-section';
import { StatusBadge } from '@/components/erp/modules/status-badge';
import type { DataColumn } from '@/components/erp/modules/data-table';
import type {
  Customer,
  DefectType,
  Department,
  ExpenseCategory,
  Item,
  ItemCategory,
  Machine,
  MaintenanceType,
  Operation,
  Plant,
  ProductionLine,
  Shift,
  Supplier,
  UnitOfMeasure,
  Warehouse,
} from '@/lib/data/master-data';
import { useMasterDataStore } from '@/providers/master-data-store';

const STATUS_FIELD = { key: 'status', label: 'Status', type: 'status' as const };

export function MasterDataPanel() {
  const [tab, setTab] = useState('organization');
  const store = useMasterDataStore();
  const { loading, error } = store;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-lg font-semibold text-erp-text">Master Data</h3>
        <p className="text-sm text-erp-muted">
          Reference data for production, inventory, partners, and finance. Synced from Firebase.
        </p>
      </div>

      {loading && (
        <p className="rounded-lg border border-erp-border bg-erp-surface/50 px-3 py-2 text-sm text-erp-muted">
          Loading master data...
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-erp-danger/30 bg-erp-danger/5 px-3 py-2 text-sm text-erp-danger">
          {error}
        </p>
      )}

      <div className="erp-glass rounded-2xl p-1">
        <ModuleTabs
          tabs={[
            { id: 'organization', label: 'Organization', count: store.plants.length + store.shifts.length + store.departments.length },
            { id: 'items', label: 'Items & Inventory', count: store.items.length + store.warehouses.length },
            { id: 'production', label: 'Production', count: store.productionLines.length + store.machines.length },
            { id: 'partners', label: 'Partners', count: store.suppliers.length + store.customers.length },
            { id: 'quality', label: 'Quality & Maintenance', count: store.defectTypes.length + store.maintenanceTypes.length },
            { id: 'finance', label: 'Finance', count: store.expenseCategories.length },
          ]}
          active={tab}
          onChange={setTab}
        />

        <div className="space-y-8 p-4">
          {tab === 'organization' && <OrganizationSections />}
          {tab === 'items' && <ItemsSections />}
          {tab === 'production' && <ProductionSections />}
          {tab === 'partners' && <PartnersSections />}
          {tab === 'quality' && <QualitySections />}
          {tab === 'finance' && <FinanceSections />}
        </div>
      </div>
    </div>
  );
}

function OrganizationSections() {
  const { plants, shifts, departments, getPlantName } = useMasterDataStore();

  const plantColumns: DataColumn<Plant>[] = [
    { key: 'code', header: 'Code', mono: true },
    { key: 'name', header: 'Name' },
    { key: 'location', header: 'Location' },
  ];

  const shiftColumns: DataColumn<Shift>[] = [
    { key: 'code', header: 'Code', mono: true },
    { key: 'name', header: 'Name' },
    { key: 'startTime', header: 'Start', mono: true },
    { key: 'endTime', header: 'End', mono: true },
    { key: 'plantId', header: 'Plant', render: (r) => getPlantName(r.plantId) },
  ];

  const deptColumns: DataColumn<Department>[] = [
    { key: 'code', header: 'Code', mono: true },
    { key: 'name', header: 'Name' },
  ];

  const plantOptions = plants.map((p) => ({ value: p.id, label: p.name }));

  return (
    <>
      <MasterDataCrudSection<Plant>
        title="Plants"
        subtitle="Manufacturing sites and factories"
        collection="plants"
        records={plants}
        columns={plantColumns}
        detailLabels={{ code: 'Code', name: 'Name', location: 'Location', status: 'Status' }}
        emptyForm={{ code: '', name: '', location: '', status: 'active' }}
        fields={[
          { key: 'code', label: 'Code', type: 'text', required: true, placeholder: 'P01' },
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'location', label: 'Location', type: 'text', required: true },
          STATUS_FIELD,
        ]}
        mapFormToRecord={(f) => ({
          code: f.code,
          name: f.name,
          location: f.location,
          status: f.status as Plant['status'],
        })}
        mapRecordToForm={(r) => ({
          code: r.code,
          name: r.name,
          location: r.location,
          status: r.status,
        })}
      />

      <MasterDataCrudSection<Shift>
        title="Shifts"
        subtitle="Work shift definitions"
        collection="shifts"
        records={shifts}
        columns={shiftColumns}
        detailLabels={{ code: 'Code', name: 'Name', startTime: 'Start', endTime: 'End', plantId: 'Plant', status: 'Status' }}
        emptyForm={{ code: '', name: '', startTime: '06:00', endTime: '14:00', plantId: plantOptions[0]?.value ?? '', status: 'active' }}
        fields={[
          { key: 'code', label: 'Code', type: 'text', required: true, placeholder: 'S1' },
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'startTime', label: 'Start Time', type: 'text', required: true, placeholder: '06:00' },
          { key: 'endTime', label: 'End Time', type: 'text', required: true, placeholder: '14:00' },
          { key: 'plantId', label: 'Plant', type: 'select', required: true, options: plantOptions },
          STATUS_FIELD,
        ]}
        mapFormToRecord={(f) => ({
          code: f.code,
          name: f.name,
          startTime: f.startTime,
          endTime: f.endTime,
          plantId: f.plantId,
          status: f.status as Shift['status'],
        })}
        mapRecordToForm={(r) => ({
          code: r.code,
          name: r.name,
          startTime: r.startTime,
          endTime: r.endTime,
          plantId: r.plantId,
          status: r.status,
        })}
      />

      <MasterDataCrudSection<Department>
        title="Departments"
        subtitle="Organizational departments"
        collection="departments"
        records={departments}
        columns={deptColumns}
        detailLabels={{ code: 'Code', name: 'Name', status: 'Status' }}
        emptyForm={{ code: '', name: '', status: 'active' }}
        fields={[
          { key: 'code', label: 'Code', type: 'text', required: true },
          { key: 'name', label: 'Name', type: 'text', required: true },
          STATUS_FIELD,
        ]}
        mapFormToRecord={(f) => ({
          code: f.code,
          name: f.name,
          status: f.status as Department['status'],
        })}
        mapRecordToForm={(r) => ({ code: r.code, name: r.name, status: r.status })}
      />
    </>
  );
}

function ItemsSections() {
  const {
    plants,
    unitsOfMeasure,
    itemCategories,
    items,
    warehouses,
    getPlantName,
    getCategoryName,
  } = useMasterDataStore();

  const categoryOptions = itemCategories.map((c) => ({ value: c.id, label: c.name }));
  const unitOptions = unitsOfMeasure.map((u) => ({ value: u.id, label: u.name }));
  const plantOptions = plants.map((p) => ({ value: p.id, label: p.name }));

  return (
    <>
      <MasterDataCrudSection<UnitOfMeasure>
        title="Units of Measure"
        collection="unitsOfMeasure"
        records={unitsOfMeasure}
        columns={[
          { key: 'code', header: 'Code', mono: true },
          { key: 'name', header: 'Name' },
        ]}
        detailLabels={{ code: 'Code', name: 'Name', status: 'Status' }}
        emptyForm={{ code: '', name: '', status: 'active' }}
        fields={[
          { key: 'code', label: 'Code', type: 'text', required: true },
          { key: 'name', label: 'Name', type: 'text', required: true },
          STATUS_FIELD,
        ]}
        mapFormToRecord={(f) => ({ code: f.code, name: f.name, status: f.status as UnitOfMeasure['status'] })}
        mapRecordToForm={(r) => ({ code: r.code, name: r.name, status: r.status })}
      />

      <MasterDataCrudSection<ItemCategory>
        title="Item Categories"
        collection="itemCategories"
        records={itemCategories}
        columns={[
          { key: 'code', header: 'Code', mono: true },
          { key: 'name', header: 'Name' },
          { key: 'type', header: 'Type', render: (r) => <StatusBadge status={r.type} /> },
        ]}
        detailLabels={{ code: 'Code', name: 'Name', type: 'Type', status: 'Status' }}
        emptyForm={{ code: '', name: '', type: 'raw', status: 'active' }}
        fields={[
          { key: 'code', label: 'Code', type: 'text', required: true },
          { key: 'name', label: 'Name', type: 'text', required: true },
          {
            key: 'type',
            label: 'Type',
            type: 'select',
            options: [
              { value: 'raw', label: 'Raw Materials' },
              { value: 'wip', label: 'Work in Progress' },
              { value: 'finished', label: 'Finished Goods' },
              { value: 'spare', label: 'Spare Parts' },
            ],
          },
          STATUS_FIELD,
        ]}
        mapFormToRecord={(f) => ({
          code: f.code,
          name: f.name,
          type: f.type as ItemCategory['type'],
          status: f.status as ItemCategory['status'],
        })}
        mapRecordToForm={(r) => ({ code: r.code, name: r.name, type: r.type, status: r.status })}
      />

      <MasterDataCrudSection<Item>
        title="Items / SKUs"
        subtitle="Product and material master"
        collection="items"
        records={items}
        columns={[
          { key: 'sku', header: 'SKU', mono: true },
          { key: 'name', header: 'Name' },
          { key: 'type', header: 'Type' },
          { key: 'categoryId', header: 'Category', render: (r) => getCategoryName(r.categoryId) },
          { key: 'reorderLevel', header: 'Reorder', mono: true },
        ]}
        detailLabels={{
          sku: 'SKU',
          name: 'Name',
          type: 'Type',
          categoryId: 'Category',
          unitId: 'Unit',
          reorderLevel: 'Reorder Level',
          status: 'Status',
        }}
        emptyForm={{
          sku: '',
          name: '',
          categoryId: categoryOptions[0]?.value ?? '',
          type: 'raw',
          unitId: unitOptions[0]?.value ?? '',
          reorderLevel: '0',
          status: 'active',
        }}
        fields={[
          { key: 'sku', label: 'SKU', type: 'text', required: true },
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'categoryId', label: 'Category', type: 'select', required: true, options: categoryOptions },
          {
            key: 'type',
            label: 'Item Type',
            type: 'select',
            options: [
              { value: 'raw', label: 'Raw' },
              { value: 'finished', label: 'Finished' },
              { value: 'spare', label: 'Spare' },
            ],
          },
          { key: 'unitId', label: 'Unit', type: 'select', required: true, options: unitOptions },
          { key: 'reorderLevel', label: 'Reorder Level', type: 'number' },
          STATUS_FIELD,
        ]}
        mapFormToRecord={(f) => ({
          sku: f.sku,
          name: f.name,
          categoryId: f.categoryId,
          type: f.type as Item['type'],
          unitId: f.unitId,
          reorderLevel: parseInt(f.reorderLevel, 10) || 0,
          status: f.status as Item['status'],
        })}
        mapRecordToForm={(r) => ({
          sku: r.sku,
          name: r.name,
          categoryId: r.categoryId,
          type: r.type,
          unitId: r.unitId,
          reorderLevel: String(r.reorderLevel),
          status: r.status,
        })}
      />

      <MasterDataCrudSection<Warehouse>
        title="Warehouses"
        collection="warehouses"
        records={warehouses}
        columns={[
          { key: 'code', header: 'Code', mono: true },
          { key: 'name', header: 'Name' },
          { key: 'plantId', header: 'Plant', render: (r) => getPlantName(r.plantId) },
          { key: 'capacity', header: 'Capacity %', mono: true },
        ]}
        detailLabels={{ code: 'Code', name: 'Name', plantId: 'Plant', location: 'Location', capacity: 'Capacity', status: 'Status' }}
        emptyForm={{ code: '', name: '', plantId: plantOptions[0]?.value ?? '', location: '', capacity: '80', status: 'active' }}
        fields={[
          { key: 'code', label: 'Code', type: 'text', required: true },
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'plantId', label: 'Plant', type: 'select', required: true, options: plantOptions },
          { key: 'location', label: 'Location', type: 'text', required: true },
          { key: 'capacity', label: 'Capacity %', type: 'number' },
          STATUS_FIELD,
        ]}
        mapFormToRecord={(f) => ({
          code: f.code,
          name: f.name,
          plantId: f.plantId,
          location: f.location,
          capacity: parseInt(f.capacity, 10) || 0,
          status: f.status as Warehouse['status'],
        })}
        mapRecordToForm={(r) => ({
          code: r.code,
          name: r.name,
          plantId: r.plantId,
          location: r.location,
          capacity: String(r.capacity),
          status: r.status,
        })}
      />
    </>
  );
}

function ProductionSections() {
  const { productionLines, machines, operations, plants, getPlantName, getLineName } =
    useMasterDataStore();
  const plantOptions = plants.map((p) => ({ value: p.id, label: p.name }));
  const lineOptions = productionLines.map((l) => ({ value: l.id, label: l.name }));

  return (
    <>
      <MasterDataCrudSection<ProductionLine>
        title="Production Lines"
        collection="productionLines"
        records={productionLines}
        columns={[
          { key: 'code', header: 'Code', mono: true },
          { key: 'name', header: 'Name' },
          { key: 'plantId', header: 'Plant', render: (r) => getPlantName(r.plantId) },
        ]}
        detailLabels={{ code: 'Code', name: 'Name', plantId: 'Plant', status: 'Status' }}
        emptyForm={{ code: '', name: '', plantId: plantOptions[0]?.value ?? '', status: 'active' }}
        fields={[
          { key: 'code', label: 'Code', type: 'text', required: true, placeholder: 'A-1' },
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'plantId', label: 'Plant', type: 'select', required: true, options: plantOptions },
          STATUS_FIELD,
        ]}
        mapFormToRecord={(f) => ({
          code: f.code,
          name: f.name,
          plantId: f.plantId,
          status: f.status as ProductionLine['status'],
        })}
        mapRecordToForm={(r) => ({ code: r.code, name: r.name, plantId: r.plantId, status: r.status })}
      />

      <MasterDataCrudSection<Machine>
        title="Machines"
        collection="machines"
        records={machines}
        columns={[
          { key: 'code', header: 'Code', mono: true },
          { key: 'name', header: 'Name' },
          { key: 'type', header: 'Type' },
          { key: 'lineId', header: 'Line', render: (r) => getLineName(r.lineId) },
        ]}
        detailLabels={{ code: 'Code', name: 'Name', type: 'Type', lineId: 'Line', plantId: 'Plant', status: 'Status' }}
        emptyForm={{
          code: '',
          name: '',
          type: '',
          lineId: lineOptions[0]?.value ?? '',
          plantId: plantOptions[0]?.value ?? '',
          status: 'active',
        }}
        fields={[
          { key: 'code', label: 'Code', type: 'text', required: true, placeholder: 'CNC-01' },
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'type', label: 'Type', type: 'text', required: true },
          { key: 'lineId', label: 'Production Line', type: 'select', required: true, options: lineOptions },
          { key: 'plantId', label: 'Plant', type: 'select', required: true, options: plantOptions },
          STATUS_FIELD,
        ]}
        mapFormToRecord={(f) => ({
          code: f.code,
          name: f.name,
          type: f.type,
          lineId: f.lineId,
          plantId: f.plantId,
          status: f.status as Machine['status'],
        })}
        mapRecordToForm={(r) => ({
          code: r.code,
          name: r.name,
          type: r.type,
          lineId: r.lineId,
          plantId: r.plantId,
          status: r.status,
        })}
      />

      <MasterDataCrudSection<Operation>
        title="Operations"
        collection="operations"
        records={operations}
        columns={[
          { key: 'code', header: 'Code', mono: true },
          { key: 'name', header: 'Name' },
          { key: 'description', header: 'Description' },
        ]}
        detailLabels={{ code: 'Code', name: 'Name', description: 'Description', status: 'Status' }}
        emptyForm={{ code: '', name: '', description: '', status: 'active' }}
        fields={[
          { key: 'code', label: 'Code', type: 'text', required: true },
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'description', label: 'Description', type: 'text' },
          STATUS_FIELD,
        ]}
        mapFormToRecord={(f) => ({
          code: f.code,
          name: f.name,
          description: f.description,
          status: f.status as Operation['status'],
        })}
        mapRecordToForm={(r) => ({
          code: r.code,
          name: r.name,
          description: r.description,
          status: r.status,
        })}
      />
    </>
  );
}

function PartnersSections() {
  const { suppliers, customers } = useMasterDataStore();

  return (
    <>
      <MasterDataCrudSection<Supplier>
        title="Suppliers"
        collection="suppliers"
        records={suppliers}
        columns={[
          { key: 'code', header: 'Code', mono: true },
          { key: 'name', header: 'Name' },
          { key: 'category', header: 'Category' },
          { key: 'rating', header: 'Rating', mono: true },
          { key: 'leadTimeDays', header: 'Lead (days)', mono: true },
        ]}
        detailLabels={{
          code: 'Code',
          name: 'Name',
          category: 'Category',
          email: 'Email',
          phone: 'Phone',
          rating: 'Rating',
          leadTimeDays: 'Lead Time (days)',
          status: 'Status',
        }}
        emptyForm={{
          code: '',
          name: '',
          category: '',
          email: '',
          phone: '',
          rating: '4.0',
          leadTimeDays: '14',
          status: 'active',
        }}
        fields={[
          { key: 'code', label: 'Code', type: 'text', required: true },
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'category', label: 'Category', type: 'text', required: true },
          { key: 'email', label: 'Email', type: 'text' },
          { key: 'phone', label: 'Phone', type: 'text' },
          { key: 'rating', label: 'Rating', type: 'number' },
          { key: 'leadTimeDays', label: 'Lead Time (days)', type: 'number' },
          STATUS_FIELD,
        ]}
        mapFormToRecord={(f) => ({
          code: f.code,
          name: f.name,
          category: f.category,
          email: f.email,
          phone: f.phone,
          rating: parseFloat(f.rating) || 0,
          leadTimeDays: parseInt(f.leadTimeDays, 10) || 0,
          status: f.status as Supplier['status'],
        })}
        mapRecordToForm={(r) => ({
          code: r.code,
          name: r.name,
          category: r.category,
          email: r.email,
          phone: r.phone,
          rating: String(r.rating),
          leadTimeDays: String(r.leadTimeDays),
          status: r.status,
        })}
      />

      <MasterDataCrudSection<Customer>
        title="Customers"
        collection="customers"
        records={customers}
        columns={[
          { key: 'code', header: 'Code', mono: true },
          { key: 'name', header: 'Name' },
          { key: 'segment', header: 'Segment' },
          { key: 'email', header: 'Email' },
        ]}
        detailLabels={{
          code: 'Code',
          name: 'Name',
          segment: 'Segment',
          email: 'Email',
          phone: 'Phone',
          status: 'Status',
        }}
        emptyForm={{ code: '', name: '', segment: '', email: '', phone: '', status: 'active' }}
        fields={[
          { key: 'code', label: 'Code', type: 'text', required: true },
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'segment', label: 'Segment', type: 'text', required: true },
          { key: 'email', label: 'Email', type: 'text' },
          { key: 'phone', label: 'Phone', type: 'text' },
          STATUS_FIELD,
        ]}
        mapFormToRecord={(f) => ({
          code: f.code,
          name: f.name,
          segment: f.segment,
          email: f.email,
          phone: f.phone,
          status: f.status as Customer['status'],
        })}
        mapRecordToForm={(r) => ({
          code: r.code,
          name: r.name,
          segment: r.segment,
          email: r.email,
          phone: r.phone,
          status: r.status,
        })}
      />
    </>
  );
}

function QualitySections() {
  const { defectTypes, maintenanceTypes } = useMasterDataStore();

  return (
    <>
      <MasterDataCrudSection<DefectType>
        title="Defect Types"
        collection="defectTypes"
        records={defectTypes}
        columns={[
          { key: 'code', header: 'Code', mono: true },
          { key: 'name', header: 'Name' },
          { key: 'severityDefault', header: 'Default Severity' },
        ]}
        detailLabels={{ code: 'Code', name: 'Name', severityDefault: 'Default Severity', status: 'Status' }}
        emptyForm={{ code: '', name: '', severityDefault: 'medium', status: 'active' }}
        fields={[
          { key: 'code', label: 'Code', type: 'text', required: true },
          { key: 'name', label: 'Name', type: 'text', required: true },
          {
            key: 'severityDefault',
            label: 'Default Severity',
            type: 'select',
            options: [
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ],
          },
          STATUS_FIELD,
        ]}
        mapFormToRecord={(f) => ({
          code: f.code,
          name: f.name,
          severityDefault: f.severityDefault as DefectType['severityDefault'],
          status: f.status as DefectType['status'],
        })}
        mapRecordToForm={(r) => ({
          code: r.code,
          name: r.name,
          severityDefault: r.severityDefault,
          status: r.status,
        })}
      />

      <MasterDataCrudSection<MaintenanceType>
        title="Maintenance Types"
        collection="maintenanceTypes"
        records={maintenanceTypes}
        columns={[
          { key: 'code', header: 'Code', mono: true },
          { key: 'name', header: 'Name' },
        ]}
        detailLabels={{ code: 'Code', name: 'Name', status: 'Status' }}
        emptyForm={{ code: '', name: '', status: 'active' }}
        fields={[
          { key: 'code', label: 'Code', type: 'text', required: true },
          { key: 'name', label: 'Name', type: 'text', required: true },
          STATUS_FIELD,
        ]}
        mapFormToRecord={(f) => ({
          code: f.code,
          name: f.name,
          status: f.status as MaintenanceType['status'],
        })}
        mapRecordToForm={(r) => ({ code: r.code, name: r.name, status: r.status })}
      />
    </>
  );
}

function FinanceSections() {
  const { expenseCategories } = useMasterDataStore();

  return (
    <MasterDataCrudSection<ExpenseCategory>
      title="Expense Categories"
      collection="expenseCategories"
      records={expenseCategories}
      columns={[
        { key: 'code', header: 'Code', mono: true },
        { key: 'name', header: 'Name' },
      ]}
      detailLabels={{ code: 'Code', name: 'Name', status: 'Status' }}
      emptyForm={{ code: '', name: '', status: 'active' }}
      fields={[
        { key: 'code', label: 'Code', type: 'text', required: true },
        { key: 'name', label: 'Name', type: 'text', required: true },
        STATUS_FIELD,
      ]}
      mapFormToRecord={(f) => ({
        code: f.code,
        name: f.name,
        status: f.status as ExpenseCategory['status'],
      })}
      mapRecordToForm={(r) => ({ code: r.code, name: r.name, status: r.status })}
    />
  );
}
