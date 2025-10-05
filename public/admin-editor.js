// Admin Editor Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    if (!sessionStorage.getItem('isAdminLoggedIn')) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // API Base URL
    const API_BASE = 'http://localhost:8001/api';
    
    // DOM Elements
    const storyForm = document.getElementById('storyForm');
    const storiesList = document.getElementById('storiesList');
    const notificationsList = document.getElementById('notificationsList');
    const logoutBtn = document.getElementById('logoutBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Load stories and notifications on page load
    loadStories();
    loadNotifications();
    
    // Refresh notifications every 30 seconds
    setInterval(loadNotifications, 30000);
    
    // Form submission
    storyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveStory();
    });
    
    // Cancel button
    cancelBtn.addEventListener('click', resetForm);
    
    // Logout button
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('isAdminLoggedIn');
        window.location.href = 'index.html';
    });
    
    // Load stories from backend
    function loadStories() {
        fetch(`${API_BASE}/stories`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load stories');
                }
                return response.json();
            })
            .then(stories => {
                storiesList.innerHTML = '';
                
                if (stories.length === 0) {
                    storiesList.innerHTML = '<p>No stories found. Create your first story!</p>';
                    return;
                }
                
                stories.forEach(story => {
                    const storyElement = document.createElement('div');
                    storyElement.className = 'story-item';
                    storyElement.innerHTML = `
                        <div class="story-title">${story.title}</div>
                        <div class="story-actions">
                            <button class="edit-btn" data-id="${story.id}">Edit</button>
                            <button class="delete-btn" data-id="${story.id}">Delete</button>
                        </div>
                    `;
                    
                    // Add event listeners to the buttons
                    const editBtn = storyElement.querySelector('.edit-btn');
                    const deleteBtn = storyElement.querySelector('.delete-btn');
                    
                    editBtn.addEventListener('click', function() {
                        editStory(story.id);
                    });
                    
                    deleteBtn.addEventListener('click', function() {
                        deleteStory(story.id);
                    });
                    
                    storiesList.appendChild(storyElement);
                });
            })
            .catch(error => {
                console.error('Error loading stories:', error);
                storiesList.innerHTML = '<p>Error loading stories. Please try again.</p>';
            });
    }
    
    // Load notifications from backend
    function loadNotifications() {
        fetch(`${API_BASE}/admin/notifications`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load notifications');
                }
                return response.json();
            })
            .then(notifications => {
                notificationsList.innerHTML = '';
                
                if (notifications.length === 0) {
                    notificationsList.innerHTML = '<p>No notifications</p>';
                    return;
                }
                
                // Sort notifications by date (newest first)
                notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                // Show only unread notifications or last 5 notifications
                const displayNotifications = notifications.filter(n => !n.read).slice(0, 5);
                if (displayNotifications.length === 0) {
                    displayNotifications.push(...notifications.slice(0, 5));
                }
                
                displayNotifications.forEach(notification => {
                    const notificationElement = document.createElement('div');
                    notificationElement.className = `notification-item ${notification.read ? '' : 'unread'}`;
                    
                    if (notification.type === 'review') {
                        notificationElement.innerHTML = `
                            <div class="notification-content">
                                <div class="notification-title">New Review Received</div>
                                <div class="notification-message">${notification.message}</div>
                                <div class="notification-details">
                                    <div>Story: ${notification.storyTitle}</div>
                                    <div>Rating: ${'★'.repeat(notification.rating)}${'☆'.repeat(5 - notification.rating)}</div>
                                    ${notification.comment ? `<div>Comment: ${notification.comment}</div>` : ''}
                                </div>
                                <div class="notification-time">${formatTimeAgo(notification.createdAt)}</div>
                            </div>
                        `;
                    } else {
                        notificationElement.innerHTML = `
                            <div class="notification-content">
                                <div class="notification-title">Notification</div>
                                <div class="notification-message">${notification.message}</div>
                                <div class="notification-time">${formatTimeAgo(notification.createdAt)}</div>
                            </div>
                        `;
                    }
                    
                    notificationsList.appendChild(notificationElement);
                });
            })
            .catch(error => {
                console.error('Error loading notifications:', error);
                // Don't show error in UI to avoid cluttering the interface
            });
    }
    
    // Format time ago
    function formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} days ago`;
        
        return date.toLocaleDateString();
    }
    
    // Save or update a story
    function saveStory() {
        const id = document.getElementById('storyId').value;
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const mixedContent = document.getElementById('mixedContent').value;
        
        if (!title || !content) {
            alert('Please fill in all required fields');
            return;
        }
        
        const storyData = { title, content, mixedContent };
        
        let fetchPromise;
        if (id) {
            // Update existing story
            fetchPromise = fetch(`${API_BASE}/stories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(storyData)
            });
        } else {
            // Create new story
            fetchPromise = fetch(`${API_BASE}/stories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(storyData)
            });
        }
        
        fetchPromise
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to save story: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(() => {
                // Reset form and reload stories
                resetForm();
                loadStories();
                alert('Story saved successfully!');
            })
            .catch(error => {
                console.error('Error saving story:', error);
                alert(`Error saving story: ${error.message}`);
            });
    }
    
    // Edit a story
    function editStory(storyId) {
        fetch(`${API_BASE}/stories/${storyId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load story: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(story => {
                document.getElementById('storyId').value = story.id;
                document.getElementById('title').value = story.title;
                document.getElementById('content').value = story.content;
                document.getElementById('mixedContent').value = story.mixedContent || '';
                
                // Scroll to form
                document.querySelector('.editor-section').scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                console.error('Error loading story:', error);
                alert(`Error loading story: ${error.message}`);
            });
    }
    
    // Delete a story
    function deleteStory(storyId) {
        if (confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
            fetch(`${API_BASE}/stories/${storyId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok && response.status !== 204) {
                    throw new Error(`Failed to delete story: ${response.status} ${response.statusText}`);
                }
                // For 204 No Content, we don't need to parse JSON
                loadStories();
                alert('Story deleted successfully!');
            })
            .catch(error => {
                console.error('Error deleting story:', error);
                alert(`Error deleting story: ${error.message}`);
            });
        }
    }
    
    // Reset form
    function resetForm() {
        storyForm.reset();
        document.getElementById('storyId').value = '';
    }
});