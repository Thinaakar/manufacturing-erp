/**
 * Upload login hero image to Firebase Storage and register in Firestore.
 * Usage: node scripts/upload-login-hero.mjs
 * Requires FIREBASE_CREDENTIALS and FIREBASE_STORAGE_BUCKET in .env.local
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import admin from 'firebase-admin';

const LOCAL_PATH = 'src/assets/images/login-hero-bg.png';
const STORAGE_PATH = 'assets/login/hero.png';
const ASSET_DOC_ID = 'loginHero';

function loadCredentials() {
  const rel = process.env.FIREBASE_CREDENTIALS?.trim();
  if (!rel) throw new Error('Set FIREBASE_CREDENTIALS');
  const json = JSON.parse(readFileSync(resolve(process.cwd(), rel), 'utf8'));
  return {
    projectId: json.project_id,
    clientEmail: json.client_email,
    privateKey: json.private_key,
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET?.trim() || `${json.project_id}.appspot.com`,
  };
}

async function main() {
  const creds = loadCredentials();
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(creds),
      storageBucket: creds.storageBucket,
    });
  }

  const bucket = admin.storage().bucket(creds.storageBucket);
  const buffer = readFileSync(resolve(process.cwd(), LOCAL_PATH));
  const file = bucket.file(STORAGE_PATH);

  await file.save(buffer, {
    metadata: { contentType: 'image/png', cacheControl: 'public, max-age=31536000' },
    resumable: false,
  });

  try {
    await file.makePublic();
  } catch {
    /* uniform bucket access */
  }

  const url = `https://storage.googleapis.com/${creds.storageBucket}/${STORAGE_PATH}`;
  const db = admin.firestore();
  const templateRef = db.collection('templates').doc('manufacturing');
  const assetRef = templateRef.collection('tables').doc('appAssets').collection('records').doc(ASSET_DOC_ID);

  await assetRef.set(
    {
      url,
      contentType: 'image/png',
      path: STORAGE_PATH,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  console.log('Login hero uploaded:', url);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
