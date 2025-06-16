// Firebase configuration using environment variables
// This is secure for client-side apps as Firebase API keys are meant to be public
// but should still be managed through environment variables for better practices

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Instructions:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select an existing one
// 3. Go to Project Settings > General
// 4. Scroll down to "Your apps" section
// 5. Click "Add app" and select Web (</>) if you haven't already
// 6. Copy the config object and replace the values above
// 7. Go to Authentication > Sign-in method
// 8. Enable Google sign-in provider
// 9. Add your domain (e.g., yourdomain.github.io) to authorized domains