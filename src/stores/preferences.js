import { writable } from 'svelte/store';
import { userService } from '../lib/api.js';

export const userPreferences = writable(null);

let currentUser = null;
let lastLoadedUserId = null;
let lastLoadedPrefs = null;

export async function loadUserPreferences(user) {
  if (!user) {
    userPreferences.set(null);
    lastLoadedUserId = null;
    lastLoadedPrefs = null;
    return;
  }
  
  // Skip if already loaded for this user (caching)
  if (lastLoadedUserId === user.id && lastLoadedPrefs) {
    console.log('📋 Using cached preferences for user:', user.id);
    userPreferences.set(lastLoadedPrefs);
    return lastLoadedPrefs;
  }
  
  currentUser = user;
  
  try {
    console.log('📋 Loading preferences from API for user:', user.id);
    const prefsData = await userService.getUserPreferences(user.id);
    
    // Cache the results
    lastLoadedUserId = user.id;
    lastLoadedPrefs = prefsData.preferences;
    
    userPreferences.set(prefsData.preferences);
    return prefsData.preferences;
  } catch (error) {
    console.warn('Could not load user preferences:', error);
    userPreferences.set({});
    return {};
  }
}

export async function updateUserPreferences(newPreferences) {
  if (!currentUser) {
    throw new Error('No current user');
  }
  
  try {
    const updatedPrefs = await userService.updateUserPreferences(currentUser.id, newPreferences);
    
    // Update cache with new preferences
    lastLoadedUserId = currentUser.id;
    lastLoadedPrefs = updatedPrefs.preferences;
    
    userPreferences.set(updatedPrefs.preferences);
    return updatedPrefs.preferences;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
}

/**
 * Clear the preferences cache (useful for testing or when switching users)
 */
export function clearPreferencesCache() {
  lastLoadedUserId = null;
  lastLoadedPrefs = null;
  console.log('📋 Preferences cache cleared');
}