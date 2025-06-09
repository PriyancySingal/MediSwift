// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyCizuD7GpmSDczYXdnA0vRhrAuIK_rnu3U",
  authDomain: "healthcare-4a5bd.firebaseapp.com",
  projectId: "healthcare-4a5bd",
  storageBucket: "healthcare-4a5bd.firebasestorage.app",
  messagingSenderId: "652107502377",
  appId: "1:652107502377:web:f605be0080c824bfcb5d38",
  measurementId: "G-NT77HTLY4G"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log('Auth persistence set to LOCAL');
  })
  .catch(error => {
    console.error('Error setting auth persistence:', error);
  });

window.auth = auth;

auth.onAuthStateChanged(user => {
  console.log('Auth state changed:', user ? 'User signed in' : 'No user signed in');
});
