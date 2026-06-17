import { FieldValue } from 'firebase-admin/firestore';
import { hashPassword } from '@/lib/auth/password';
import { getAdminFirestore, isFirebaseConfigured } from '@/lib/firebase/admin';
import { ensureAppTables } from '@/lib/firebase/collections';
import {
  DEMO_CREDENTIALS,
  MOCK_ROLES,
  MOCK_USERS,
} from '@/data/mock-auth';
import {
  DEFAULT_MASTER_DATA,
  type MasterDataCollection,
  type MasterDataState,
} from '@/lib/data/master-data';
import { isCollectionEmpty } from '@/lib/firestore/app-data';
import { seedDocument, syncLoginHeroAsset } from '@/lib/firestore/app-writes';

let seedPromise: Promise<void> | null = null;

/** Max master records written per collection on first seed. 0 = seed all. Default: 2. */
function getSeedSampleLimit(): number {
  const raw = process.env.FIRESTORE_SEED_SAMPLE_LIMIT;
  if (raw === undefined || raw === '') return 2;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return 2;
  return Math.floor(n);
}

const ts = () => ({
  createdAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp(),
});

async function seedMasterCollection<K extends MasterDataCollection>(
  key: K,
  records: MasterDataState[K],
): Promise<void> {
  if (!(await isCollectionEmpty(key))) return;
  const limit = getSeedSampleLimit();
  const toSeed = limit > 0 ? records.slice(0, limit) : records;
  for (const record of toSeed) {
    const { id, ...rest } = record as unknown as { id: string } & Record<string, unknown>;
    await seedDocument(key, id, { ...rest, ...ts() });
  }
}

async function seedMasterData(): Promise<void> {
  await seedMasterCollection('plants', DEFAULT_MASTER_DATA.plants);
  await seedMasterCollection('shifts', DEFAULT_MASTER_DATA.shifts);
  await seedMasterCollection('departments', DEFAULT_MASTER_DATA.departments);
  await seedMasterCollection('unitsOfMeasure', DEFAULT_MASTER_DATA.unitsOfMeasure);
  await seedMasterCollection('itemCategories', DEFAULT_MASTER_DATA.itemCategories);
  await seedMasterCollection('items', DEFAULT_MASTER_DATA.items);
  await seedMasterCollection('warehouses', DEFAULT_MASTER_DATA.warehouses);
  await seedMasterCollection('productionLines', DEFAULT_MASTER_DATA.productionLines);
  await seedMasterCollection('machines', DEFAULT_MASTER_DATA.machines);
  await seedMasterCollection('operations', DEFAULT_MASTER_DATA.operations);
  await seedMasterCollection('suppliers', DEFAULT_MASTER_DATA.suppliers);
  await seedMasterCollection('customers', DEFAULT_MASTER_DATA.customers);
  await seedMasterCollection('defectTypes', DEFAULT_MASTER_DATA.defectTypes);
  await seedMasterCollection('maintenanceTypes', DEFAULT_MASTER_DATA.maintenanceTypes);
  await seedMasterCollection('expenseCategories', DEFAULT_MASTER_DATA.expenseCategories);
}

async function seedCompanySettings(): Promise<void> {
  if (!(await isCollectionEmpty('companySettings'))) return;
  await seedDocument('companySettings', 'default', {
    ...DEFAULT_MASTER_DATA.companySettings,
    ...ts(),
  });
}

async function seedAuthData(): Promise<void> {
  if (!(await isCollectionEmpty('users'))) return;

  for (const role of MOCK_ROLES) {
    await seedDocument('roles', role.id, {
      name: role.name,
      label: role.label,
      description: role.description,
      permissions: role.permissions,
      color: role.color,
      status: role.status,
      isSystem: role.isSystem ?? false,
      ...ts(),
    });
  }

  for (const user of MOCK_USERS) {
    const password = DEMO_CREDENTIALS[user.email.toLowerCase()] ?? 'demo123';
    await seedDocument('users', user.id, {
      name: user.name,
      email: user.email.toLowerCase(),
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      department: user.department ?? 'General',
      passwordHash: hashPassword(password),
      ...ts(),
    });
  }
}

async function seedAssets(): Promise<void> {
  if (!(await isCollectionEmpty('appAssets'))) return;
  try {
    await syncLoginHeroAsset();
  } catch (e) {
    console.warn('[seed] Login hero upload skipped:', e instanceof Error ? e.message : e);
  }
}

async function runSeed(): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getAdminFirestore();
  await ensureAppTables(db);
  await seedCompanySettings();
  await seedMasterData();
  await seedAuthData();
  await seedAssets();
}

export function ensureSeedData(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((e) => {
      seedPromise = null;
      throw e;
    });
  }
  return seedPromise;
}

export async function resetSeedCache(): Promise<void> {
  seedPromise = null;
}
