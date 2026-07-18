import { initializeApp, cert } from "firebase-admin/app";

let serviceAccount;
try {
  // Use dynamic import to prevent compile-time module missing crash
  const module = await import("../serviceAccount.json", { with: { type: "json" } });
  serviceAccount = module.default;
} catch (e) {
  // ignored
}

if (!serviceAccount || serviceAccount.type === "paste your service account file") {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (parseError) {
      console.error("❌ Error parsing FIREBASE_SERVICE_ACCOUNT env var:", parseError.message);
    }
  }
}

let app;
if (serviceAccount && serviceAccount.type !== "paste your service account file") {
  try {
    app = initializeApp({
      credential: cert(serviceAccount),
    });
    console.log("✅ Firebase Admin successfully initialized.");
  } catch (initError) {
    console.error("❌ Error initializing Firebase Admin with credentials:", initError.message);
  }
} else {
  console.warn("⚠️ Warning: Firebase serviceAccount.json is missing or a placeholder. Using dummy or env credentials.");
  try {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID || "dummy-project-id",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "dummy-email@dummy.iam.gserviceaccount.com",
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3\n-----END PRIVATE KEY-----\n").replace(/\\n/g, '\n')
      })
    });
  } catch (e) {
    // Suppress secondary initialization error if already initialized
  }
}

export { app };