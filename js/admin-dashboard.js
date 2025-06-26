// admin-dashboard.js
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

  data.prescriptions.forEach(p => {
    const div = document.createElement("div");
    div.className = "prescription-item";
    div.innerHTML = `
      <strong>User:</strong> ${p.user_email || "N/A"}<br>
      <strong>Doctor:</strong> ${p.doctor_name || "Unknown"}<br>
      <strong>Date:</strong> ${new Date(p.created_at).toLocaleString()}<br>
      <strong>Status:</strong> ${p.status || "Pending"}<br>
      <strong>Notes:</strong> ${p.notes || "None"}<br>
      <strong>Files:</strong> ${p.file_ids.map(fid =>
        `<a href="https://medibharat-backend.onrender.com/api/prescriptions/file/${fid}" target="_blank">View</a>`
      ).join(", ")}
      <hr>
    `;
    contentDiv.appendChild(div);
  });
});
