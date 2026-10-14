// Grab registered business profile from local storage or assign default admin credentials
let adminProfile = JSON.parse(localStorage.getItem('adminProfile')) || {
    name: "Principal Designer",
    email: "admin@studio.com",
    phone: "9876543210",
    username: "admin",
    password: "password"
};

// --- REGISTRATION LOGIC ---
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            alert("Passwords do not match! Please check your credentials.");
            return;
        }

        // Save new administrator profile settings
        const newAdmin = { name, email, phone, username, password };
        localStorage.setItem('adminProfile', JSON.stringify(newAdmin));
        
        alert("Business Workspace Account Registered Successfully! Proceeding to Login.");
        window.location.href = "login.html";
    });
}

// --- LOGIN LOGIC ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const usernameInput = document.getElementById('loginUsername').value;
        const passwordInput = document.getElementById('loginPassword').value;

        // Verify input elements match current system owner profile records
        if (usernameInput === adminProfile.username && passwordInput === adminProfile.password) {
            alert(`Access Granted. Welcome back to your Workspace, ${adminProfile.name}!`);
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid business credentials! Access denied to internal operations.");
        }
    });
}
