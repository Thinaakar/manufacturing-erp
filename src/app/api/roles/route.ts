import { createRole } from '@/lib/firestore/app-writes';
import { listRoles } from '@/lib/firestore/app-data';
import { ensureSeedData } from '@/lib/firestore/seed';
import { roleCreateSchema } from '@/lib/validation/entities';
import { ensureDb, handleRouteError, jsonData, requireAuth } from '@/lib/api/route-helpers';

export async function GET(request: Request) {
  try {
    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    return jsonData(await listRoles());
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    const body = roleCreateSchema.parse(await request.json());
    const created = await createRole(body);
    return jsonData(created, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
