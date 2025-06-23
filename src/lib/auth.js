import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { firebaseConfig } from "./firebase-config.js";
import { createLogger } from "./logger.js";

const logger = createLogger('Firebase');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.addScope('email');
googleProvider.addScope('profile');

export async function signInWithGoogle() {
  try {
    logger.emoji('🔑', 'Starting Google sign-in...');
    await signInWithRedirect(auth, googleProvider);
    // Note: signInWithRedirect doesn't return a result immediately
    // The result will be handled by getRedirectResult on page load
  } catch (error) {
    logger.error("❌ Google sign-in error:", error);
    logger.debug("❌ Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}

export async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      logger.emoji('✅', 'Google sign-in successful:', {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        emailVerified: result.user.emailVerified,
        photoURL: result.user.photoURL
      });
      logger.emoji('🔥', 'Firebase auth state should now trigger backend sync...');
      return result.user;
    }
    return null;
  } catch (error) {
    logger.error("❌ Redirect result error:", error);
    throw error;
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    logger.error("Logout error:", error);
    throw error;
  }
}

export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export { auth };