/**
 * Beta test utility functions for managing user beta program participation
 */

import { userService } from './api.js';

/**
 * Join the beta test program for a user
 * @param {Object} currentUser - The current user object
 * @param {Object} userPreferences - Current user preferences
 * @returns {Promise<Object>} Updated preferences
 */
export async function joinBetaTest(currentUser, userPreferences) {
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  
  const updatedPrefs = {
    ...userPreferences,
    betatest: true,
    betatest_joined_at: new Date().toISOString()
  };
  
  await userService.updateUserPreferences(currentUser.id, updatedPrefs);
  return updatedPrefs;
}

/**
 * Leave the beta test program for a user
 * @param {Object} currentUser - The current user object
 * @param {Object} userPreferences - Current user preferences
 * @returns {Promise<Object>} Updated preferences
 */
export async function leaveBetaTest(currentUser, userPreferences) {
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  
  const updatedPrefs = {
    ...userPreferences,
    betatest: false,
    betatest_left_at: new Date().toISOString()
  };
  
  await userService.updateUserPreferences(currentUser.id, updatedPrefs);
  return updatedPrefs;
}

/**
 * Check if user is in beta test program
 * @param {Object} userPreferences - User preferences object
 * @returns {boolean} True if user is in beta program
 */
export function isBetaTestMember(userPreferences) {
  return userPreferences?.betatest === true;
}

/**
 * Get beta test status message for user
 * @param {Object} currentUser - The current user object
 * @param {Object} userPreferences - User preferences object
 * @returns {string} Status message
 */
export function getBetaTestStatusMessage(currentUser, userPreferences) {
  if (!currentUser) {
    return 'Please log in to join our beta testing program.';
  }
  
  if (isBetaTestMember(userPreferences)) {
    const userEmail = currentUser.email || 'your registered email';
    return `You're already signed up for our beta program! We'll notify you at ${userEmail} when new features are ready.`;
  }
  
  return 'Join our beta program to get early access to new features!';
}