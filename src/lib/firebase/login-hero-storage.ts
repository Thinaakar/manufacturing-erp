/** Upload and resolve login hero image in Firebase Storage. */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getAdminStorageBucket } from '@/lib/firebase/admin';

const STORAGE_PATH = 'assets/login/hero.png';
const LOCAL_HERO_PATH = 'src/assets/images/login-hero-bg.png';

export function loginHeroStoragePath(): string {
  return STORAGE_PATH;
}

export function getPublicStorageUrl(bucketName: string, filePath: string): string {
  return `https://storage.googleapis.com/${bucketName}/${filePath}`;
}

export function isFirebaseStorageUrl(url?: string | null): boolean {
  const trimmed = url?.trim() ?? '';
  if (!trimmed) return false;
  return (
    trimmed.includes('firebasestorage.googleapis.com') ||
    trimmed.includes('storage.googleapis.com') ||
    trimmed.startsWith('gs://')
  );
}

export async function uploadLoginHeroBuffer(
  buffer: Buffer,
  contentType = 'image/png',
): Promise<string> {
  const bucket = getAdminStorageBucket();
  const path = loginHeroStoragePath();
  const file = bucket.file(path);

  await file.save(buffer, {
    metadata: {
      contentType,
      cacheControl: 'public, max-age=31536000',
    },
    resumable: false,
  });

  try {
    await file.makePublic();
  } catch {
    // uniform bucket-level access may ignore makePublic
  }

  return getPublicStorageUrl(bucket.name, path);
}

export function readLocalLoginHeroBuffer(): Buffer {
  const filePath = resolve(process.cwd(), LOCAL_HERO_PATH);
  return readFileSync(filePath);
}

/** Upload bundled login hero from repo if not already in bucket. */
export async function ensureLoginHeroInStorage(): Promise<string> {
  const bucket = getAdminStorageBucket();
  const path = loginHeroStoragePath();
  const file = bucket.file(path);
  const [exists] = await file.exists();
  if (exists) {
    return getPublicStorageUrl(bucket.name, path);
  }
  const buffer = readLocalLoginHeroBuffer();
  return uploadLoginHeroBuffer(buffer, 'image/png');
}
