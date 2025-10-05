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
    const logoutBtn = document.getElementById('logoutBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Load stories on page load
    loadStories();
    
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
            .then(response => response.json())
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
                            <button class="edit-btn" onclick="editStory('${story.id}')">Edit</button>
                            <button class="delete-btn" onclick="deleteStory('${story.id}')">Delete</button>
                        </div>
                    `;
                    storiesList.appendChild(storyElement);
                });
            })
            .catch(error => {
                console.error('Error loading stories:', error);
                storiesList.innerHTML = '<p>Error loading stories. Please try again.</p>';
            });
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
                    throw new Error('Failed to save story');
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
                alert('Error saving story. Please try again.');
            });
    }
    
    // Edit a story
    window.editStory = function(storyId) {
        fetch(`${API_BASE}/stories/${storyId}`)
            .then(response => response.json())
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
                alert('Error loading story. Please try again.');
            });
    };
    
    // Delete a story
    window.deleteStory = function(storyId) {
        if (confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
            fetch(`${API_BASE}/stories/${storyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete story');
                }
                return response.json();
            })
            .then(data => {
                console.log('Delete response:', data);
                loadStories();
                alert('Story deleted successfully!');
            })
            .catch(error => {
                console.error('Error deleting story:', error);
                alert('Error deleting story. Please try again.');
            });
        }
    };
    
    // Reset form
    function resetForm() {
        storyForm.reset();
        document.getElementById('storyId').value = '';
    }
});