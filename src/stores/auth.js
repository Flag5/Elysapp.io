import { writable } from 'svelte/store';
import { onAuthStateChange } from '../lib/auth.js';

// Create writable stores for user and loading state
export const user = writable(null);
export const loading = writable(true);

// Initialize auth state listener
let unsubscribe;

export function initAuthStore() {
  unsubscribe = onAuthStateChange((currentUser) => {
    user.set(currentUser);
    loading.set(false);
  });
}

export function destroyAuthStore() {
  if (unsubscribe) {
    unsubscribe();
  }
}