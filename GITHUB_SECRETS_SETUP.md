# GitHub Secrets Setup for Firebase

## 🔐 Adding Secrets to Your Repository

To make your Firebase authentication work with GitHub Actions, you need to add your Firebase configuration as repository secrets.

### Step 1: Go to Repository Settings
1. Navigate to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** > **Actions**

### Step 2: Add Repository Secrets
Click **New repository secret** for each of the following:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `FIREBASE_API_KEY` | Your Firebase API Key | `XXX` |
| `FIREBASE_AUTH_DOMAIN` | Your Firebase Auth Domain | `XXX` |
| `FIREBASE_PROJECT_ID` | Your Firebase Project ID | `XXX` |
| `FIREBASE_STORAGE_BUCKET` | Your Firebase Storage Bucket | `XXX` |
| `FIREBASE_MESSAGING_SENDER_ID` | Your Messaging Sender ID | `XXX` |
| `FIREBASE_APP_ID` | Your Firebase App ID | `1:XXX` |
| `FIREBASE_MEASUREMENT_ID` | Your Measurement ID | `G-XXX` |

### Step 3: Get Your Firebase Values
You can find these values in your `.env.local` file or from Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Scroll down to **Your apps** section
5. Click on your web app
6. Copy the config values

### Step 4: Test the Deployment
After adding all secrets:

1. Make any small change to your code
2. Commit and push to main branch:
   ```bash
   git add .
   git commit -m "Update GitHub Actions with Firebase secrets"
   git push origin main
   ```
3. Go to **Actions** tab in your GitHub repository
4. Watch the deployment workflow run
5. Once complete, visit your GitHub Pages site and test the Google sign-in

## ✅ Verification Checklist

- [ ] All 7 Firebase secrets added to GitHub repository
- [ ] GitHub Actions workflow runs successfully
- [ ] Website deploys without errors
- [ ] Google sign-in button appears on the site
- [ ] Authentication flow works (no console errors)

## 🔍 Troubleshooting

### Build Fails with "Cannot read properties of undefined"
- **Cause**: Missing or incorrectly named secrets
- **Solution**: Double-check all secret names match exactly (case-sensitive)

### Authentication Doesn't Work on Live Site
- **Cause**: Domain not authorized in Firebase
- **Solution**: Add your GitHub Pages domain to Firebase authorized domains

### Secrets Not Loading
- **Cause**: Typo in secret names or workflow file
- **Solution**: Verify secret names in workflow match repository secrets exactly

## 🎯 Your Current Setup

Your GitHub Actions workflow (`.github/workflows/deploy.yml`) is now configured to:
1. ✅ Pull Firebase config from repository secrets
2. ✅ Build the project with environment variables
3. ✅ Deploy to GitHub Pages automatically

Just add the secrets and you're ready to go! 🚀