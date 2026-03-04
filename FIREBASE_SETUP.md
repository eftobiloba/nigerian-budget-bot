# Nigerian Budget Bot - Firebase Setup Guide

## What Was Implemented

✅ **Firebase Authentication** - Full login and signup system with email/password
✅ **Modern SaaS UI** - Clean, professional design with gradient backgrounds and modern components
✅ **Toast Notifications** - Pop-up success and error messages using Sonner
✅ **Auth Context** - Global authentication state management
✅ **Protected Routes** - Chat page only accessible to authenticated users
✅ **User Session** - Persistent authentication across page refreshes
✅ **Logout Functionality** - Secure sign-out with redirect to auth page

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Enter project name: "nigerian-budget-bot"
4. Click through all the setup steps
5. Once created, go to Project Settings

### 2. Get Your Firebase Credentials

In Firebase Console:
1. Go to **Project Settings** (gear icon)
2. Under "Your apps", click **Web** (</>)
3. Register your app with name "nigerian-budget-bot"
4. Copy the Firebase config values

You'll need:
- API Key
- Auth Domain
- Project ID
- Storage Bucket
- Messaging Sender ID
- App ID

### 3. Setup Environment Variables

1. Open `/.env.local` file in the project root
2. Replace the placeholder values with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
```

### 4. Enable Email/Password Authentication

In Firebase Console:
1. Go to **Authentication** > **Sign-in method**
2. Click **Email/Password** provider
3. Enable it and click **Save**

### 5. Run Your Application

```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000` - you'll be redirected to the auth page!

## Features Overview

### Authentication Pages

**Sign Up Page** (`/auth`):
- Full name input
- Email validation
- Password strength requirement (6+ characters)
- Confirm password matching
- Error notifications

**Sign In Page** (`/auth`):
- Email and password fields
- Account recovery option (future enhancement)
- Success redirect to chat

### Chat Page (`/chat`)

Protected page showing:
- User email in header
- File upload functionality
- Message history with bot
- Logout button
- All previous chat functionality

### Toast Notifications

Success messages appear for:
- Account creation
- Login
- File upload
- Logout

Error messages appear for:
- Invalid credentials
- Password mismatch
- Missing fields
- API failures

## Security Notes

- All Firebase credentials in `.env.local` start with `NEXT_PUBLIC_` (safe to expose - these are public)
- No sensitive data stored in environment variables
- Firebase Security Rules should be configured in Firebase Console for production
- User password resets can be enabled in Firebase Authentication settings

## Project Structure

```
app/
├── page.tsx                 # Root - redirects to auth or chat
├── auth/
│   └── page.tsx            # Authentication page with login/signup tabs
├── chat/
│   └── page.tsx            # Protected chat page
├── api/
│   └── chat/
│       └── route.ts        # Chat API endpoint
└── layout.tsx              # Root layout with AuthProvider & Toaster

components/
├── auth/
│   ├── login-form.tsx      # Login form component
│   └── signup-form.tsx     # Signup form component
└── ...                     # Existing UI components

context/
└── AuthContext.tsx         # Firebase auth context & hooks

lib/
└── firebase.ts             # Firebase initialization
```

## Next Steps

1. Configure Firebase project (see Setup Instructions above)
2. Test signup with a new account
3. Test login with that account
4. Test file upload and chat functionality
5. Test logout functionality

## Troubleshooting

**"Firebase config values are missing"**
- Make sure `.env.local` file exists in project root
- Verify all NEXT_PUBLIC_FIREBASE_* variables are filled in
- Restart dev server after adding environment variables

**"User created but can't log in"**
- Check Firebase Authentication is enabled for Email/Password in Firebase Console
- Verify the credentials in `.env.local` are correct

**"Toast notifications not showing"**
- Make sure Sonner is properly installed
- Check browser console for any errors
- Verify Toaster component is in the layout

## Support

For Firebase issues: [Firebase Documentation](https://firebase.google.com/docs)
For Next.js issues: [Next.js Documentation](https://nextjs.org/docs)
