// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async function () {
  console.log('Dashboard loaded');

  // Wait for Firebase to be ready
  const checkAuth = () => {
    return new Promise((resolve) => {
      // Add a small delay to ensure Firebase is fully initialized
      setTimeout(() => {
        const unsubscribe = window.auth.onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
        });
      }, 100);
    });
  };

  try {
    const user = await checkAuth();

    if (!user) {
      console.log('No user found, redirecting to index...');
      // Add a small delay to prevent flashing
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 100);
      return;
    }

    console.log('User authenticated:', user.email);
    updateUserProfile(user);
    initializeDashboard();
    // 👇 Admin visibility logic
    const ADMIN_UIDS = [
      "7xqvlarKRkdFc8dy5VNIhTr1qzy2", // Mridu
      "hG3BNF84AfeJ6hT8DTnVDIAYguy2", // Sakshi
      "vHJk3bMRoFTwdpCR0UiGSxwlvSp2", // Pragati
      "9NcV0GgyXqeIVloVjTpBMCvac512"  // Priyancy
   ];

    const adminDashboardBtn = document.getElementById("adminDashboardBtn");
    if (adminDashboardBtn) {
        if (ADMIN_UIDS.includes(user.uid)) {
            adminDashboardBtn.style.display = "block"; // ✅ show only for admins
        } else {
            adminDashboardBtn.style.display = "none";  // ❌ hide for everyone else
        }
    }

  } catch (error) {
    console.error('Auth error:', error);
    // Add a small delay to prevent flashing
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 100);
  }
});

// Update user profile in the UI
function updateUserProfile(user) {
  const userAvatar = document.getElementById('userAvatar');
  const welcomeMessage = document.getElementById('welcomeMessage');
  const userEmailDisplay = document.getElementById('userEmailDisplay');
  const dropdownUserName = document.getElementById('dropdownUserName');
  const dropdownUserEmail = document.getElementById('dropdownUserEmail');

  if (user.photoURL) {
    userAvatar.src = user.photoURL;
  }

  const displayName = user.displayName || 'User';
  welcomeMessage.textContent = `Welcome, ${displayName.split(' ')[0]}!`;
  userEmailDisplay.textContent = user.email || '';
  dropdownUserName.textContent = displayName;
  dropdownUserEmail.textContent = user.email || '';
}

// Setup search functionality
function setupSearch() {
  // Sample local medicine catalog (replace with your real data)
  const medicines = [
    "Temla 40",
    "Paracetamol",
    "Azithromycin",
    "Vitamin C",
    "Amoxicillin",
    "Ibuprofen",
    "Cetirizine",
    "Metformin",
  ];

  const searchInput = document.getElementById("dashboardSearchInput");
  if (!searchInput) return;

  // Create and show results container
  const resultsContainer = document.createElement("div");
  resultsContainer.style.position = "absolute";
  resultsContainer.style.background = "#fff";
  resultsContainer.style.border = "1px solid #ccc";
  resultsContainer.style.width = "300px";
  resultsContainer.style.maxHeight = "200px";
  resultsContainer.style.overflowY = "auto";
  resultsContainer.style.zIndex = "10000";
  resultsContainer.style.display = "none";
  searchInput.parentNode.appendChild(resultsContainer);

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = "";

    if (query.length === 0) {
      resultsContainer.style.display = "none";
      return;
    }


    const filtered = medicines.filter((med) =>
      med.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      resultsContainer.innerHTML = "<div style='padding:10px;'>No results found</div>";
    } else {
      filtered.forEach((med) => {
        const div = document.createElement("div");
        div.textContent = med;
        div.style.padding = "10px";
        div.style.cursor = "pointer";
        div.addEventListener("click", () => {
          alert(`You selected ${med}`);
          resultsContainer.style.display = "none";
          searchInput.value = med;
        });
        div.addEventListener("mouseover", () => {
          div.style.backgroundColor = "#eee";
        });
        div.addEventListener("mouseout", () => {
          div.style.backgroundColor = "#fff";
        });
        resultsContainer.appendChild(div);
      });
    }

    resultsContainer.style.display = "block";
  });

  // Hide results on clicking outside
  document.addEventListener("click", (e) => {
    if (!resultsContainer.contains(e.target) && e.target !== searchInput) {
      resultsContainer.style.display = "none";
    }
  });
}

// Setup profile dropdown
function setupProfileDropdown() {
  const profileDropdown = document.getElementById('profileDropdown');
  const profileDropdownMenu = document.getElementById('profileDropdownMenu');

  if (!profileDropdown || !profileDropdownMenu) return;

  let isMouseOverDropdown = false;
  let closeTimeout;

  // Show dropdown
  const showDropdown = () => {
    clearTimeout(closeTimeout);
    profileDropdownMenu.classList.add('show-dropdown');
  };

  // Hide dropdown with delay
  const hideDropdown = () => {
    closeTimeout = setTimeout(() => {
      if (!isMouseOverDropdown) {
        profileDropdownMenu.classList.remove('show-dropdown');
      }
    }, 200); // 200ms delay before hiding
  };

  // Toggle dropdown on profile click
  profileDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    if (profileDropdownMenu.classList.contains('show-dropdown')) {
      profileDropdownMenu.classList.remove('show-dropdown');
    } else {
      showDropdown();
    }
  });

  // Mouse enter dropdown
  profileDropdown.addEventListener('mouseenter', showDropdown);

  // Mouse leave dropdown
  profileDropdown.addEventListener('mouseleave', hideDropdown);

  // Track mouse over dropdown menu
  profileDropdownMenu.addEventListener('mouseenter', () => {
    isMouseOverDropdown = true;
    clearTimeout(closeTimeout);
  });

  profileDropdownMenu.addEventListener('mouseleave', () => {
    isMouseOverDropdown = false;
    hideDropdown();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target)) {
      profileDropdownMenu.classList.remove('show-dropdown');
    }
  });

  // Handle menu item clicks
  const menuItems = profileDropdownMenu.querySelectorAll('a, button');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const action = item.getAttribute('data-action');

      if (action === 'logout') {
        window.handleLogout(e);
      } else if (item.tagName === 'A') {
        window.location.href = item.getAttribute('href');
      }

      profileDropdownMenu.classList.remove('show-dropdown');
    });
  });
}

// Handle logout
window.handleLogout = function(e) {
  if (e) e.preventDefault();
  window.auth.signOut().then(() => {
    window.location.href = 'index.html';
  }).catch((error) => {
    console.error('Error signing out:', error);
    alert('Error signing out. Please try again.');
  });
}

function initializeDashboard() {
  // Upload Prescription Button
  const uploadBtn = document.querySelector('.action-btn.primary');
  if (uploadBtn) {
    uploadBtn.addEventListener('click', function () {
      window.location.href = 'upload.html';
    });
  }

  // Reorder Buttons
  const reorderIcons = document.querySelectorAll('.btn-icon .fa-redo');
  reorderIcons.forEach(icon => {
    const parentBtn = icon.closest('.btn-icon');
    if (parentBtn) {
      parentBtn.addEventListener('click', function () {
        const orderId = parentBtn.closest('.order-card')?.querySelector('h4')?.textContent || '';
        alert(`Reordering items from ${orderId}...`);
      });
    }
  });

  // Track Order Buttons
  const trackIcons = document.querySelectorAll('.btn-icon .fa-eye');
  trackIcons.forEach(icon => {
    const parentBtn = icon.closest('.btn-icon');
    if (parentBtn) {
      parentBtn.addEventListener('click', function () {
        const orderId = parentBtn.closest('.order-card')?.querySelector('h4')?.textContent || '';
        alert(`Tracking ${orderId}...`);
      });
    }
  });

  // Refill Now Button
  const refillBtn = document.querySelector('.btn-text');
  if (refillBtn && refillBtn.textContent.includes('Refill Now')) {
    refillBtn.addEventListener('click', function () {
      alert('Refilling your prescription...');
    });
  }

  // Search functionality
  setupSearch();

  // Profile dropdown toggle
  setupProfileDropdown();

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', window.handleLogout);
  }
}
