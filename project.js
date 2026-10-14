document.addEventListener("DOMContentLoaded", function() {
    // Fetch live clients added directly through the website interface
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    let projects = JSON.parse(localStorage.getItem('projects')) || [];

    const projectForm = document.getElementById('projectForm');
    const clientSelect = document.getElementById('projectClient');
    const projectTableBody = document.getElementById('projectTableBody');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const projectIdInput = document.getElementById('projectId');
    const fileInput = document.getElementById('projectImgFile');

    populateClientDropdown();
    displayProjects(projects);

    function populateClientDropdown() {
        clientSelect.innerHTML = '<option value="" disabled selected>Select an onboarded client</option>';
        
        // If you haven't typed any clients in the website yet, show a clear warning message
        if (clients.length === 0) {
            const opt = document.createElement('option');
            opt.text = "⚠️ No clients found. Onboard a client on the Clients page first.";
            opt.disabled = true;
            clientSelect.add(opt);
            return;
        }
        
        // Dynamically loop through your custom live client data entries
        clients.forEach(client => {
            const opt = document.createElement('option');
            opt.value = client.name;
            opt.text = `${client.name} (ID: #${client.id})`;
            clientSelect.add(opt);
        });
    }

    // ... REST OF YOUR EXISTING PROJECTS.JS CODE (displayProjects, submit event, etc.) REMAINS EXACTLY THE SAME ...


    // Displays projects alongside multiple gallery images under info text block
    function displayProjects(projectList) {
        projectTableBody.innerHTML = "";
        
        projectList.forEach(proj => {
            const row = document.createElement('tr');
            
            let badgeClass = "badge-planning";
            if (proj.status === "In Progress") badgeClass = "badge-progress";
            if (proj.status === "Design Selected") badgeClass = "badge-design";

            // Loop through the image string array if multiple images exist
            let imageDisplayHTML = "";
            if (proj.imgDataArray && proj.imgDataArray.length > 0) {
                imageDisplayHTML = `<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">`;
                proj.imgDataArray.forEach(imgStr => {
                    imageDisplayHTML += `<img src="${imgStr}" alt="Gallery Concept" style="width: 110px; height: 80px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1; display: block;">`;
                });
                imageDisplayHTML += `</div>`;
            } else {
                imageDisplayHTML = `<div style="margin-top: 8px; font-size: 11px; color: #94a3b8; background: #f8fafc; border: 1px dashed #cbd5e1; padding: 8px; width: 160px; text-align: center; border-radius: 4px;">No attached gallery cards</div>`;
            }

            row.innerHTML = `
                <td><strong>#PRJ${proj.id}</strong></td>
                <td>
                    <div style="font-weight: 600; color: #1a252f;">${proj.name}</div>
                    <div style="font-size: 12px; color: #7f8c8d;">👤 Client: ${proj.client}</div>
                    <div style="font-size: 11px; color: #94a3b8;">📍 Site: ${proj.location} | 📅 ${proj.startDate}</div>
                    ${imageDisplayHTML} <!-- Multiple chosen gallery references render side-by-side here! -->
                </td>
                <td><strong>₹${parseFloat(proj.budget).toLocaleString('en-IN')}</strong></td>
                <td><span class="badge ${badgeClass}">${proj.status}</span></td>
                <td>
                    <button class="btn-action btn-edit" data-id="${proj.id}">Modify</button>
                    <button class="btn-action btn-delete" data-id="${proj.id}">Wipe</button>
                </td>
            `;
            projectTableBody.appendChild(row);
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => editProject(parseInt(btn.getAttribute('data-id'))));
        });
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteProject(parseInt(btn.getAttribute('data-id'))));
        });
    }

    // Handles form data along with reading multiple file objects asynchronously
    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const id = projectIdInput.value;
        const name = document.getElementById('projectName').value;
        const client = clientSelect.value;
        const roomType = document.getElementById('roomType').value;
        const location = document.getElementById('projectLocation').value;
        const startDate = document.getElementById('startDate').value;
        const budget = document.getElementById('projectBudget').value;

        const files = fileInput.files;
        const loadedImagesArray = [];

        const finalizeSubmission = () => {
            if (id) {
                // Update route
                projects = projects.map(p => {
                    if (p.id === parseInt(id)) {
                        // If no new image gallery files were uploaded, preserve the older array set
                        return { 
                            id: parseInt(id), name, client, roomType, location, startDate, budget, 
                            imgDataArray: loadedImagesArray.length > 0 ? loadedImagesArray : p.imgDataArray, 
                            status: p.status 
                        };
                    }
                    return p;
                });
                alert("Interior project changes saved successfully.");
            } else {
                // Add new contract route
                const newId = projects.length > 0 ? projects[projects.length - 1].id + 1 : 501;
                const newProject = { id: newId, name, client, roomType, location, startDate, budget, imgDataArray: loadedImagesArray, status: "Planning" };
                projects.push(newProject);
                alert("New project with image collection initialized successfully.");
            }

            localStorage.setItem('projects', JSON.stringify(projects));
            resetForm();
            displayProjects(projects);
        };

        // If files are selected, process each file via asynchronous FileReader loops
        if (files && files.length > 0) {
            let readCount = 0;
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    loadedImagesArray.push(event.target.result);
                    readCount++;
                    // Once all selected files are completely converted, finalize form submission
                    if (readCount === files.length) {
                        finalizeSubmission();
                    }
                };
                reader.readAsDataURL(files[i]);
            }
        } else {
            finalizeSubmission(); // Run immediately with no new images uploaded
        }
    });

    function editProject(id) {
        const proj = projects.find(p => p.id === id);
        if (proj) {
            projectIdInput.value = proj.id;
            document.getElementById('projectName').value = proj.name;
            clientSelect.value = proj.client;
            document.getElementById('roomType').value = proj.roomType;
            document.getElementById('projectLocation').value = proj.location;
            document.getElementById('startDate').value = proj.startDate;
            document.getElementById('projectBudget').value = proj.budget;
            fileInput.value = ""; // Reset picker for changes

            formTitle.innerText = "Modify Project (ID: #" + id + ")";
            submitBtn.innerText = "Save Adjustments";
            cancelBtn.style.display = "block";
        }
    }

    function deleteProject(id) {
        if (confirm("Permanently strip this design track out of system memory registers?")) {
            projects = projects.filter(p => p.id !== id);
            localStorage.setItem('projects', JSON.stringify(projects));
            displayProjects(projects);
            resetForm();
        }
    }

    cancelBtn.addEventListener('click', resetForm);

    function resetForm() {
        projectForm.reset();
        projectIdInput.value = "";
        formTitle.innerText = "Initialize New Contract";
        submitBtn.innerText = "Track Project Assignment";
        cancelBtn.style.display = "none";
    }

    window.searchProjects = function() {
        const keyword = document.getElementById('searchBar').value.toLowerCase();
        const filtered = projects.filter(p => 
            p.name.toLowerCase().includes(keyword) || 
            p.client.toLowerCase().includes(keyword) || 
            p.roomType.toLowerCase().includes(keyword)
        );
        displayProjects(filtered);
    };
});
