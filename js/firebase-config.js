// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCizuD7GpmSDczYXdnA0vRhrAuIK_rnu3U",
  authDomain: "healthcare-4a5bd.firebaseapp.com",
  projectId: "healthcare-4a5bd",
  storageBucket: "healthcare-4a5bd.firebasestorage.app",
  messagingSenderId: "652107502377",
  appId: "1:652107502377:web:f605be0080c824bfcb5d38",
  measurementId: "G-NT77HTLY4G"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase Auth
const auth = firebase.auth();

// Set persistence to LOCAL to keep user logged in
// until they explicitly sign out or clear browser data
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log('Auth persistence set to LOCAL');
  })
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

// Make auth globally available
window.auth = auth;

// Log auth state changes for debugging
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? 'User signed in' : 'No user signed in');
  if (user) {
    console.log('User details:', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified
    });
  }
});

// Add a function to check if user is logged in
window.isUserLoggedIn = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};