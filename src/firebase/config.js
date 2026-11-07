// ============================================================
// Firebase Configuration — DarshanSetu Project
// ============================================================
// SETUP STEPS (do this once):
// 1. Go to https://firebase.google.com → Create project "darshansetu"
// 2. Click ⚙️ (Settings) → Project Settings → Your apps → Add Web App
// 3. Copy the firebaseConfig object values into a .env file
//    (see .env.example for the template)
// 4. Enable these in Firebase Console:
//    - Authentication → Email/Password
//    - Firestore Database → Start in test mode
//    - Storage → Start in test mode
//    - Realtime Database → Start in test mode
// ============================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

// Read config from Vite environment variables (.env file)
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate config at startup — fail fast with a clear message
const isConfigured = firebaseConfig.apiKey
  && firebaseConfig.apiKey !== 'YOUR_API_KEY'
  && firebaseConfig.projectId
  && firebaseConfig.projectId !== 'YOUR_PROJECT_ID';

if (!isConfigured) {
  console.error(
    '🔴 Firebase is NOT configured!\n' +
    '   1. Copy .env.example → .env\n' +
    '   2. Fill in your Firebase project values\n' +
    '   3. Restart the dev server (npm run dev)'
  );
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firebase services — import these anywhere in the app
export const auth     = getAuth(app);       // Authentication
export const db       = getFirestore(app);  // Firestore database
export const storage  = getStorage(app);    // File storage (photos)
export const rtdb     = getDatabase(app);   // Realtime database (live GPS)

// Export flag so other code can check before calling Firebase
export const firebaseReady = isConfigured;

export default app;
