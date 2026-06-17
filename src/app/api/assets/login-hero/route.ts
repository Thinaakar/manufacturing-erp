import { getLoginHeroAsset } from '@/lib/firestore/app-data';
import { syncLoginHeroAsset } from '@/lib/firestore/app-writes';
import { ensureSeedData } from '@/lib/firestore/seed';
import { isFirebaseConfigured } from '@/lib/firebase/admin';
import { ensureDb, handleRouteError, jsonData } from '@/lib/api/route-helpers';

export async function GET() {
  try {
    if (!isFirebaseConfigured()) {
      return jsonData({ url: null, source: 'local' });
    }
    await ensureDb();
    await ensureSeedData();
    let asset = await getLoginHeroAsset();
    if (!asset?.url) {
      try {
        const synced = await syncLoginHeroAsset();
        asset = { id: 'loginHero', url: synced.url, createdAt: '', updatedAt: '' };
      } catch {
        return jsonData({ url: null, source: 'local' });
      }
    }
    return jsonData({ url: asset.url, source: 'firebase' });
  } catch (e) {
    return handleRouteError(e);
  }
}
