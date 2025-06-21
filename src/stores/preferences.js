import { writable } from 'svelte/store';
import { userService } from '../lib/api.js';

export const userPreferences = writable(null);

let currentUser = null;

export async function loadUserPreferences(user) {
  if (!user) {
    userPreferences.set(null);
    return;
  }
  
  currentUser = user;
  
  try {
    const prefsData = await userService.getUserPreferences(user.id);
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
    userPreferences.set(updatedPrefs.preferences);
    return updatedPrefs.preferences;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
}