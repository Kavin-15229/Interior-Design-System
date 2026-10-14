document.addEventListener("DOMContentLoaded", function() {
    // Read directly from what is saved in the browser, start empty if nothing is added yet
    let clients = JSON.parse(localStorage.getItem('clients')) || [];

    const clientForm = document.getElementById('clientForm');
    const clientTableBody = document.getElementById('clientTableBody');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const clientIdInput = document.getElementById('clientId');

    // ... REST OF YOUR EXISTING CLIENTS.JS CODE REMAINS EXACTLY THE SAME ...


    // Initial table load call
    displayClients(clients);

    // 2. Render functions to update directory rows
    function displayClients(clientList) {
        clientTableBody.innerHTML = "";
        
        clientList.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>#${client.id}</strong></td>
                <td>
                    <div style="font-weight: 600; color: #1a252f;">${client.name}</div>
                    <div style="font-size: 12px; color: #7f8c8d; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">📍 ${client.address}</div>
                </td>
                <td>
                    <div>📞 ${client.phone}</div>
                    <div style="font-size: 13px; color: #566573;">✉️ ${client.email}</div>
                </td>
                <td>
                    <button class="btn-action btn-edit" data-id="${client.id}">Modify</button>
                    <button class="btn-action btn-delete" data-id="${client.id}">Wipe</button>
                </td>
            `;
            clientTableBody.appendChild(row);
        });

        // Attach dynamic listener click events directly onto operational buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => editClient(parseInt(btn.getAttribute('data-id'))));
        });
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteClient(parseInt(btn.getAttribute('data-id'))));
        });
    }

    // 3. Form Submission Form management handles both Add and Edit execution paths
    clientForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const id = clientIdInput.value;
        const name = document.getElementById('clientName').value;
        const phone = document.getElementById('clientPhone').value;
        const email = document.getElementById('clientEmail').value;
        const address = document.getElementById('clientAddress').value;

        if (id) {
            // Update operation logic path
            clients = clients.map(c => {
                if (c.id === parseInt(id)) {
                    return { id: parseInt(id), name, phone, email, address };
                }
                return c;
            });
            alert("Client account records updated successfully.");
        } else {
            // Creation/Onboarding operational flow path
            const newId = clients.length > 0 ? clients[clients.length - 1].id + 1 : 101;
            const newClient = { id: newId, name, phone, email, address };
            clients.push(newClient);
            alert("New client structural profile saved successfully.");
        }

        localStorage.setItem('clients', JSON.stringify(clients));
        resetForm();
        displayClients(clients);
    });

    // 4. Record Modifications operations functions
    function editClient(id) {
        const client = clients.find(c => c.id === id);
        if (client) {
            clientIdInput.value = client.id;
            document.getElementById('clientName').value = client.name;
            document.getElementById('clientPhone').value = client.phone;
            document.getElementById('clientEmail').value = client.email;
            document.getElementById('clientAddress').value = client.address;

            formTitle.innerText = "Modify Client Assignment (ID: #" + id + ")";
            submitBtn.innerText = "Save Adjustments";
            cancelBtn.style.display = "block";
        }
    }

    function deleteClient(id) {
        if (confirm("Are you sure you want to permanently delete this client profile from system registers?")) {
            clients = clients.filter(c => c.id !== id);
            localStorage.setItem('clients', JSON.stringify(clients));
            displayClients(clients);
            resetForm();
        }
    }

    cancelBtn.addEventListener('click', resetForm);

    function resetForm() {
        clientForm.reset();
        clientIdInput.value = "";
        formTitle.innerText = "Onboard New Client";
        submitBtn.innerText = "Save Client Profile";
        cancelBtn.style.display = "none";
    }

    // 5. Live Search Engine filtration function
    window.searchClients = function() {
        const keyword = document.getElementById('searchBar').value.toLowerCase();
        const filtered = clients.filter(c => 
            c.name.toLowerCase().includes(keyword) || 
            c.email.toLowerCase().includes(keyword) || 
            c.phone.includes(keyword)
        );
        displayClients(filtered);
    };
});

