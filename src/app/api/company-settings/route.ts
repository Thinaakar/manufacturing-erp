import { getCompanySettings } from '@/lib/firestore/app-data';
import { updateCompanySettings } from '@/lib/firestore/app-writes';
import { companySettingsSchema } from '@/lib/validation/entities';
import { ensureSeedData } from '@/lib/firestore/seed';
import { ensureDb, handleRouteError, jsonData, requireAuth } from '@/lib/api/route-helpers';

export async function GET(request: Request) {
  try {
    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    const settings = await getCompanySettings();
    return jsonData(settings);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request) {
  try {
    await ensureDb();
    await ensureSeedData();
    requireAuth(request);
    const body = companySettingsSchema.parse(await request.json());
    const updated = await updateCompanySettings(body);
    return jsonData(updated);
  } catch (e) {
    return handleRouteError(e);
  }
}
