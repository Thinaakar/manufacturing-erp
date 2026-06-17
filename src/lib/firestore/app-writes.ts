/** Firestore write helpers (create, update, delete). */

import { FieldValue } from 'firebase-admin/firestore';
import { hashPassword } from '@/lib/auth/password';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { appCollection, ensureAppTables } from '@/lib/firebase/collections';
import {
  ensureLoginHeroInStorage,
  loginHeroStoragePath,
} from '@/lib/firebase/login-hero-storage';
import { isMasterTableKey } from '@/lib/master-data/api-tables';
import { stripUndefined, toPublicUser } from '@/lib/firestore/helpers';
import type { CompanySettingsRecord, PublicUser, RoleRecord, UserRecord } from '@/lib/types/records';

const COMPANY_SETTINGS_ID = 'default';
const LOGIN_HERO_ASSET_ID = 'loginHero';

function col(table: string) {
  return appCollection(getAdminFirestore(), table);
}

async function ensureDbReady() {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  return db;
}

const ts = () => ({
  createdAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp(),
});

const tsUpdate = () => ({
  updatedAt: FieldValue.serverTimestamp(),
});

export async function seedDocument(
  tableKey: string,
  id: string,
  data: Record<string, unknown>,
): Promise<void> {
  await col(tableKey).doc(id).set(data, { merge: true });
}

export async function createMasterRecord(
  tableKey: string,
  input: Record<string, unknown>,
  id?: string,
): Promise<Record<string, unknown> & { id: string }> {
  if (!isMasterTableKey(tableKey)) {
    throw new Error(`Unknown master table: ${tableKey}`);
  }
  await ensureDbReady();
  const ref = id ? col(tableKey).doc(id) : col(tableKey).doc();
  const payload = stripUndefined({
    ...input,
    status: input.status ?? 'active',
    ...ts(),
  });
  await ref.set(payload);
  const doc = await ref.get();
  return { id: doc.id, ...(doc.data() as Record<string, unknown>) };
}

export async function updateMasterRecord(
  tableKey: string,
  id: string,
  patch: Record<string, unknown>,
): Promise<(Record<string, unknown> & { id: string }) | null> {
  if (!isMasterTableKey(tableKey)) {
    throw new Error(`Unknown master table: ${tableKey}`);
  }
  await ensureDbReady();
  const ref = col(tableKey).doc(id);
  const existing = await ref.get();
  if (!existing.exists) return null;
  await ref.set(stripUndefined({ ...patch, ...tsUpdate() }), { merge: true });
  const doc = await ref.get();
  return { id: doc.id, ...(doc.data() as Record<string, unknown>) };
}

export async function deleteMasterRecord(tableKey: string, id: string): Promise<boolean> {
  if (!isMasterTableKey(tableKey)) {
    throw new Error(`Unknown master table: ${tableKey}`);
  }
  await ensureDbReady();
  const ref = col(tableKey).doc(id);
  const existing = await ref.get();
  if (!existing.exists) return false;
  await ref.delete();
  return true;
}

export async function updateCompanySettings(
  input: Partial<Omit<CompanySettingsRecord, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<CompanySettingsRecord> {
  await ensureDbReady();
  const ref = col('companySettings').doc(COMPANY_SETTINGS_ID);
  const payload = stripUndefined({ ...input, ...tsUpdate() });
  const existing = await ref.get();
  if (!existing.exists) {
    await ref.set({ ...payload, ...ts() });
  } else {
    await ref.set(payload, { merge: true });
  }
  const doc = await ref.get();
  const data = doc.data() as Record<string, unknown>;
  return {
    id: doc.id,
    companyName: String(data.companyName ?? ''),
    primaryPlantId: String(data.primaryPlantId ?? ''),
    fiscalYearStart: String(data.fiscalYearStart ?? ''),
    currency: String(data.currency ?? ''),
    timeZone: String(data.timeZone ?? ''),
    shiftModel: String(data.shiftModel ?? ''),
    createdAt: String(data.createdAt ?? ''),
    updatedAt: String(data.updatedAt ?? ''),
  };
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: string;
  status?: string;
  department?: string;
  avatar?: string;
}): Promise<PublicUser> {
  await ensureDbReady();
  const ref = col('users').doc();
  const email = input.email.trim().toLowerCase();
  const payload = {
    name: input.name.trim(),
    email,
    role: input.role,
    status: input.status ?? 'active',
    avatar:
      input.avatar ??
      input.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    department: input.department ?? 'General',
    passwordHash: hashPassword(input.password),
    ...ts(),
  };
  await ref.set(payload);
  const user: UserRecord = {
    id: ref.id,
    name: payload.name,
    email: payload.email,
    role: payload.role,
    status: payload.status as UserRecord['status'],
    avatar: payload.avatar,
    department: payload.department,
    passwordHash: payload.passwordHash,
    createdAt: '',
    updatedAt: '',
  };
  return toPublicUser(user);
}

export async function updateUser(
  id: string,
  input: Partial<{
    name: string;
    email: string;
    password: string;
    role: string;
    status: string;
    department: string;
    avatar: string;
  }>,
): Promise<PublicUser | null> {
  await ensureDbReady();
  const ref = col('users').doc(id);
  const existing = await ref.get();
  if (!existing.exists) return null;

  const patch = stripUndefined({
    name: input.name?.trim(),
    email: input.email?.trim().toLowerCase(),
    role: input.role,
    status: input.status,
    department: input.department,
    avatar: input.avatar,
    passwordHash: input.password ? hashPassword(input.password) : undefined,
    ...tsUpdate(),
  } as Record<string, unknown>);

  await ref.set(patch, { merge: true });
  const doc = await ref.get();
  const data = doc.data() as Record<string, unknown>;
  const user: UserRecord = {
    id: doc.id,
    name: String(data.name ?? ''),
    email: String(data.email ?? ''),
    role: String(data.role ?? ''),
    status: (data.status as UserRecord['status']) ?? 'active',
    avatar: String(data.avatar ?? ''),
    department: data.department ? String(data.department) : undefined,
    passwordHash: String(data.passwordHash ?? ''),
    createdAt: '',
    updatedAt: '',
  };
  return toPublicUser(user);
}

export async function deleteUser(id: string): Promise<boolean> {
  await ensureDbReady();
  await col('users').doc(id).delete();
  return true;
}

export async function markUserLogin(email: string): Promise<void> {
  await ensureDbReady();
  const snap = await col('users').where('email', '==', email.trim().toLowerCase()).limit(1).get();
  if (snap.empty) return;
  await snap.docs[0].ref.set({ ...tsUpdate() }, { merge: true });
}

export async function createRole(input: {
  name: string;
  label: string;
  description: string;
  permissions?: string[];
  color?: string;
  status?: string;
  isSystem?: boolean;
}): Promise<RoleRecord> {
  await ensureDbReady();
  const ref = col('roles').doc();
  const payload = {
    name: input.name.trim(),
    label: input.label.trim(),
    description: input.description.trim(),
    permissions: input.permissions ?? [],
    color: input.color ?? 'default',
    status: input.status ?? 'active',
    isSystem: input.isSystem ?? false,
    ...ts(),
  };
  await ref.set(payload);
  return {
    id: ref.id,
    ...payload,
    status: payload.status as RoleRecord['status'],
    createdAt: '',
    updatedAt: '',
  };
}

export async function updateRole(
  id: string,
  input: Partial<{
    name: string;
    label: string;
    description: string;
    permissions: string[];
    color: string;
    status: string;
  }>,
): Promise<RoleRecord | null> {
  await ensureDbReady();
  const ref = col('roles').doc(id);
  const existing = await ref.get();
  if (!existing.exists) return null;
  const patch = stripUndefined({
    name: input.name?.trim(),
    label: input.label?.trim(),
    description: input.description?.trim(),
    permissions: input.permissions,
    color: input.color,
    status: input.status,
    ...tsUpdate(),
  } as Record<string, unknown>);
  await ref.set(patch, { merge: true });
  const doc = await ref.get();
  const data = doc.data() as Record<string, unknown>;
  return {
    id: doc.id,
    name: String(data.name ?? ''),
    label: String(data.label ?? ''),
    description: String(data.description ?? ''),
    permissions: Array.isArray(data.permissions) ? data.permissions.map(String) : [],
    color: String(data.color ?? 'default'),
    status: (data.status as RoleRecord['status']) ?? 'active',
    isSystem: Boolean(data.isSystem),
    createdAt: '',
    updatedAt: '',
  };
}

export async function deleteRole(id: string): Promise<boolean> {
  await ensureDbReady();
  const ref = col('roles').doc(id);
  const existing = await ref.get();
  if (!existing.exists) return false;
  if (existing.data()?.isSystem) return false;
  await ref.delete();
  return true;
}

export async function syncLoginHeroAsset(): Promise<{ url: string; path: string }> {
  await ensureDbReady();
  const url = await ensureLoginHeroInStorage();
  const path = loginHeroStoragePath();
  await seedDocument('appAssets', LOGIN_HERO_ASSET_ID, {
    url,
    contentType: 'image/png',
    path,
    ...ts(),
  });
  return { url, path };
}
