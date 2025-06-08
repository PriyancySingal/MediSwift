// Login form submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');
  const loginButton = document.querySelector('#loginForm button[type="submit"]');
  const originalButtonText = loginButton.innerHTML;

  try {
    // Show loading state
    loginButton.disabled = true;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    
    // Sign in with email and password
    const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
    console.log('User logged in:', userCredential.user.email);
    
    // Redirect to index.html after successful login
    window.location.href = 'index.html';
    
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.textContent = error.message;
    errorMessage.style.display = 'block';
    
    // Reset button state
    loginButton.disabled = false;
    loginButton.innerHTML = originalButtonText;
  }
});

// Handle password reset
const resetPasswordLink = document.getElementById('reset-password');
if (resetPasswordLink) {
  resetPasswordLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = prompt('Please enter your email:');
    if (email) {
      try {
        await window.auth.sendPasswordResetEmail(email);
        alert('Password reset email sent. Please check your inbox.');
      } catch (error) {
        console.error('Password reset error:', error);
        alert('Error sending password reset email: ' + error.message);
      }
    }
  });
}

// Initialize auth state when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Check if user is already logged in
    const user = window.auth.currentUser;
    if (user) {
      // Redirect to index if already logged in
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Auth check error:', error);
  }
});
