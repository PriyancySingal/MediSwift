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
    initializePrescriptions(user);  // Pass user object

  } catch (error) {
    console.error('Auth error:', error);
    window.location.href = 'login.html?redirect=prescriptions.html';
  }
});

// Initialize prescriptions page functionality
function initializePrescriptions(user) {
  console.log('Initializing prescriptions page...');
  loadPrescriptions(user);
}

// Load user's prescriptions from backend
async function loadPrescriptions(user) {
  try {
    console.log('Loading prescriptions...');
    const idToken = await user.getIdToken();

    const res = await fetch('https://medibharat-backend-1-zgx7.onrender.com/api/prescriptions', {
      headers: {
        Authorization: 'Bearer ' + idToken
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();
    console.log('Prescriptions loaded:', data);

    if (typeof renderPrescriptions === 'function') {
      renderPrescriptions(data.prescriptions || []);
    } else {
      console.warn('renderPrescriptions() not found in HTML');
    }

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
