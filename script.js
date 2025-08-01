// This file is designed to be included in all three HTML pages:
// login.html, signup.html, and index.html.
// It detects which page is loaded and runs the appropriate logic.

// --- Global Data and State (Simulating a Database) ---
// Data is stored in localStorage for persistence across browser sessions.
// In a real application, this data would be managed by a secure backend API.
let users = JSON.parse(localStorage.getItem('users')) || [
    { id: 'u1', username: 'user1', password: 'password', role: 'user' },
    { id: 'a1', username: 'admin1', password: 'adminpassword', role: 'admin' }
];
let bloodInventory = JSON.parse(localStorage.getItem('bloodInventory')) || [
    { group: 'A+', units: 50 },
    { group: 'A-', units: 20 },
    { group: 'B+', units: 45 },
    { group: 'B-', units: 15 },
    { group: 'AB+', units: 30 },
    { group: 'AB-', units: 10 },
    { group: 'O+', units: 60 },
    { group: 'O-', units: 25 }
];
let donors = JSON.parse(localStorage.getItem('donors')) || [
    { id: 'd1', name: 'John Doe', bloodGroup: 'O+', contact: 'john.doe@example.com', lastDonation: '2024-06-15' },
    { id: 'd2', name: 'Jane Smith', bloodGroup: 'A-', contact: 'jane.smith@example.com', lastDonation: '2024-05-20' }
];
let bloodRequests = JSON.parse(localStorage.getItem('bloodRequests')) || [
    { id: 'req1', requesterId: 'u1', requesterUsername: 'user1', bloodGroup: 'O+', units: 2, reason: 'Emergency surgery', status: 'Pending', date: '2024-07-28' },
    { id: 'req2', requesterId: 'u1', requesterUsername: 'user1', bloodGroup: 'A+', units: 1, reason: 'Routine transfusion', status: 'Approved', date: '2024-07-20' }
];

// --- Utility Functions ---
// Saves all data to localStorage.
function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('bloodInventory', JSON.stringify(bloodInventory));
    localStorage.setItem('donors', JSON.stringify(donors));
    localStorage.setItem('bloodRequests', JSON.stringify(bloodRequests));
}

// Shows a custom modal message instead of using `alert()` or `confirm()`.
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}
function showMessage(title, content) {
    const messageModal = document.getElementById('message-modal');
    if (messageModal) {
        document.getElementById('message-modal-title').textContent = title;
        document.getElementById('message-modal-content').textContent = content;
        messageModal.classList.remove('hidden');
    } else {
        // Fallback for pages without the message modal (e.g., login/signup)
        alert(`${title}: ${content}`);
    }
}


// Generates a simple unique ID.
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// --- Dynamic Page/Section Visibility ---
function showPortal(portalId) {
    const userPortal = document.getElementById('user-portal');
    const adminPortal = document.getElementById('admin-portal');
    if (userPortal) userPortal.classList.add('hidden');
    if (adminPortal) adminPortal.classList.add('hidden');

    const portalToShow = document.getElementById(portalId);
    if (portalToShow) {
        portalToShow.classList.remove('hidden');
    }
}

function showSection(portalId, sectionId) {
    const sections = document.querySelectorAll(`#${portalId} main section`);
    sections.forEach(section => section.classList.add('hidden'));
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
        sectionToShow.classList.remove('hidden');
    }
}

// --- Logic for Login Page (login.html) ---
if (window.location.pathname.endsWith('login.html')) {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // Store logged-in user details in sessionStorage
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'index.html'; // Redirect to the main portal page
            } else {
                const loginMessage = document.getElementById('login-message');
                if (loginMessage) {
                    loginMessage.textContent = 'Invalid username or password.';
                    loginMessage.classList.remove('hidden');
                } else {
                    alert('Invalid username or password.');
                }
            }
        });
    }
}

// --- Logic for Signup Page (signup.html) ---
if (window.location.pathname.endsWith('signup.html')) {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;

            const signupMessage = document.getElementById('signup-message');
            signupMessage.classList.add('hidden');

            if (password !== confirmPassword) {
                signupMessage.textContent = 'Passwords do not match.';
                signupMessage.classList.remove('hidden');
                return;
            }

            if (users.some(u => u.username === username)) {
                signupMessage.textContent = 'Username already exists. Please choose a different username.';
                signupMessage.classList.remove('hidden');
                return;
            }

            const newUser = {
                id: generateUniqueId(),
                username,
                password,
                role: 'user' // New users from signup are always 'user' role
            };
            users.push(newUser);
            saveData();

            alert('Account created successfully! You can now log in.');
            window.location.href = 'login.html';
        });
    }
}


// --- Logic for Main Portal Page (index.html) ---
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    // If no user is logged in, redirect to login page.
    if (!currentUser) {
        window.location.href = 'login.html';
    } else {
        // Show the correct portal based on user role.
        if (currentUser.role === 'user') {
            showPortal('user-portal');
            renderUserDashboard();
            showSection('user-portal', 'user-dashboard-section');
        } else if (currentUser.role === 'admin') {
            showPortal('admin-portal');
            renderAdminDashboard();
            showSection('admin-portal', 'admin-dashboard-section');
        }

        // Logout button for both portals
        const logoutButton = document.getElementById('logout-btn') || document.getElementById('logout-btn-admin');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                sessionStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            });
        }
    }

    // --- User Portal Functions ---
    function renderUserDashboard() {
        const tableBody = document.getElementById('available-blood-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        bloodInventory.forEach(item => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td class="py-3 px-6 text-left font-bold">${item.group}</td>
                <td class="py-3 px-6 text-left">${item.units}</td>
            `;
        });
    }

    document.getElementById('request-blood-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const bloodGroup = document.getElementById('request-blood-group').value;
        const units = parseInt(document.getElementById('request-units').value);
        const reason = document.getElementById('request-reason').value;

        const newRequest = {
            id: generateUniqueId(),
            requesterId: currentUser.id,
            requesterUsername: currentUser.username,
            bloodGroup,
            units,
            reason,
            status: 'Pending',
            date: new Date().toISOString().slice(0, 10)
        };
        bloodRequests.push(newRequest);
        saveData();
        showMessage('Request Submitted', 'Your blood request has been submitted and is awaiting approval.');
        document.getElementById('request-blood-form').reset();
        renderUserRequests();
    });

    function renderUserRequests() {
        const tableBody = document.getElementById('user-requests-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        const userSpecificRequests = bloodRequests.filter(req => req.requesterId === currentUser.id);
        userSpecificRequests.forEach(req => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td class="py-3 px-6 text-left">${req.bloodGroup}</td>
                <td class="py-3 px-6 text-left">${req.units}</td>
                <td class="py-3 px-6 text-left">${req.reason}</td>
                <td class="py-3 px-6 text-left">
                    <span class="${req.status === 'Approved' ? 'text-green-600' : req.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'} font-semibold">
                        ${req.status}
                    </span>
                </td>
                <td class="py-3 px-6 text-left">${req.date}</td>
            `;
        });
    }

    function renderUserProfile() {
        if (document.getElementById('profile-username')) {
            document.getElementById('profile-username').textContent = currentUser.username;
        }
        if (document.getElementById('profile-role')) {
            document.getElementById('profile-role').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
        }
    }

    // User Portal Navigation
    document.getElementById('user-dashboard-nav')?.addEventListener('click', (e) => {
        e.preventDefault();
        renderUserDashboard();
        showSection('user-portal', 'user-dashboard-section');
    });
    document.getElementById('user-request-blood-nav')?.addEventListener('click', (e) => {
        e.preventDefault();
        renderUserRequests();
        showSection('user-portal', 'user-request-blood-section');
    });
    document.getElementById('user-profile-nav')?.addEventListener('click', (e) => {
        e.preventDefault();
        renderUserProfile();
        showSection('user-portal', 'user-profile-section');
    });


    // --- Admin Portal Functions ---
    function renderAdminDashboard() {
        if (document.getElementById('total-donors')) {
            document.getElementById('total-donors').textContent = donors.length;
        }
        if (document.getElementById('total-blood-units')) {
            const totalUnits = bloodInventory.reduce((sum, item) => sum + item.units, 0);
            document.getElementById('total-blood-units').textContent = totalUnits;
        }
        if (document.getElementById('pending-requests')) {
            const pendingReqs = bloodRequests.filter(req => req.status === 'Pending').length;
            document.getElementById('pending-requests').textContent = pendingReqs;
        }
    }

    function renderDonors() {
        const tableBody = document.getElementById('donors-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        donors.forEach(donor => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td class="py-3 px-6 text-left">${donor.name}</td>
                <td class="py-3 px-6 text-left">${donor.bloodGroup}</td>
                <td class="py-3 px-6 text-left">${donor.contact}</td>
                <td class="py-3 px-6 text-left">${donor.lastDonation || 'N/A'}</td>
                <td class="py-3 px-6 text-left flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-900" onclick="editDonor('${donor.id}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="text-red-600 hover:text-red-900" onclick="deleteDonor('${donor.id}')"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            `;
        });
    }

    document.getElementById('add-donor-btn')?.addEventListener('click', () => {
        document.getElementById('add-donor-form')?.reset();
        closeModal('edit-donor-modal');
        closeModal('add-blood-unit-modal');
        closeModal('edit-blood-unit-modal');
        closeModal('add-user-modal');
        showModal('add-donor-modal');
    });

    document.getElementById('add-donor-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('donor-name').value;
        const bloodGroup = document.getElementById('donor-blood-group').value;
        const contact = document.getElementById('donor-contact').value;
        const lastDonation = document.getElementById('donor-last-donation').value;

        const newDonor = {
            id: generateUniqueId(),
            name,
            bloodGroup,
            contact,
            lastDonation
        };
        donors.push(newDonor);
        saveData();
        showMessage('Success', 'Donor added successfully!');
        closeModal('add-donor-modal');
        document.getElementById('add-donor-form').reset();
        renderDonors();
        renderAdminDashboard();
    });

    function editDonor(id) {
        const donor = donors.find(d => d.id === id);
        if (donor) {
            document.getElementById('edit-donor-id').value = donor.id;
            document.getElementById('edit-donor-name').value = donor.name;
            document.getElementById('edit-donor-blood-group').value = donor.bloodGroup;
            document.getElementById('edit-donor-contact').value = donor.contact;
            document.getElementById('edit-donor-last-donation').value = donor.lastDonation;
            showModal('edit-donor-modal');
        }
    }

    document.getElementById('edit-donor-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-donor-id').value;
        const name = document.getElementById('edit-donor-name').value;
        const bloodGroup = document.getElementById('edit-donor-blood-group').value;
        const contact = document.getElementById('edit-donor-contact').value;
        const lastDonation = document.getElementById('edit-donor-last-donation').value;

        const donorIndex = donors.findIndex(d => d.id === id);
        if (donorIndex !== -1) {
            donors[donorIndex] = { ...donors[donorIndex], name, bloodGroup, contact, lastDonation };
            saveData();
            showMessage('Success', 'Donor updated successfully!');
            closeModal('edit-donor-modal');
            renderDonors();
        }
    });

    function deleteDonor(id) {
        // Since confirm() is not allowed, this is a simplified delete for the demo.
        // In a real application, you would use a custom modal for confirmation.
        donors = donors.filter(d => d.id !== id);
        saveData();
        showMessage('Success', 'Donor deleted successfully!');
        renderDonors();
        renderAdminDashboard();
    }

    function renderInventory() {
        const tableBody = document.getElementById('inventory-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        bloodInventory.forEach(item => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td class="py-3 px-6 text-left font-bold">${item.group}</td>
                <td class="py-3 px-6 text-left">${item.units}</td>
                <td class="py-3 px-6 text-left">
                    <button class="text-blue-600 hover:text-blue-900" onclick="editBloodUnit('${item.group}')"><i class="fas fa-edit"></i> Edit</button>
                </td>
            `;
        });
    }

    document.getElementById('add-blood-unit-btn')?.addEventListener('click', () => {
        document.getElementById('add-blood-unit-form')?.reset();
        closeModal('add-donor-modal');
        closeModal('edit-donor-modal');
        closeModal('add-blood-unit-modal');
        closeModal('edit-blood-unit-modal');
        showModal('add-blood-unit-modal');
    });

    document.getElementById('add-blood-unit-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const bloodGroup = document.getElementById('unit-blood-group').value;
        const units = parseInt(document.getElementById('unit-count').value);

        const existingUnit = bloodInventory.find(item => item.group === bloodGroup);
        if (existingUnit) {
            existingUnit.units += units;
        } else {
            bloodInventory.push({ group: bloodGroup, units: units });
        }
        saveData();
        showMessage('Success', 'Blood units added successfully!');
        closeModal('add-blood-unit-modal');
        document.getElementById('add-blood-unit-form').reset();
        renderInventory();
        renderAdminDashboard();
    });

    function editBloodUnit(group) {
        const unit = bloodInventory.find(item => item.group === group);
        if (unit) {
            document.getElementById('edit-unit-blood-group-hidden').value = unit.group;
            document.getElementById('edit-unit-blood-group').value = unit.group;
            document.getElementById('edit-unit-count').value = unit.units;
            showModal('edit-blood-unit-modal');
        }
    }

    document.getElementById('edit-blood-unit-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const group = document.getElementById('edit-unit-blood-group-hidden').value;
        const units = parseInt(document.getElementById('edit-unit-count').value);

        const unitIndex = bloodInventory.findIndex(item => item.group === group);
        if (unitIndex !== -1) {
            bloodInventory[unitIndex].units = units;
            saveData();
            showMessage('Success', 'Blood unit count updated successfully!');
            closeModal('edit-blood-unit-modal');
            renderInventory();
            renderAdminDashboard();
        }
    });

    function renderRequests() {
        const tableBody = document.getElementById('requests-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        bloodRequests.forEach(req => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td class="py-3 px-6 text-left">${req.requesterUsername}</td>
                <td class="py-3 px-6 text-left">${req.bloodGroup}</td>
                <td class="py-3 px-6 text-left">${req.units}</td>
                <td class="py-3 px-6 text-left">${req.reason}</td>
                <td class="py-3 px-6 text-left">
                    <span class="${req.status === 'Approved' ? 'text-green-600' : req.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'} font-semibold">
                        ${req.status}
                    </span>
                </td>
                <td class="py-3 px-6 text-left">${req.date}</td>
                <td class="py-3 px-6 text-left flex space-x-2">
                    ${req.status === 'Pending' ? `
                        <button class="text-green-600 hover:text-green-900" onclick="approveRequest('${req.id}')"><i class="fas fa-check-circle"></i> Approve</button>
                        <button class="text-red-600 hover:text-red-900" onclick="rejectRequest('${req.id}')"><i class="fas fa-times-circle"></i> Reject</button>
                    ` : ''}
                </td>
            `;
        });
    }

    function approveRequest(id) {
        const request = bloodRequests.find(req => req.id === id);
        if (request) {
            const inventoryItem = bloodInventory.find(item => item.group === request.bloodGroup);
            if (inventoryItem && inventoryItem.units >= request.units) {
                request.status = 'Approved';
                inventoryItem.units -= request.units;
                saveData();
                showMessage('Success', `Request for ${request.bloodGroup} (${request.units} units) approved!`);
                renderRequests();
                renderAdminDashboard();
            } else {
                showMessage('Error', 'Not enough units in inventory to approve this request.');
            }
        }
    }

    function rejectRequest(id) {
        const request = bloodRequests.find(req => req.id === id);
        if (request) {
            request.status = 'Rejected';
            saveData();
            showMessage('Success', 'Request rejected.');
            renderRequests();
            renderAdminDashboard();
        }
    }

    function renderUsers() {
        const tableBody = document.getElementById('users-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        users.forEach(user => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td class="py-3 px-6 text-left">${user.username}</td>
                <td class="py-3 px-6 text-left">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                <td class="py-3 px-6 text-left">
                    ${user.id !== currentUser.id ? `<button class="text-red-600 hover:text-red-900" onclick="deleteUser('${user.id}')"><i class="fas fa-trash-alt"></i> Delete</button>` : ''}
                </td>
            `;
        });
    }

    document.getElementById('add-user-btn')?.addEventListener('click', () => {
        document.getElementById('add-user-form')?.reset();
        closeModal('add-donor-modal');
        closeModal('edit-donor-modal');
        closeModal('add-blood-unit-modal');
        closeModal('edit-blood-unit-modal');
        showModal('add-user-modal');
    });

    document.getElementById('add-user-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUsername = document.getElementById('new-username').value;
        const newPassword = document.getElementById('new-password').value;
        const newRole = document.getElementById('new-role').value;

        if (users.some(u => u.username === newUsername)) {
            showMessage('Error', 'Username already exists. Please choose a different username.');
            return;
        }

        const newUser = {
            id: generateUniqueId(),
            username: newUsername,
            password: newPassword,
            role: newRole
        };
        users.push(newUser);
        saveData();
        showMessage('Success', 'User added successfully!');
        closeModal('add-user-modal');
        document.getElementById('add-user-form').reset();
        renderUsers();
    });

    function deleteUser(id) {
        // Simplified for demo:
        // In a real application, you would use a custom modal for confirmation.
        users = users.filter(u => u.id !== id);
        saveData();
        showMessage('Success', 'User deleted successfully!');
        renderUsers();
    }

    // Admin Portal Navigation
    document.getElementById('admin-dashboard-nav')?.addEventListener('click', (e) => {
        e.preventDefault();
        renderAdminDashboard();
        showSection('admin-portal', 'admin-dashboard-section');
    });
    document.getElementById('admin-donors-nav')?.addEventListener('click', (e) => {
        e.preventDefault();
        renderDonors();
        showSection('admin-portal', 'admin-donors-section');
    });
    document.getElementById('admin-inventory-nav')?.addEventListener('click', (e) => {
        e.preventDefault();
        renderInventory();
        showSection('admin-portal', 'admin-inventory-section');
    });
    document.getElementById('admin-requests-nav')?.addEventListener('click', (e) => {
        e.preventDefault();
        renderRequests();
        showSection('admin-portal', 'admin-requests-section');
    });
    document.getElementById('admin-users-nav')?.addEventListener('click', (e) => {
        e.preventDefault();
        renderUsers();
        showSection('admin-portal', 'admin-users-section');
    });
}