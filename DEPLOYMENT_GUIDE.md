# Deployment Guide for Google Authentication

## 🚀 GitHub Pages Deployment

### Option 1: Manual Build & Deploy
```bash
# 1. Build the project
npm run build

# 2. Commit and push
git add .
git commit -m "Add Google authentication"
git push origin main

# 3. GitHub Pages will automatically deploy from the dist folder
```

### Option 2: GitHub Actions (Automated)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
        VITE_FIREBASE_MEASUREMENT_ID: ${{ secrets.FIREBASE_MEASUREMENT_ID }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🔧 Environment Setup

### For GitHub Actions:
1. Go to your repository Settings > Secrets and variables > Actions
2. Add these secrets:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`

### For Manual Deployment:
The build process will use your local `.env.local` file.

## 🌐 Firebase Configuration

### 1. Add Your Domain to Firebase
1. Go to Firebase Console > Authentication > Settings
2. Add your GitHub Pages domain to "Authorized domains":
   - `yourusername.github.io`
   - `your-custom-domain.com` (if using custom domain)

### 2. Configure API Key Restrictions (Optional but Recommended)
1. Go to Google Cloud Console
2. Select your Firebase project
3. Go to APIs & Services > Credentials
4. Edit your API key
5. Add HTTP referrer restrictions:
   - `https://yourusername.github.io/*`
   - `https://your-custom-domain.com/*`

## ✅ Testing Your Deployment

1. Visit your GitHub Pages URL
2. Click "Sign in with Google"
3. Complete the authentication flow
4. You should see your profile picture and name in the header

## 🔍 Troubleshooting

### Common Issues:

**"Firebase: Error (auth/unauthorized-domain)"**
- Solution: Add your domain to Firebase authorized domains

**"Firebase: Error (auth/api-key-not-valid)"**
- Solution: Check your environment variables are set correctly

**Build fails with "Cannot read properties of undefined"**
- Solution: Ensure all environment variables are set in GitHub Secrets

**Authentication popup blocked**
- Solution: This is normal in development. Works fine in production.

## 🎯 Next Steps

After successful deployment, you can:

1. **Add More Providers**: Apple, Facebook, Twitter, etc.
2. **User Profile Management**: Store additional user data
3. **Protected Routes**: Restrict access to certain pages
4. **User Preferences**: Save user settings and preferences

## 📱 Mobile Considerations

For better mobile experience, consider using redirect-based authentication instead of popups:

```javascript
import { signInWithRedirect, getRedirectResult } from "firebase/auth";

// Use redirect instead of popup for mobile
export async function signInWithGoogleRedirect() {
  await signInWithRedirect(auth, googleProvider);
}

// Handle redirect result
export async function handleRedirectResult() {
  const result = await getRedirectResult(auth);
  return result?.user;
}
```

Your Google authentication is now ready for production! 🎉