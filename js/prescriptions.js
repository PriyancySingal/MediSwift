// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async function () {
  console.log('Prescriptions page loaded');

  // Check if user is authenticated
  const checkAuth = () => {
    return new Promise((resolve) => {
      const unsubscribe = window.auth.onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
      });
    });
  };

  try {
    const user = await checkAuth();

    if (!user) {
      console.log('No user found, redirecting to login...');
      window.location.href = 'login.html?redirect=prescriptions.html';
      return;
    }

    console.log('User authenticated:', user.email);
    // Initialize prescriptions page
    initializePrescriptions();

  } catch (error) {
    console.error('Auth error:', error);
    window.location.href = 'login.html?redirect=prescriptions.html';
  }
});

// Initialize prescriptions page functionality
function initializePrescriptions() {
  // Add any prescriptions page specific initialization code here
  console.log('Initializing prescriptions page...');

  // Example: Load prescriptions data
  loadPrescriptions();
}

// Load user's prescriptions
async function loadPrescriptions() {
  try {
    // TODO: Fetch prescriptions from your backend
    console.log('Loading prescriptions...');

    // Example: Simulate loading prescriptions
    setTimeout(() => {
      console.log('Prescriptions loaded');
      // Update UI with prescriptions
    }, 500);

  } catch (error) {
    console.error('Error loading prescriptions:', error);
  }
}

// Handle logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await window.auth.signOut();
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Logout error:', error);
    }
  });
}
