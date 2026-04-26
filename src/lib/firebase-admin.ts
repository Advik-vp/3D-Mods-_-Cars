import * as admin from 'firebase-admin';

let authInstance: admin.auth.Auth | null = null;

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID || 'mock-project-id',
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'mock-client-email',
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      authInstance = admin.auth();
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
} else {
  authInstance = admin.auth();
}

export const adminAuth = authInstance;
