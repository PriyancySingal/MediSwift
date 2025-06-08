document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      this.querySelector('i').classList.toggle('fa-times');
      this.querySelector('i').classList.toggle('fa-bars');
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for fixed header
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navLinks.style.display === 'flex') {
          navLinks.style.display = 'none';
          mobileMenuBtn.querySelector('i').classList.add('fa-bars');
          mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        }
      }
    });
  });


  // Add animation on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .step, .section-header');

    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (elementPosition < screenPosition) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  // Set initial styles for animation
  document.querySelectorAll('.feature-card, .step').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  document.querySelectorAll('.section-header').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(-20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  // Initial check in case elements are already in view
  animateOnScroll();

  // Add scroll event listener
  window.addEventListener('scroll', animateOnScroll);

  // Trust badges animation
  const badges = document.querySelectorAll('.badge');
  if (badges.length > 0) {
    badges.forEach((badge, index) => {
      badge.style.animation = `fadeInUp 0.5s ease-out ${index * 0.2}s forwards`;
      badge.style.opacity = '0';
      badge.style.transform = 'translateY(20px)';
    });
  }

  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
  document.head.appendChild(style);

  // Form submission handling (example for newsletter signup)
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      // Here you would typically send this to your server
      alert(`Thank you for subscribing with ${email}!`);
      this.reset();
    });
  }

});

// Add a class to body when scrolled to change header style
window.addEventListener('scroll', function () {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
