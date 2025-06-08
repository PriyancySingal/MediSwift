document.addEventListener('DOMContentLoaded', function() {
  // Login Form Submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const phone = document.getElementById('phone').value;
          // Here you would typically send the phone number to your backend
          // and then redirect to OTP verification
          window.location.href = 'otp-verify.html';
      });
  }

  // OTP Form Submission
  const otpForm = document.getElementById('otpForm');
  if (otpForm) {
      // Auto-focus first OTP input
      const otpInputs = document.querySelectorAll('.otp-input');
      if (otpInputs.length > 0) {
          otpInputs[0].focus();
      }

      // Handle OTP input
      otpInputs.forEach((input, index) => {
          input.addEventListener('input', (e) => {
              if (e.target.value.length === 1) {
                  if (index < otpInputs.length - 1) {
                      otpInputs[index + 1].focus();
                  }
              }
          });

          input.addEventListener('keydown', (e) => {
              if (e.key === 'Backspace' && !e.target.value && index > 0) {
                  otpInputs[index - 1].focus();
              }
          });
      });

      // Form submission
      otpForm.addEventListener('submit', function(e) {
          e.preventDefault();
          // Here you would verify the OTP with your backend
          // For demo, we'll just redirect to dashboard
          window.location.href = 'dashboard.html';
      });

      // Resend OTP functionality
      const resendOtp = document.getElementById('resendOtp');
      const timer = document.getElementById('timer');
      let timeLeft = 30;

      if (resendOtp && timer) {
          resendOtp.style.display = 'none';
          timer.textContent = `(${timeLeft}s)`;

          const countdown = setInterval(() => {
              timeLeft--;
              timer.textContent = `(${timeLeft}s)`;

              if (timeLeft <= 0) {
                  clearInterval(countdown);
                  resendOtp.style.display = 'inline';
                  timer.style.display = 'none';
              }
          }, 1000);

          resendOtp.addEventListener('click', function(e) {
              e.preventDefault();
              // Here you would resend the OTP
              timeLeft = 30;
              timer.textContent = `(${timeLeft}s)`;
              resendOtp.style.display = 'none';
              timer.style.display = 'inline';

              const newCountdown = setInterval(() => {
                  timeLeft--;
                  timer.textContent = `(${timeLeft}s)`;

                  if (timeLeft <= 0) {
                      clearInterval(newCountdown);
                      resendOtp.style.display = 'inline';
                      timer.style.display = 'none';
                  }
              }, 1000);
          });
      }
  }
});