import { getMasterRecord } from '@/lib/firestore/app-data';
import { deleteMasterRecord, updateMasterRecord } from '@/lib/firestore/app-writes';
import { resolveMasterTable } from '@/lib/master-data/api-tables';
import { masterRecordUpdateSchema } from '@/lib/validation/entities';
import { ensureSeedData } from '@/lib/firestore/seed';
import { ensureDb, handleRouteError, jsonData, requireAuth } from '@/lib/api/route-helpers';
import { apiError } from '@/lib/http/api-error';

type RouteContext = { params: Promise<{ table: string; id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { table: routeTable, id } = await context.params;
    const tableKey = resolveMasterTable(routeTable);
    if (!tableKey) return apiError('Unknown master data table.', 404);

    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    const record = await getMasterRecord(tableKey, id);
    if (!record) return apiError('Record not found.', 404);
    return jsonData(record);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { table: routeTable, id } = await context.params;
    const tableKey = resolveMasterTable(routeTable);
    if (!tableKey) return apiError('Unknown master data table.', 404);

    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    const body = masterRecordUpdateSchema.parse(await request.json());
    const updated = await updateMasterRecord(tableKey, id, body);
    if (!updated) return apiError('Record not found.', 404);
    return jsonData(updated);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { table: routeTable, id } = await context.params;
    const tableKey = resolveMasterTable(routeTable);
    if (!tableKey) return apiError('Unknown master data table.', 404);

    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    const ok = await deleteMasterRecord(tableKey, id);
    if (!ok) return apiError('Record not found.', 404);
    return jsonData({ deleted: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
