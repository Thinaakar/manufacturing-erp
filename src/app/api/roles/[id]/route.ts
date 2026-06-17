import { deleteRole, updateRole } from '@/lib/firestore/app-writes';
import { getRole } from '@/lib/firestore/app-data';
import { ensureSeedData } from '@/lib/firestore/seed';
import { roleUpdateSchema } from '@/lib/validation/entities';
import { ensureDb, handleRouteError, jsonData, requireAuth } from '@/lib/api/route-helpers';
import { apiError } from '@/lib/http/api-error';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    const role = await getRole(id);
    if (!role) return apiError('Role not found.', 404);
    return jsonData(role);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    const body = roleUpdateSchema.parse(await request.json());
    const updated = await updateRole(id, body);
    if (!updated) return apiError('Role not found.', 404);
    return jsonData(updated);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    const ok = await deleteRole(id);
    if (!ok) return apiError('Role not found or is a system role.', 404);
    return jsonData({ deleted: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
