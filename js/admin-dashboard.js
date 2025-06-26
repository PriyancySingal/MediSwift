firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    alert("You must be logged in as admin.");
    window.location.href = "login.html";
    return;
  }

  const idToken = await user.getIdToken();
  const res = await fetch("https://medibharat-backend.onrender.com/admin/prescriptions", {
    headers: { Authorization: "Bearer " + idToken }
  });

  const contentDiv = document.getElementById("prescriptionList");
  const welcome = document.getElementById("admin-welcome");
  const logoutBtn = document.getElementById("logoutBtn");

  // Show admin email
  welcome.innerHTML = `✅ Logged in as Admin: <strong>${user.email}</strong>`;

  // Logout logic
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await firebase.auth().signOut();
    window.location.href = "index.html";
  });

  if (!res.ok) {
    contentDiv.innerHTML = "❌ Access denied or error.";
    return;
  }

  const data = await res.json();
  contentDiv.innerHTML = "";

  if (data.prescriptions.length === 0) {
    contentDiv.innerHTML = "No prescriptions found.";
    return;
  }

  window.adminToken = idToken;

  data.prescriptions.forEach(p => {
    const div = document.createElement("div");
    div.className = "prescription-item";

    const createdAtIST = new Date(p.created_at).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    div.innerHTML = `
      <strong>User:</strong> ${p.user_email || "N/A"}<br>
      <strong>Doctor:</strong> ${p.doctor_name || "Unknown"}<br>
      <strong>Date:</strong> ${createdAtIST}<br>
      <strong>Status:</strong> ${p.status || "Pending"}<br>
      <strong>Notes:</strong> ${p.notes || "None"}<br>
      <strong>Files:</strong> ${p.file_ids.map(fid =>
        `<a href="#" onclick="openFile('${fid}')">View</a>`
      ).join(", ")}
    `;
    contentDiv.appendChild(div);
  });
});

async function openFile(fileId) {
  try {
    const token = window.adminToken;
    const url = `https://medibharat-backend.onrender.com/api/prescriptions/file/${fileId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!response.ok) {
      alert("❌ File not found or unauthorized");
      return;
    }

    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, "_blank");
  } catch (error) {
    console.error("File view error:", error);
    alert("❌ Error opening file.");
  }
}
