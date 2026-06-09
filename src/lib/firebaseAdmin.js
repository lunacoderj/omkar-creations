import admin from "firebase-admin";

let adminDb = null;
let adminStorage = null;
let adminAuth = null;

try {
  if (!admin.apps.length) {
    if (
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_CLIENT_EMAIL
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
  }

  if (admin.apps.length) {
    adminDb = admin.firestore();
    adminStorage = admin.storage();
    adminAuth = admin.auth();
  }
} catch (error) {
  console.warn("Firebase Admin init skipped:", error.message);
}

export { adminDb, adminStorage, adminAuth };
