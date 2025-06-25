import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
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

// Add custom parameters to help with debugging and COOP issues
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: undefined, // Allow any domain
  // Help with Cross-Origin-Opener-Policy issues
  display: 'popup'
});

export async function signInWithGoogle() {
  try {
    logger.emoji('🔑', 'Starting Google sign-in...');
    logger.debug('🔧 Firebase config check:', {
      apiKey: firebaseConfig.apiKey ? 'SET' : 'MISSING',
      authDomain: firebaseConfig.authDomain ? 'SET' : 'MISSING',
      projectId: firebaseConfig.projectId ? 'SET' : 'MISSING'
    });
    logger.debug('🌐 Current domain:', window.location.origin);
    
    // Try popup first, fallback to redirect if popup fails
    try {
      logger.debug('🪟 Attempting popup sign-in...');
      const result = await signInWithPopup(auth, googleProvider);
      logger.emoji('✅', 'Popup sign-in successful!');
      return result.user;
    } catch (popupError) {
      logger.debug('🚫 Popup failed:', popupError.code);
      
      if (popupError.code === 'auth/popup-blocked' ||
          popupError.code === 'auth/popup-closed-by-user' ||
          popupError.code === 'auth/cancelled-popup-request') {
        logger.debug('🔄 Falling back to redirect method...');
        await signInWithRedirect(auth, googleProvider);
        // Note: signInWithRedirect doesn't return a result immediately
        // The result will be handled by getRedirectResult on page load
      } else {
        throw popupError;
      }
    }
  } catch (error) {
    logger.error("❌ Google sign-in error:", error);
    logger.debug("❌ Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
      customData: error.customData
    });
    throw error;
  }
}

export async function handleRedirectResult() {
  try {
    logger.debug('🔄 Checking for redirect result...');
    logger.debug('🌐 Current URL:', window.location.href);
    
    const result = await getRedirectResult(auth);
    if (result) {
      logger.emoji('✅', 'Redirect sign-in successful:', {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        emailVerified: result.user.emailVerified
      });
      logger.emoji('🔥', 'Firebase auth state should now trigger backend sync...');
      return result.user;
    } else {
      logger.debug('📭 No redirect result found');
      // Check if we're returning from a redirect attempt
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('state') || urlParams.has('code') || window.location.hash.includes('access_token')) {
        logger.warn('⚠️ URL has OAuth params but no redirect result - possible auth flow issue');
        logger.debug('🔍 URL params:', Object.fromEntries(urlParams));
        logger.debug('🔍 Hash:', window.location.hash);
      }
    }
    return null;
  } catch (error) {
    logger.error("❌ Redirect result error:", error);
    logger.debug("❌ Redirect error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
      customData: error.customData
    });
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
  return onAuthStateChanged(auth, (user) => {
    logger.debug('🔥 Firebase auth state changed:', {
      user: user ? {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      } : null,
      timestamp: new Date().toISOString()
    });
    callback(user);
  });
}

export { auth };