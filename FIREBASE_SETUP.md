# Firebase Setup Guide

This website uses Firebase Authentication and Firestore for user management. Follow these steps to set up Firebase:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard
4. Enable Google Analytics (optional but recommended)

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Enable **Google** sign-in provider
   - Add your project's support email
   - Save authorized domains if needed

## Step 3: Set Up Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click "Create database"
3. Start in **test mode** (for development) or **production mode** (for production)
4. Choose your database location (closest to your users)

## Step 4: Configure Firestore Security Rules

Add these rules to allow authenticated users to read/write their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 5: Get Your Firebase Config

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname
5. Copy the Firebase configuration object

## Step 6: Update firebase-config.js

Replace the placeholder values in `firebase-config.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 7: Test Authentication

1. Open your website
2. Click "Join Free" button
3. Try signing up with email/password
4. Try signing in with Google
5. Check Firebase Console > Authentication to see registered users
6. Check Firestore Database > users collection to see user data

## Security Notes

- **Never commit** your Firebase config with real keys to public repositories
- Use environment variables or Firebase Hosting environment config for production
- Set up proper Firestore security rules before going live
- Enable email verification if needed in Authentication settings

## Troubleshooting

- **"Firebase not initialized"**: Check that firebase-config.js is loaded before script.js
- **Google sign-in popup blocked**: Check browser popup settings
- **Firestore permission denied**: Check your security rules
- **CORS errors**: Add your domain to Firebase authorized domains

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
