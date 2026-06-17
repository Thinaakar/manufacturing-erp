import { getRoleByName, getUserRecordById } from '@/lib/firestore/app-data';
import { ensureSeedData } from '@/lib/firestore/seed';
import { getSessionFromRequest } from '@/lib/auth/session';
import { ensureDb, handleRouteError, jsonData } from '@/lib/api/route-helpers';
import { apiError } from '@/lib/http/api-error';

export async function GET(request: Request) {
  try {
    await ensureDb();
    await ensureSeedData();
    const session = getSessionFromRequest(request);
    if (!session) return apiError('Not authenticated.', 401);

    const user = await getUserRecordById(session.id);
    if (!user || user.status !== 'active') {
      return apiError('Not authenticated.', 401);
    }

    const role = await getRoleByName(user.role);
    return jsonData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      permissions: role?.permissions ?? [],
    });
  } catch (e) {
    return handleRouteError(e);
  }
}
