// Auth state management
class AuthState {
  constructor() {
    this.user = null;
    this.subscribers = [];
    this.initialize();
  }

  async initialize() {
    return new Promise((resolve) => {
      const unsubscribe = window.auth.onAuthStateChanged(user => {
        this.user = user;
        this.notifySubscribers();
        unsubscribe();
        resolve(user);
      });
    });
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.user));
  }

  getCurrentUser() {
    return this.user;
  }
}

// Initialize auth state
const authState = new AuthState();

// Update UI based on auth state
function updateAuthUI(user) {
  const authButtons = document.getElementById('auth-buttons');
  const userProfile = document.getElementById('user-profile');
  const loginLinks = document.querySelectorAll('.login-link');
  const logoutLinks = document.querySelectorAll('.logout-link');

  if (user) {
    // User is signed in
    if (authButtons) authButtons.style.display = 'none';
    if (userProfile) userProfile.style.display = 'flex';
    loginLinks.forEach(link => link.style.display = 'none');
    logoutLinks.forEach(link => link.style.display = 'block');
    updateUserProfile(user);
  } else {
    // User is signed out
    if (authButtons) authButtons.style.display = 'flex';
    if (userProfile) userProfile.style.display = 'none';
    loginLinks.forEach(link => link.style.display = 'block');
    logoutLinks.forEach(link => link.style.display = 'none');
  }
}

// Update user profile in the navbar
function updateUserProfile(user) {
  const userAvatar = document.getElementById('userAvatar');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const defaultAvatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  if (userAvatar) {
    userAvatar.onerror = null;
    const avatarUrl = user.photoURL || defaultAvatar;
    userAvatar.src = avatarUrl;
    userAvatar.onerror = function () {
      this.src = defaultAvatar;
      this.onerror = null;
    };
  }

  if (userName) {
    const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
    userName.textContent = displayName;
  }

  if (userEmail) {
    userEmail.textContent = user.email || '';
  }
}

// Handle logout
async function handleLogout() {
  try {
    await window.auth.signOut();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Initialize auth state when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await authState.initialize();
    // Subscribe to auth state changes
    authState.subscribe(updateAuthUI);

    // Initialize current state
    updateAuthUI(authState.getCurrentUser());

    // Add logout event listeners
    document.querySelectorAll('.logout-btn').forEach(btn => {
      btn.addEventListener('click', handleLogout);
    });

  } catch (error) {
    console.error('Auth initialization error:', error);
  }
});

// Export for other scripts to use
window.AuthState = authState;
