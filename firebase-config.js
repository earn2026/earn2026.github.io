// Firebase Configuration
// Replace these placeholder values with your actual Firebase project credentials
// Get them from: https://console.firebase.google.com/ > Project Settings > General > Your apps

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
