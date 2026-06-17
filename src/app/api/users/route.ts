import { createUser } from '@/lib/firestore/app-writes';
import { getUserRecordByEmail, listUsers } from '@/lib/firestore/app-data';
import { ensureSeedData } from '@/lib/firestore/seed';
import { userCreateSchema } from '@/lib/validation/entities';
import { ensureDb, handleRouteError, jsonData, requireAuth } from '@/lib/api/route-helpers';
import { apiError } from '@/lib/http/api-error';

export async function GET(request: Request) {
  try {
    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    return jsonData(await listUsers());
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    const body = userCreateSchema.parse(await request.json());

    const existing = await getUserRecordByEmail(body.email);
    if (existing) {
      return apiError('An account with this email already exists.', 409);
    }

    const created = await createUser(body);
    return jsonData(created, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
