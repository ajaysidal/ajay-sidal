# Google OAuth Setup Guide

## Problem
The "Sign Up with Google" feature was failing because:
1. Google OAuth provider was not configured in the authentication system
2. Missing `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` environment variables
3. `NEXTAUTH_URL` was pointing to the wrong endpoint

## What Was Fixed

### 1. Updated `src/lib/auth.ts`
- Added `GoogleProvider` to the authentication providers
- Added `signIn` callback to handle Google OAuth sign-ins and auto-create users in the database

### 2. Updated `.env`
- Changed `NEXTAUTH_URL` from `http://65.109.7.159:3000` to `https://www.buildwithai.digital`
- Added placeholder entries for `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

## Next Steps: Configure Google OAuth

You need to create Google OAuth credentials and update the `.env` file:

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name it something like "Build With AI"

### Step 2: Enable Google+ API
1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and press **Enable**

### Step 3: Create OAuth Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: **Build With AI**
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**
   - Scopes: Skip this step
   - Test users: Add your email for testing
4. Select Application type: **Web application**
5. Add authorized redirect URIs:
   ```
   https://www.buildwithai.digital/api/auth/callback/google
   ```
6. Click **Create**
7. Copy the **Client ID** and **Client Secret**

### Step 4: Update Environment Variables
Update your `.env` file (and Vercel environment variables) with:

```env
GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

### Step 5: Deploy
1. Commit and push the changes (make sure `.env` is in `.gitignore`)
2. Add the environment variables to Vercel:
   - Go to your project in Vercel
   - Navigate to **Settings** > **Environment Variables**
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. Redeploy the application

## Testing
After deployment:
1. Go to `https://www.buildwithai.digital/signup`
2. Click "Sign up with Google"
3. You should be redirected to Google for authentication
4. After successful authentication, you'll be redirected back and a new user will be created in the database

## Troubleshooting

### Error: "redirect_uri_mismatch"
Make sure the redirect URI in Google Cloud Console exactly matches:
```
https://www.buildwithai.digital/api/auth/callback/google
```

### Error: "Access blocked: This app's request is invalid"
- Verify you've enabled the Google+ API
- Check that your OAuth consent screen is configured
- Add your test email to the test users list

### Error: Server logs show authentication errors
- Verify `NEXTAUTH_SECRET` is set correctly
- Check that `NEXTAUTH_URL` matches your production URL
- Ensure database connection is working

## Security Notes
- ⚠️ **NEVER** commit `.env` file to version control
- ✅ Use Vercel environment variables for production
- ✅ Rotate credentials immediately if `.env` is ever committed
