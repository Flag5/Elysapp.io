/**
 * API service layer for communicating with the Elys backend.
 * Handles HTTP requests, authentication, and error handling.
 */

import { API_ENDPOINTS, STORAGE_KEYS } from './config.js';
import { createLogger } from './logger.js';

const logger = createLogger('API');

/**
 * HTTP client class for API communication
 */
class ApiClient {
  constructor() {
    this.baseHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get authentication headers with session token
   */
  getAuthHeaders() {
    const token = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
    if (token) {
      return {
        ...this.baseHeaders,
        'Authorization': `Bearer ${token}`,
      };
    }
    return this.baseHeaders;
  }


  /**
   * Make HTTP request with error handling
   */
  async request(url, options = {}) {
    try {
      logger.emoji('🌐', `API Request: ${options.method || 'GET'} ${url}`);
      if (options.body) {
        logger.debug('📤 Request payload:', JSON.parse(options.body));
      }
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
        ...options,
      });
      
      logger.emoji('📡', `API Response: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`❌ API Error Response: ${response.status} ${response.statusText}`);
        logger.error('❌ Error body:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText || `HTTP ${response.status}: ${response.statusText}` };
        }
        
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      logger.debug('📥 Response data:', result);
      
      return result;
    } catch (error) {
      logger.error('❌ API Request failed:', error);
      logger.debug('❌ Error details:', {
        url,
        method: options.method || 'GET',
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(url) {
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(url) {
    return this.request(url, { method: 'DELETE' });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

/**
 * User API service
 */
export const userService = {
  /**
   * Create or update user from Google OAuth data
   */
  async createUser(googleUser) {
    const userData = {
      firebase_uid: googleUser.uid,
      email: googleUser.email,
      display_name: googleUser.displayName,
      photo_url: googleUser.photoURL,
      email_verified: googleUser.emailVerified,
      google_profile_data: {
        uid: googleUser.uid,
        email: googleUser.email,
        displayName: googleUser.displayName,
        photoURL: googleUser.photoURL,
        emailVerified: googleUser.emailVerified,
        providerId: googleUser.providerId,
        // Add any additional Google profile data
        ...googleUser.providerData?.[0] || {},
      },
    };

    return apiClient.post(API_ENDPOINTS.USERS, userData);
  },

  /**
   * Get user by ID
   */
  async getUser(userId) {
    return apiClient.get(API_ENDPOINTS.USER_BY_ID(userId));
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    return apiClient.get(API_ENDPOINTS.USER_ME);
  },

  /**
   * Update user information
   */
  async updateUser(userId, userData) {
    return apiClient.put(API_ENDPOINTS.USER_BY_ID(userId), userData);
  },

  /**
   * Get user preferences
   */
  async getUserPreferences(userId) {
    return apiClient.get(API_ENDPOINTS.USER_PREFERENCES(userId));
  },

  /**
   * Update user preferences
   */
  async updateUserPreferences(userId, preferences) {
    return apiClient.put(API_ENDPOINTS.USER_PREFERENCES(userId), { preferences });
  },

  /**
   * Get user activity history
   */
  async getUserActivity(userId, limit = 50, offset = 0) {
    const url = `${API_ENDPOINTS.USER_ACTIVITY(userId)}?limit=${limit}&offset=${offset}`;
    return apiClient.get(url);
  },

  /**
   * Create user activity
   */
  async createUserActivity(userId, activityType, activityData = {}) {
    return apiClient.post(API_ENDPOINTS.USER_ACTIVITY(userId), {
      activity_type: activityType,
      activity_data: activityData,
    });
  },
};

/**
 * Authentication API service
 */
export const authService = {
  /**
   * Create user session (login)
   */
  async createSession(googleUser) {
    const loginData = {
      firebase_uid: googleUser.uid,
      email: googleUser.email,
      display_name: googleUser.displayName,
      photo_url: googleUser.photoURL,
      email_verified: googleUser.emailVerified,
      google_profile_data: {
        uid: googleUser.uid,
        email: googleUser.email,
        displayName: googleUser.displayName,
        photoURL: googleUser.photoURL,
        emailVerified: googleUser.emailVerified,
        providerId: googleUser.providerId,
        ...googleUser.providerData?.[0] || {},
      },
    };

    const response = await apiClient.post(API_ENDPOINTS.AUTH_SESSION, loginData);
    
    // Store session token
    if (response.session_token) {
      localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, response.session_token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
    }

    return response;
  },

  /**
   * Validate current session
   */
  async validateSession() {
    return apiClient.get(API_ENDPOINTS.AUTH_VALIDATE);
  },

  /**
   * End current session (logout)
   */
  async endSession() {
    try {
      await apiClient.delete(API_ENDPOINTS.AUTH_SESSION);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
    }
  },

  /**
   * Get all user sessions
   */
  async getUserSessions() {
    return apiClient.get(API_ENDPOINTS.AUTH_SESSIONS);
  },

  /**
   * End all user sessions
   */
  async endAllSessions() {
    try {
      await apiClient.delete(`${API_ENDPOINTS.AUTH_SESSIONS}/all`);
    } finally {
      // Clear local storage
      localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
  },

  /**
   * Get stored user data
   */
  getStoredUser() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },
};

/**
 * Health check service
 */
export const healthService = {
  /**
   * Check API health
   */
  async checkHealth() {
    return apiClient.get(API_ENDPOINTS.HEALTH);
  },
};

// Export the API client for custom requests
export { apiClient };