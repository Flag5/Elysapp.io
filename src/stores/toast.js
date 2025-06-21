import { writable } from 'svelte/store';

export const toasts = writable([]);

let toastId = 0;

export function addToast(message, type = 'success', duration = 4000) {
  const id = toastId++;
  const toast = { id, message, type, duration };
  
  toasts.update(currentToasts => [...currentToasts, toast]);
  
  // Auto remove after duration
  setTimeout(() => {
    removeToast(id);
  }, duration);
  
  return id;
}

export function removeToast(id) {
  toasts.update(currentToasts => currentToasts.filter(toast => toast.id !== id));
}

export function clearAllToasts() {
  toasts.set([]);
}