/** Firestore read helpers (list, get, aggregates). */

import type { Firestore } from 'firebase-admin/firestore';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { appCollection } from '@/lib/firebase/collections';
import { isMasterTableKey } from '@/lib/master-data/api-tables';
import { toIsoString, toPublicUser } from '@/lib/firestore/helpers';
import type {
  AppAssetRecord,
  CompanySettingsRecord,
  MasterRecord,
  PublicUser,
  RoleRecord,
  UserRecord,
} from '@/lib/types/records';

const COMPANY_SETTINGS_ID = 'default';
const LOGIN_HERO_ASSET_ID = 'loginHero';

function db(): Firestore {
  return getAdminFirestore();
}

function col(table: string) {
  return appCollection(db(), table);
}

function mapTimestamps(data: Record<string, unknown>) {
  return {
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };
}

function mapMasterRecord(id: string, data: Record<string, unknown>): MasterRecord {
  return {
    id,
    ...data,
    status: (data.status as MasterRecord['status']) ?? 'active',
    ...mapTimestamps(data),
  } as MasterRecord;
}

function mapUser(id: string, data: Record<string, unknown>): UserRecord {
  return {
    id,
    name: String(data.name ?? ''),
    email: String(data.email ?? ''),
    role: String(data.role ?? ''),
    status: (data.status as UserRecord['status']) ?? 'active',
    avatar: String(data.avatar ?? ''),
    department: data.department ? String(data.department) : undefined,
    passwordHash: String(data.passwordHash ?? ''),
    ...mapTimestamps(data),
  };
}

function mapRole(id: string, data: Record<string, unknown>): RoleRecord {
  const permissions = data.permissions;
  return {
    id,
    name: String(data.name ?? ''),
    label: String(data.label ?? data.name ?? ''),
    description: String(data.description ?? ''),
    permissions: Array.isArray(permissions) ? permissions.map(String) : [],
    color: String(data.color ?? 'default'),
    status: (data.status as RoleRecord['status']) ?? 'active',
    isSystem: Boolean(data.isSystem),
    ...mapTimestamps(data),
  };
}

export async function isCollectionEmpty(tableKey: string): Promise<boolean> {
  const snap = await col(tableKey).limit(1).get();
  return snap.empty;
}

// ─── Generic master reads ───────────────────────────────────────────────────

export async function listMasterRecords(tableKey: string): Promise<MasterRecord[]> {
  if (!isMasterTableKey(tableKey)) {
    throw new Error(`Unknown master table: ${tableKey}`);
  }
  const snap = await col(tableKey).get();
  return snap.docs
    .map((doc) => mapMasterRecord(doc.id, doc.data() as Record<string, unknown>))
    .sort((a, b) => String(a.name ?? a.code ?? a.sku ?? a.id).localeCompare(String(b.name ?? b.code ?? b.sku ?? b.id)));
}

export async function getMasterRecord(tableKey: string, id: string): Promise<MasterRecord | null> {
  if (!isMasterTableKey(tableKey)) {
    throw new Error(`Unknown master table: ${tableKey}`);
  }
  const doc = await col(tableKey).doc(id).get();
  if (!doc.exists) return null;
  return mapMasterRecord(doc.id, doc.data() as Record<string, unknown>);
}

// ─── Company settings ───────────────────────────────────────────────────────

export async function getCompanySettings(): Promise<CompanySettingsRecord | null> {
  const doc = await col('companySettings').doc(COMPANY_SETTINGS_ID).get();
  if (!doc.exists) return null;
  const data = doc.data() as Record<string, unknown>;
  return {
    id: doc.id,
    companyName: String(data.companyName ?? ''),
    primaryPlantId: String(data.primaryPlantId ?? ''),
    fiscalYearStart: String(data.fiscalYearStart ?? ''),
    currency: String(data.currency ?? ''),
    timeZone: String(data.timeZone ?? ''),
    shiftModel: String(data.shiftModel ?? ''),
    ...mapTimestamps(data),
  };
}

// ─── Users ──────────────────────────────────────────────────────────────────

export async function listUsers(): Promise<PublicUser[]> {
  const snap = await col('users').get();
  return snap.docs
    .map((doc) => toPublicUser(mapUser(doc.id, doc.data() as Record<string, unknown>)))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getUser(id: string): Promise<PublicUser | null> {
  const doc = await col('users').doc(id).get();
  if (!doc.exists) return null;
  return toPublicUser(mapUser(doc.id, doc.data() as Record<string, unknown>));
}

export async function getUserRecordByEmail(email: string): Promise<UserRecord | null> {
  const snap = await col('users')
    .where('email', '==', email.trim().toLowerCase())
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return mapUser(doc.id, doc.data() as Record<string, unknown>);
}

export async function getUserRecordById(id: string): Promise<UserRecord | null> {
  const doc = await col('users').doc(id).get();
  if (!doc.exists) return null;
  return mapUser(doc.id, doc.data() as Record<string, unknown>);
}

// ─── Roles ────────────────────────────────────────────────────────────────────

export async function listRoles(): Promise<RoleRecord[]> {
  const snap = await col('roles').get();
  return snap.docs
    .map((doc) => mapRole(doc.id, doc.data() as Record<string, unknown>))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export async function getRole(id: string): Promise<RoleRecord | null> {
  const doc = await col('roles').doc(id).get();
  if (!doc.exists) return null;
  return mapRole(doc.id, doc.data() as Record<string, unknown>);
}

export async function getRoleByName(name: string): Promise<RoleRecord | null> {
  const snap = await col('roles').where('name', '==', name).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return mapRole(doc.id, doc.data() as Record<string, unknown>);
}

// ─── App assets ─────────────────────────────────────────────────────────────

export async function getLoginHeroAsset(): Promise<AppAssetRecord | null> {
  const doc = await col('appAssets').doc(LOGIN_HERO_ASSET_ID).get();
  if (!doc.exists) return null;
  const data = doc.data() as Record<string, unknown>;
  return {
    id: doc.id,
    url: String(data.url ?? ''),
    contentType: data.contentType ? String(data.contentType) : undefined,
    path: data.path ? String(data.path) : undefined,
    ...mapTimestamps(data),
  };
}

// ─── Named list helpers (convenience for modules) ───────────────────────────

export const listPlants = () => listMasterRecords('plants');
export const getPlant = (id: string) => getMasterRecord('plants', id);
export const listShifts = () => listMasterRecords('shifts');
export const listDepartments = () => listMasterRecords('departments');
export const listUnitsOfMeasure = () => listMasterRecords('unitsOfMeasure');
export const listItemCategories = () => listMasterRecords('itemCategories');
export const listItems = () => listMasterRecords('items');
export const getItem = (id: string) => getMasterRecord('items', id);
export const listWarehouses = () => listMasterRecords('warehouses');
export const listProductionLines = () => listMasterRecords('productionLines');
export const listMachines = () => listMasterRecords('machines');
export const listOperations = () => listMasterRecords('operations');
export const listSuppliers = () => listMasterRecords('suppliers');
export const listCustomers = () => listMasterRecords('customers');
export const listDefectTypes = () => listMasterRecords('defectTypes');
export const listMaintenanceTypes = () => listMasterRecords('maintenanceTypes');
export const listExpenseCategories = () => listMasterRecords('expenseCategories');
