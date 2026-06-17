import { listMasterRecords } from '@/lib/firestore/app-data';
import { createMasterRecord } from '@/lib/firestore/app-writes';
import { resolveMasterTable } from '@/lib/master-data/api-tables';
import { masterRecordCreateSchema } from '@/lib/validation/entities';
import { ensureSeedData } from '@/lib/firestore/seed';
import { ensureDb, handleRouteError, jsonData, requireAuth } from '@/lib/api/route-helpers';
import { apiError } from '@/lib/http/api-error';

type RouteContext = { params: Promise<{ table: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { table: routeTable } = await context.params;
    const tableKey = resolveMasterTable(routeTable);
    if (!tableKey) return apiError('Unknown master data table.', 404);

    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    return jsonData(await listMasterRecords(tableKey));
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { table: routeTable } = await context.params;
    const tableKey = resolveMasterTable(routeTable);
    if (!tableKey) return apiError('Unknown master data table.', 404);

    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    const body = masterRecordCreateSchema.parse(await request.json());
    const { id, ...rest } = body as Record<string, unknown> & { id?: string };
    const created = await createMasterRecord(tableKey, rest, id ? String(id) : undefined);
    return jsonData(created, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
