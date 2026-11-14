import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const isKeyConfigured = Boolean(
  apiKey &&
  typeof apiKey === "string" &&
  apiKey.trim() !== "" &&
  apiKey !== "undefined" &&
  !apiKey.includes("your_firebase")
);

const firebaseConfig = {
  apiKey: isKeyConfigured ? apiKey : "AIzaSy_demo_resilient_key_zen_platform",
  authDomain: "zen-ai-1db15.firebaseapp.com",
  projectId: "zen-ai-1db15",
};

let app = null;
let auth = null;

if (isKeyConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (err) {
    console.warn("Firebase Auth initialization skipped:", err?.message || err);
    auth = null;
  }
} else {
  console.info("Notice: VITE_FIREBASE_API_KEY is not configured in .env. Firebase auth will operate in fallback mode.");
}

export { auth };
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export default app;
