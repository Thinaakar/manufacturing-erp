import { collectionToRoute } from '@/lib/master-data/api-tables';
import { apiJson } from '@/lib/http/client';
import type { CompanySettings, MasterDataCollection } from '@/lib/data/master-data';

type MasterRecord = Record<string, unknown> & { id: string };

export async function fetchCompanySettings(): Promise<CompanySettings | null> {
  const data = await apiJson<Record<string, unknown>>('/api/company-settings');
  if (!data) return null;
  return {
    companyName: String(data.companyName ?? ''),
    primaryPlantId: String(data.primaryPlantId ?? ''),
    fiscalYearStart: String(data.fiscalYearStart ?? ''),
    currency: String(data.currency ?? ''),
    timeZone: String(data.timeZone ?? ''),
    shiftModel: String(data.shiftModel ?? ''),
  };
}

export async function patchCompanySettings(settings: CompanySettings): Promise<CompanySettings> {
  const data = await apiJson<Record<string, unknown>>('/api/company-settings', {
    method: 'PATCH',
    body: JSON.stringify(settings),
  });
  return {
    companyName: String(data.companyName ?? ''),
    primaryPlantId: String(data.primaryPlantId ?? ''),
    fiscalYearStart: String(data.fiscalYearStart ?? ''),
    currency: String(data.currency ?? ''),
    timeZone: String(data.timeZone ?? ''),
    shiftModel: String(data.shiftModel ?? ''),
  };
}

export async function fetchMasterCollection(collection: MasterDataCollection): Promise<MasterRecord[]> {
  const route = collectionToRoute(collection);
  if (!route) throw new Error(`Unknown collection: ${collection}`);
  return apiJson<MasterRecord[]>(`/api/master/${route}`);
}

export async function createMasterRecordApi(
  collection: MasterDataCollection,
  record: Record<string, unknown>,
): Promise<MasterRecord> {
  const route = collectionToRoute(collection);
  if (!route) throw new Error(`Unknown collection: ${collection}`);
  return apiJson<MasterRecord>(`/api/master/${route}`, {
    method: 'POST',
    body: JSON.stringify(record),
  });
}

export async function updateMasterRecordApi(
  collection: MasterDataCollection,
  id: string,
  patch: Record<string, unknown>,
): Promise<MasterRecord> {
  const route = collectionToRoute(collection);
  if (!route) throw new Error(`Unknown collection: ${collection}`);
  return apiJson<MasterRecord>(`/api/master/${route}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function deleteMasterRecordApi(collection: MasterDataCollection, id: string): Promise<void> {
  const route = collectionToRoute(collection);
  if (!route) throw new Error(`Unknown collection: ${collection}`);
  await apiJson<{ deleted: boolean }>(`/api/master/${route}/${id}`, { method: 'DELETE' });
}

export function castRecords<T extends { id: string }>(records: MasterRecord[]): T[] {
  return records as unknown as T[];
}
