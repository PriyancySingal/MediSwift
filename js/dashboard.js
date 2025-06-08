document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard loaded');
  
    // Upload Prescription Button
    const uploadBtn = document.querySelector('.action-btn.primary');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', function () {
        // Redirect to upload page
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
          // Here, you could duplicate order data and add to cart
          // window.location.href = `cart.html?reorderFrom=${orderId}`;
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
          // Navigate to tracking page
          // window.location.href = `track.html?orderId=${orderId}`;
        });
      }
    });
  
    // Refill Now Button
    const refillBtn = document.querySelector('.btn-text');
    if (refillBtn && refillBtn.textContent.includes('Refill Now')) {
      refillBtn.addEventListener('click', function () {
        alert('Refilling your prescription...');
        // Navigate to prescription refill page
        // window.location.href = 'prescriptions.html#refill';
      });
    }
  
    // Quick Links (Optional: add smooth scroll or tracking if needed)
    const quickLinks = document.querySelectorAll('.quick-link');
    quickLinks.forEach(link => {
      link.addEventListener('click', function () {
        console.log(`Navigating to ${link.getAttribute('href')}`);
        // Default behavior will handle it unless SPA
      });
    });
  
    // Search Bar (Optional: implement live search)
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
      searchInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
          const query = searchInput.value.trim();
          if (query) {
            alert(`Searching for "${query}"...`);
            // Redirect to search results
            // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
          }
        }
      });
    }
  });

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
  
  // Elements
  const searchInput = document.getElementById("dashboardSearchInput");
  
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
  