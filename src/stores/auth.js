import { writable } from 'svelte/store';
import { onAuthStateChange, handleRedirectResult } from '../lib/auth.js';
import { userService, authService } from '../lib/api.js';
import { STORAGE_KEYS } from '../lib/config.js';
import { createLogger } from '../lib/logger.js';


const logger = createLogger('Auth');

// Create writable stores for user and loading state
export const user = writable(null);
export const loading = writable(true);

// Backend user data and session management
export const backendUser = writable(null);
export const sessionToken = writable(null);
// User preferences removed
export const isAuthenticated = writable(false);

// Initialize auth state listener
let unsubscribe;

/**
 * Handle user authentication with backend integration
 */
async function handleUserAuthentication(firebaseUser) {
  if (firebaseUser) {
    try {
      logger.emoji('🔐', 'Firebase user authenticated, syncing with backend...');
      logger.debug('👤 Firebase user data:', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        emailVerified: firebaseUser.emailVerified,
        providerId: firebaseUser.providerId,
        providerData: firebaseUser.providerData
      });
      
      // Create or update user in backend
      logger.emoji('📤', 'Calling backend to create/update user...');
      const backendUserData = await userService.createUser(firebaseUser);
      logger.emoji('✅', 'User synced with backend:', backendUserData);
      
      // Add a small delay to ensure user is properly saved before creating session
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create session
      logger.emoji('📤', 'Calling backend to create session...');
      const sessionData = await authService.createSession(firebaseUser);
      logger.emoji('✅', 'Session created:', sessionData);
      
      // Update stores
      backendUser.set(sessionData.user);
      sessionToken.set(sessionData.session_token);
      isAuthenticated.set(true);
      
      // User preferences removed
      
      // Log login activity
      try {
        await userService.createUserActivity(
          sessionData.user.id,
          'login',
          { method: 'google_oauth', timestamp: new Date().toISOString() }
        );
        logger.emoji('✅', 'Login activity logged successfully');
      } catch (error) {
        logger.warn('Could not log activity:', error);
      }
      
    } catch (error) {
      logger.error('❌ Backend authentication failed:', error);
      logger.debug('❌ Backend error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      // Still set Firebase user even if backend fails
      backendUser.set(null);
      sessionToken.set(null);
      isAuthenticated.set(false);
    }
  } else {
    logger.emoji('🔓', 'User logged out');
    
    // Clear backend session if exists
    if (authService.isAuthenticated()) {
      try {
        await authService.endSession();
      } catch (error) {
        logger.warn('Could not end backend session:', error);
      }
    }
    
    // Clear stores
    backendUser.set(null);
    sessionToken.set(null);
    // User preferences removed
    isAuthenticated.set(false);
  

  }
  
  // Always update Firebase user state
  user.set(firebaseUser);
  loading.set(false);
}

/**
 * Initialize authentication store with backend integration
 */
export function initAuthStore() {
  logger.emoji('🚀', 'Initializing auth store...');
  
  // Handle redirect result from Google sign-in
  handleRedirectResult().then((user) => {
    if (user) {
      logger.emoji('🎉', 'Redirect result successful, user found:', user.email);
    } else {
      logger.debug('📭 No redirect result found on init');
    }
  }).catch((error) => {
    logger.error('❌ Redirect result error:', error);
    logger.debug('❌ Redirect error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
  });
  
  // Check for existing session on startup
  const storedToken = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
  const storedUser = authService.getStoredUser();
  
  if (storedToken && storedUser) {
    logger.emoji('🔄', 'Restoring session from storage...');
    sessionToken.set(storedToken);
    backendUser.set(storedUser);
    isAuthenticated.set(true);
    
    // Validate session with backend
    authService.validateSession()
      .then(() => {
        logger.emoji('✅', 'Session validated');
        // User preferences removed
        return Promise.resolve();
      })
      .then(() => {
        // User preferences removed
      })
      .catch((error) => {
        logger.warn('❌ Session validation failed:', error);
        // Clear invalid session
        authService.endSession();
        backendUser.set(null);
        sessionToken.set(null);
        isAuthenticated.set(false);

      });
  } else {
    logger.emoji('📭', 'No stored session found');
  }
  
  // Listen to Firebase auth state changes
  logger.emoji('👂', 'Setting up Firebase auth state listener...');
  unsubscribe = onAuthStateChange((firebaseUser) => {
    logger.emoji('🔥', 'Firebase auth state changed:', firebaseUser ? 'USER LOGGED IN' : 'USER LOGGED OUT');
    if (firebaseUser) {
      logger.debug('👤 Firebase user details:', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        emailVerified: firebaseUser.emailVerified,
        providerId: firebaseUser.providerId,
        accessToken: firebaseUser.accessToken ? 'PRESENT' : 'MISSING',
        refreshToken: firebaseUser.refreshToken ? 'PRESENT' : 'MISSING'
      });
    } else {
      logger.debug('🚫 User logged out - checking why...');
    }
    handleUserAuthentication(firebaseUser);
  });
  
  logger.emoji('✅', 'Auth store initialized');
}

/**
 * Destroy authentication store
 */
export function destroyAuthStore() {
  if (unsubscribe) {
    unsubscribe();
  }
}

// User preferences functionality removed

/**
 * Logout user from both Firebase and backend
 */
export async function logoutUser() {
  try {
    // End backend session first
    if (authService.isAuthenticated()) {
      await authService.endSession();
    }
    
    // Then logout from Firebase (this will trigger the auth state change)
    const { logout } = await import('../lib/auth.js');
    await logout();
    
    console.log('✅ User logged out successfully');
  } catch (error) {
    console.error('❌ Logout error:', error);
    // Force clear local state even if logout fails
    backendUser.set(null);
    sessionToken.set(null);
    // User preferences removed
    isAuthenticated.set(false);
    user.set(null);

  }
}