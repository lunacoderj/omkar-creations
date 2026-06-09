import admin from "firebase-admin";

let adminDb = null;
let adminStorage = null;
let adminAuth = null;

try {
  if (!admin.apps.length) {
    // Try to load local service account key first (for development)
    let serviceAccount = null;
    try {
      if (process.env.NODE_ENV === "development") {
        serviceAccount = require("../../scripts/serviceAccountKey.json");
      }
    } catch (e) {
      // Ignore if file doesn't exist
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "omkar-creations.firebasestorage.app",
      });
    } else if (
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_CLIENT_EMAIL
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "omkar-creations.firebasestorage.app",
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
