/**
 * Configuration for the Elys frontend application.
 * Handles environment-based settings for API endpoints and other configurations.
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // User Management
  USERS: `${API_BASE_URL}/api/v1/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/api/v1/users/${id}`,
  USER_ME: `${API_BASE_URL}/api/v1/users/me`,
  // USER_PREFERENCES removed since preferences system was removed
  USER_ACTIVITY: (id) => `${API_BASE_URL}/api/v1/users/${id}/activity`,
  
  // Authentication
  AUTH_SESSION: `${API_BASE_URL}/api/v1/auth/session`,
  AUTH_VALIDATE: `${API_BASE_URL}/api/v1/auth/session/validate`,
  AUTH_SESSIONS: `${API_BASE_URL}/api/v1/auth/sessions`,
  
  // Chat
  WEBCHAT: `${API_BASE_URL}/api/v1/chat`,
  CHAT_CONVERSATIONS: `${API_BASE_URL}/api/v1/chat/conversations`,
  CHAT_CONVERSATION_MESSAGES: (id) => `${API_BASE_URL}/api/v1/chat/conversations/${id}/messages`,
  
  // Health Check
  HEALTH: `${API_BASE_URL}/api/v1/health`,
};

// Default user preferences removed since preferences system was removed

// Session storage keys
export const STORAGE_KEYS = {
  SESSION_TOKEN: 'elys_session_token',
  USER_DATA: 'elys_user_data',
  // USER_PREFERENCES removed since preferences system was removed
};

// Environment detection
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Only log configuration in development
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    baseUrl: API_BASE_URL,
    environment: isDevelopment ? 'development' : 'production'
  });
}