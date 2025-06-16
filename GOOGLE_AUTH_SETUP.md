# Google Authentication Setup Guide

This guide will help you set up Google authentication for your static website hosted on GitHub Pages.

## Prerequisites

- A Google account
- Firebase project (free tier is sufficient)
- Your website deployed on GitHub Pages

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "elys-auth")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Google Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click on the **Sign-in method** tab
3. Find **Google** in the list and click on it
4. Toggle the **Enable** switch
5. Enter your project's public-facing name
6. Choose a support email
7. Click **Save**

## Step 3: Register Your Web App

1. Go to **Project Settings** (gear icon in sidebar)
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Enter an app nickname (e.g., "Elys Website")
5. Check "Also set up Firebase Hosting" if you want (optional)
6. Click **Register app**
7. Copy the `firebaseConfig` object shown

## Step 4: Configure Your Application

1. Open `src/lib/firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase config:

```javascript
export const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Add Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings** tab
2. Scroll down to **Authorized domains**
3. Add your GitHub Pages domain:
   - `yourusername.github.io` (if using default domain)
   - `your-custom-domain.com` (if using custom domain)
4. Add `localhost` for local development
5. Click **Add domain** for each

## Step 6: Test Your Setup

1. Build and deploy your site:
   ```bash
   npm run build
   git add .
   git commit -m "Add Google authentication"
   git push origin main
   ```

2. Visit your GitHub Pages site
3. Click the "Sign in with Google" button
4. Complete the Google sign-in flow
5. You should see your profile picture and name in the header

## Security Considerations

### API Key Restrictions (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** > **Credentials**
4. Find your API key and click the edit icon
5. Under **Application restrictions**, select **HTTP referrers**
6. Add your domains:
   - `https://yourusername.github.io/*`
   - `https://your-custom-domain.com/*`
   - `http://localhost:*` (for development)

### Firebase Security Rules

If you plan to use Firestore or other Firebase services, set up proper security rules:

```javascript
// Example Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Adding More Authentication Providers

To add Apple Sign-In or other providers later:

1. Enable the provider in Firebase Console
2. Update `src/lib/auth.js` to include the new provider
3. Add corresponding UI buttons in `src/components/Header.svelte`

Example for Apple Sign-In:
```javascript
import { OAuthProvider } from "firebase/auth";

const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export async function signInWithApple() {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    return result.user;
  } catch (error) {
    console.error("Apple sign-in error:", error);
    throw error;
  }
}
```

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to authorized domains in Firebase Console

2. **"Firebase: Error (auth/api-key-not-valid)"**
   - Check that your API key is correct in `firebase-config.js`
   - Ensure API key restrictions allow your domain

3. **Sign-in popup blocked**
   - Users need to allow popups for your domain
   - Consider using redirect-based sign-in for mobile

4. **CORS errors**
   - Ensure your domain is properly configured in Firebase
   - Check that you're using HTTPS (required for production)

### Development vs Production

- Use `http://localhost:*` for local development
- Use `https://` for production (GitHub Pages automatically provides HTTPS)
- Test both environments before deploying

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Firebase configuration
3. Ensure all domains are properly authorized
4. Check Firebase Console for authentication logs