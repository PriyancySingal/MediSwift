firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    alert("You must be logged in as admin.");
    window.location.href = "login.html";
    return;
  }

  const idToken = await user.getIdToken();
  const res = await fetch("https://medibharat-backend-1.onrender.com/admin/prescriptions", {
    headers: { Authorization: "Bearer " + idToken }
  });

  const contentDiv = document.getElementById("prescriptionList");
  const welcome = document.getElementById("admin-welcome");

  if (!res.ok) {
    contentDiv.innerHTML = "❌ Access denied or error.";
    return;
  }

  const data = await res.json();
  welcome.innerHTML = `✅ Logged in as Admin: <strong>${user.email}</strong>`;
  contentDiv.innerHTML = "";

  if (data.prescriptions.length === 0) {
    contentDiv.innerHTML = "No prescriptions found.";
    return;
  }

  // Store token for file view access
  window.adminToken = idToken;

  data.prescriptions.forEach(p => {
    const div = document.createElement("div");
    div.className = "prescription-item";

    // 🔄 Convert UTC to IST manually (UTC + 5:30)
    const createdAtUTC = new Date(p.created_at);
    const istTime = new Date(createdAtUTC.getTime() + 5.5 * 60 * 60 * 1000);

    const createdAtIST = istTime.toLocaleString('en-IN', {
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
      <hr>
    `;
    contentDiv.appendChild(div);
  });
});

// 🔓 Secure File Viewer with Authorization Header
async function openFile(fileId) {
  try {
    const token = window.adminToken;
    const url = `https://medibharat-backend-1.onrender.com/api/prescriptions/file/${fileId}`;

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
