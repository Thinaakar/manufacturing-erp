import { loginSchema } from '@/lib/validation/entities';
import { getUserRecordByEmail } from '@/lib/firestore/app-data';
import { markUserLogin } from '@/lib/firestore/app-writes';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth/session';
import { ensureSeedData } from '@/lib/firestore/seed';
import { ensureDb, handleRouteError, jsonData } from '@/lib/api/route-helpers';
import { apiError } from '@/lib/http/api-error';

export async function POST(request: Request) {
  try {
    await ensureDb();
    await ensureSeedData();
    const body = loginSchema.parse(await request.json());
    const account = await getUserRecordByEmail(body.email);

    if (!account || !verifyPassword(body.password, account.passwordHash)) {
      return apiError('Invalid email or password.', 401);
    }
    if (account.status !== 'active') {
      return apiError('This account is inactive. Contact your administrator.', 403);
    }

    await markUserLogin(account.email);

    const token = createSessionToken({
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
    });

    const res = jsonData({
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
    });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (e) {
    return handleRouteError(e);
  }
}
