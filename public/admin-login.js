// Admin Login Script
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    // Hardcoded admin credentials (SECRET - DO NOT SHARE)
    const ADMIN_USERNAME = '75226';
    const ADMIN_PASSWORD = 'Arun@091005';
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Store login status in sessionStorage
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            window.location.href = 'admin-editor.html';
        } else {
            errorMessage.textContent = 'Invalid username or password!';
            errorMessage.style.display = 'block';
            
            // Clear the form
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }
    });
});