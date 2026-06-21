/**
 * Firebase client service layer.
 *
 * NEXT_PUBLIC_FIREBASE_* values are intentionally public — Firebase's
 * web SDK is designed to ship these to the browser, and access control
 * is enforced server-side via Firestore/Storage security rules, not by
 * secrecy of these values. (This is different from the Gemini API key,
 * which is a real secret and must never be NEXT_PUBLIC_.)
 *
 * This module used to call initializeApp() unconditionally at import
 * time, which would throw and potentially crash any page that imports
 * it if env vars were missing or malformed. It now validates config
 * up front and wraps initialization in a try/catch, exposing
 * `firebaseEnabled` / `firebaseInitError` so calling code can degrade
 * gracefully instead of the whole app failing to load.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

type FirebaseConfigKey = keyof typeof firebaseConfig;

const REQUIRED_CONFIG_KEYS: FirebaseConfigKey[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

function getMissingConfigKeys(): FirebaseConfigKey[] {
  return REQUIRED_CONFIG_KEYS.filter((key) => !firebaseConfig[key]);
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let firebaseInitError: string | null = null;

const missingKeys = getMissingConfigKeys();

if (missingKeys.length > 0) {
  firebaseInitError = `Firebase config is incomplete. Missing: ${missingKeys
    .map((key) => `NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`)
    .join(', ')}. Check .env.local.`;
  // Intentionally a warning, not a throw: Firebase is an optional,
  // not-yet-wired-in service layer per the README, so a missing config
  // should not prevent the rest of the app from rendering.
  console.warn(`[firebase] ${firebaseInitError}`);
} else {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    firebaseInitError =
      error instanceof Error ? error.message : 'Unknown Firebase initialization error.';
    console.error('[firebase] Failed to initialize Firebase:', firebaseInitError);
    app = null;
    auth = null;
    db = null;
    storage = null;
  }
}

/** True only if Firebase initialized successfully and is safe to use. */
export const firebaseEnabled = app !== null && firebaseInitError === null;

export { app, auth, db, storage, firebaseInitError };
