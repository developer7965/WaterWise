
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Storing them in an object to export for debugging in AppShell
export const firebaseConfigValues = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseProperlyConfigured = !!(
  firebaseConfigValues.apiKey &&
  firebaseConfigValues.authDomain &&
  firebaseConfigValues.projectId
);

// Check if essential Firebase config values are present
if (!isFirebaseProperlyConfigured) {
  console.error(
    "CRITICAL: Firebase configuration is missing or incomplete. " +
    "Please ensure all NEXT_PUBLIC_FIREBASE_... environment variables are correctly set in your .env.local file " +
    "(e.g., NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, etc.), " +
    "and that you have RESTARTED your development server after creating or modifying the .env.local file. " +
    "The app will likely fail to connect to Firebase, leading to 'auth/invalid-api-key' errors."
  );
}

let app: FirebaseApp;
let auth: Auth;
let storage: ReturnType<typeof getStorage>;

// Initialize Firebase only if configured, to prevent runtime errors from SDK
// if it tries to initialize with undefined/null critical values.
if (isFirebaseProperlyConfigured) {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfigValues);
  } else {
    app = getApps()[0]!;
  }
  auth = getAuth(app);
  storage = getStorage(app);
  // This log helps confirm the Firebase module was loaded and auth was attempted.
  console.log("Firebase SDK initialized in firebase.ts. Auth and Storage instances created.");
} else {
  // Provide dummy/null objects if not configured, so the app doesn't crash on import,
  // but AppShell will prevent usage.
  app = null as any; 
  auth = null as any; 
  storage = null as any;
  console.warn("Firebase is not configured. Auth and other Firebase services will not be available.");
}


export { app, auth, storage };

