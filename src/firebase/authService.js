// ============================================================
// Auth Service — Login & Register using Firebase Authentication
// ============================================================
// This file handles all user login/register/logout operations.
// Firebase Auth stores users securely — no password stored by us.
// ============================================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, firebaseReady } from './config';

// REGISTER: Create a new pilgrim/staff account
export async function registerUser(name, email, password, role = 'pilgrim') {
  if (!firebaseReady) {
    throw { code: 'auth/not-configured', message: 'Firebase is not configured. Add your credentials to .env and restart.' };
  }

  // Step 1: Create the auth account
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Step 2: Save display name to Firebase Auth profile
  await updateProfile(user, { displayName: name });

  // Step 3: Reload the user so the updated displayName is available immediately
  // Without this, user.displayName may be null until the next page load
  await user.reload();

  // Step 4: Save extra user info to Firestore "users" collection
  await setDoc(doc(db, 'users', user.uid), {
    name,
    email,
    role,          // 'pilgrim' | 'staff' | 'admin'
    createdAt: serverTimestamp()
  });

  // Return the refreshed user object with displayName populated
  return auth.currentUser;
}

// LOGIN: Sign in with email and password
export async function loginUser(email, password) {
  if (!firebaseReady) {
    throw { code: 'auth/not-configured', message: 'Firebase is not configured. Add your credentials to .env and restart.' };
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// LOGOUT: Sign out the current user
export async function logoutUser() {
  await signOut(auth);
}

// GET USER PROFILE: Read extra user data from Firestore
export async function getUserProfile(uid) {
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err) {
    console.warn('Could not fetch user profile from Firestore:', err.message);
    return null;
  }
}

// LISTEN: Watch for login/logout changes in real-time
// Pass a callback function — it runs whenever auth state changes
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
