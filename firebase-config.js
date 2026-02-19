// Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCJK6p5bJU1BSZpW2mie--yBmhHOHaBcCM',
  authDomain: 'earn2026-e6132.firebaseapp.com',
  projectId: 'earn2026-e6132',
  storageBucket: 'earn2026-e6132.firebasestorage.app',
  messagingSenderId: '494648209392',
  appId: '1:494648209392:web:47a7924c3e8d3c31977735'
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
}
