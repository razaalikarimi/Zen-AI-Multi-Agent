import { initializeApp, cert } from "firebase-admin/app";

import serviceAccount from "../serviceAccount.json" with { type: "json" };

let app;
try {
  if (serviceAccount.type === "paste your service account file") {
    console.warn("⚠️ Warning: Firebase serviceAccount.json is a placeholder. Firebase features will not work.");
    app = initializeApp({
      credential: cert({
        projectId: "dummy-project-id",
        clientEmail: "dummy-email@dummy.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3\n-----END PRIVATE KEY-----\n"
      })
    });
  } else {
    app = initializeApp({
      credential: cert(serviceAccount),
    });
  }
} catch (e) {
  console.error("❌ Error initializing Firebase Admin:", e.message);
  try {
    app = initializeApp({
      credential: cert({
        projectId: "dummy-project-id",
        clientEmail: "dummy-email@dummy.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3\n-----END PRIVATE KEY-----\n"
      })
    });
  } catch (err) {
    // If it's already initialized or throws, ignore
  }
}

export { app };