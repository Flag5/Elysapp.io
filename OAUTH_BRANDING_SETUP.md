# OAuth Consent Screen Branding Setup

## 🎨 Making Your Google Sign-In Look Professional

Currently, users see "elys-c7ccd.firebaseapp.com" in the Google sign-in popup. Here's how to change it to "Elys AI" or your preferred brand name.

## 🔧 Step 1: Configure OAuth Consent Screen

### Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project (elys-c7ccd)
3. In the left sidebar, go to **APIs & Services** > **OAuth consent screen**

### Configure the Consent Screen
1. **User Type**: Select "External" (unless you have a Google Workspace)
2. Click **Create**

### Fill in App Information
| Field | Recommended Value |
|-------|------------------|
| **App name** | `Elys AI` |
| **User support email** | Your email address |
| **App logo** | Upload your Elys logo (120x120px recommended) |
| **App domain** | `https://yourusername.github.io` |
| **Authorized domains** | Add: `yourusername.github.io` |
| **Developer contact information** | Your email address |

### Application Homepage (Optional but Recommended)
- **Application Homepage URL**: `https://yourusername.github.io`
- **Application Privacy Policy URL**: `https://yourusername.github.io/#privacy`
- **Application Terms of Service URL**: `https://yourusername.github.io/#terms`

## 🔧 Step 2: Configure Scopes

1. Click **Add or Remove Scopes**
2. Add these scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
3. Click **Update**

## 🔧 Step 3: Add Test Users (During Development)

If your app is in testing mode:
1. Go to **Test users** section
2. Add your email and any other emails you want to test with
3. Click **Save**

## 🔧 Step 4: Publish Your App (For Production)

### When Ready for Public Use:
1. Go back to **OAuth consent screen**
2. Click **Publish App**
3. Submit for verification if required (for apps requesting sensitive scopes)

## 🎨 Step 5: Customize Firebase Project Display Name

### In Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon (Project Settings)
4. In **General** tab, under **Your project**:
   - **Project name**: Change to "Elys AI"
   - **Public-facing name**: Set to "Elys AI"
5. Click **Save**

## ✨ Result After Configuration

Instead of seeing:
```
By continuing, Google will share your name, email address and profile picture with elys-c7ccd.firebaseapp.com
```

Users will see:
```
By continuing, Google will share your name, email address and profile picture with Elys AI
```

## 🔍 Additional Branding Options

### Custom Domain (Advanced)
For even more professional branding, you can:
1. Set up a custom domain (e.g., `app.elys.ai`)
2. Configure Firebase Hosting with your custom domain
3. Update OAuth consent screen to use your custom domain

### App Logo Requirements
- **Size**: 120x120 pixels
- **Format**: PNG, JPG, or GIF
- **Content**: Should represent your brand clearly
- **Background**: Transparent or white recommended

## ⚠️ Important Notes

### Verification Process
- Apps requesting sensitive scopes may need Google verification
- This can take several days to weeks
- For basic authentication (email, profile), verification is usually not required

### Testing vs Production
- **Testing mode**: Only test users can sign in
- **Production mode**: Anyone with a Google account can sign in
- Switch to production when ready for public use

## 🎯 Quick Setup Checklist

- [ ] Go to Google Cloud Console > OAuth consent screen
- [ ] Set App name to "Elys AI"
- [ ] Add your support email
- [ ] Upload app logo (optional but recommended)
- [ ] Add authorized domain (yourusername.github.io)
- [ ] Configure required scopes
- [ ] Test the sign-in flow
- [ ] Publish app when ready for production

After completing these steps, your Google sign-in will look much more professional with "Elys AI" instead of the Firebase project ID! 🚀