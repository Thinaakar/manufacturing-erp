import { deleteUser, updateUser } from '@/lib/firestore/app-writes';
import { getUser } from '@/lib/firestore/app-data';
import { ensureSeedData } from '@/lib/firestore/seed';
import { userUpdateSchema } from '@/lib/validation/entities';
import { ensureDb, handleRouteError, jsonData, requireAuth } from '@/lib/api/route-helpers';
import { apiError } from '@/lib/http/api-error';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    const user = await getUser(id);
    if (!user) return apiError('User not found.', 404);
    return jsonData(user);
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
    const body = userUpdateSchema.parse(await request.json());
    const updated = await updateUser(id, body);
    if (!updated) return apiError('User not found.', 404);
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
    await deleteUser(id);
    return jsonData({ deleted: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
