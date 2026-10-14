document.addEventListener("DOMContentLoaded", function() {
    // 1. Greet the logged-in administrator dynamically
    const adminProfile = JSON.parse(localStorage.getItem('adminProfile'));
    if (adminProfile && adminProfile.name) {
        document.getElementById('welcomeHeading').innerText = `Welcome back, ${adminProfile.name}!`;
    }

    // 2. Fetch active arrays from browser memory or initialize fallback samples for demonstration
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    let projects = JSON.parse(localStorage.getItem('projects')) || [];

    // Fallback Mock Data for initial visual demonstration if memory arrays are completely empty
    if (clients.length === 0 && projects.length === 0) {
        clients = [
            { id: 1, name: "Sharma Family" },
            { id: 2, name: "Ananya Rao" }
        ];
        projects = [
            { id: 501, name: "Luxury Living Room", client: "Sharma Family", roomType: "Living Room", budget: "350000", status: "In Progress" },
            { id: 502, name: "Modular Kitchen Setup", client: "Ananya Rao", roomType: "Kitchen", budget: "200000", status: "Design Selected" }
        ];
    }

    // 3. Perform dynamic mathematical summaries for metrics layout
    let totalBudget = 0;
    projects.forEach(proj => {
        totalBudget += parseFloat(proj.budget || 0);
    });

    // Simulate standard down payments to fill financial counters (e.g., 30% pending)
    let pendingPayments = totalBudget * 0.3; 

    // 4. Inject aggregated numbers straight into dashboard layout fields
    document.getElementById('dashTotalClients').innerText = clients.length;
    document.getElementById('dashActiveProjects').innerText = projects.length;
    document.getElementById('dashTotalBudget').innerText = "₹" + totalBudget.toLocaleString('en-IN');
    document.getElementById('dashPendingPayments').innerText = "₹" + pendingPayments.toLocaleString('en-IN');

    // 5. Render pipeline status table rows dynamically
    const tableBody = document.getElementById('dashProjectTableBody');
    tableBody.innerHTML = ""; // Clear out existing boilerplate structures

    projects.forEach(proj => {
        const row = document.createElement('tr');
        
        // Match status text cleanly with corresponding color badge styles inside style.css
        let badgeClass = "badge-planning";
        if (proj.status === "In Progress") badgeClass = "badge-progress";
        if (proj.status === "Design Selected") badgeClass = "badge-design";

        row.innerHTML = `
            <td>#PRJ${proj.id}</td>
            <td>${proj.client}</td>
            <td>${proj.name}</td>
            <td><span class="badge ${badgeClass}">${proj.status}</span></td>
        `;
        tableBody.appendChild(row);
    });

    // 6. Provide clean session logout logic pathing
    document.getElementById('logoutBtn').addEventListener('click', function() {
        alert("Signing out of workspace session profile security context.");
    });
});

