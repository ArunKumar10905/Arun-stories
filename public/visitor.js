// Visitor Script
document.addEventListener('DOMContentLoaded', function() {
    // API Base URL
    const API_BASE = 'http://localhost:8001/api';
    
    // DOM Elements
    const storiesContainer = document.getElementById('storiesContainer');
    const storyListSection = document.getElementById('storyListSection');
    const storyDetailSection = document.getElementById('storyDetailSection');
    const storyTitle = document.getElementById('storyTitle');
    const storyContent = document.getElementById('storyContent');
    const languageSelector = document.getElementById('languageSelector');
    const backBtn = document.getElementById('backBtn');
    
    // Review elements
    const stars = document.querySelectorAll('.star');
    const ratingText = document.getElementById('ratingText');
    const reviewComment = document.getElementById('reviewComment');
    const submitReview = document.getElementById('submitReview');
    const reviewMessage = document.getElementById('reviewMessage');
    
    // Current story data
    let currentStory = null;
    let selectedRating = 0;
    
    // Load stories on page load
    loadStories();
    
    // Language selector change event
    languageSelector.addEventListener('change', function() {
        if (currentStory) {
            displayStoryContent();
        }
    });
    
    // Back button event
    backBtn.addEventListener('click', function() {
        storyListSection.classList.remove('hidden');
        storyDetailSection.classList.add('hidden');
    });
    
    // Star rating functionality
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            updateStars(selectedRating);
            ratingText.textContent = getRatingText(selectedRating);
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
        
        star.addEventListener('mouseout', function() {
            highlightStars(selectedRating);
        });
    });
    
    // Submit review
    submitReview.addEventListener('click', function() {
        if (!currentStory) return;
        
        if (selectedRating === 0) {
            showMessage('Please select a rating', 'error');
            return;
        }
        
        const reviewData = {
            rating: selectedRating,
            comment: reviewComment.value.trim()
        };
        
        fetch(`${API_BASE}/stories/${currentStory.id}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to submit review: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(() => {
            showMessage('Thank you for your review! Your feedback has been sent to the admin.', 'success');
            // Reset form
            selectedRating = 0;
            updateStars(0);
            ratingText.textContent = 'Select a rating';
            reviewComment.value = '';
        })
        .catch(error => {
            console.error('Error submitting review:', error);
            showMessage(`Error submitting review: ${error.message}`, 'error');
        });
    });
    
    // Load stories from backend
    function loadStories() {
        fetch(`${API_BASE}/stories`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load stories: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(stories => {
                storiesContainer.innerHTML = '';
                
                if (stories.length === 0) {
                    storiesContainer.innerHTML = '<p>No stories available yet. Please check back later!</p>';
                    return;
                }
                
                stories.forEach(story => {
                    const storyElement = document.createElement('div');
                    storyElement.className = 'story-item';
                    storyElement.innerHTML = `
                        <div class="story-title">${story.title}</div>
                        <button class="edit-btn" onclick="viewStory('${story.id}')">Read Story</button>
                    `;
                    storiesContainer.appendChild(storyElement);
                });
            })
            .catch(error => {
                console.error('Error loading stories:', error);
                storiesContainer.innerHTML = '<p>Error loading stories. Please try again later.</p>';
            });
    }
    
    // View a story
    window.viewStory = function(storyId) {
        fetch(`${API_BASE}/stories/${storyId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load story: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(story => {
                currentStory = story;
                storyTitle.textContent = story.title;
                displayStoryContent();
                storyListSection.classList.add('hidden');
                storyDetailSection.classList.remove('hidden');
                
                // Reset review form
                selectedRating = 0;
                updateStars(0);
                ratingText.textContent = 'Select a rating';
                reviewComment.value = '';
                reviewMessage.textContent = '';
                reviewMessage.className = 'review-message';
            })
            .catch(error => {
                console.error('Error loading story:', error);
                storyContent.textContent = 'Error loading story. Please try again.';
            });
    };
    
    // Display story content based on language selection
    function displayStoryContent() {
        if (!currentStory) return;
        
        const languageStyle = languageSelector.value;
        
        if (languageStyle === 'mixed' && currentStory.mixedContent) {
            // Use provided mixed content
            storyContent.textContent = currentStory.mixedContent;
        } else if (languageStyle === 'mixed') {
            // Generate mixed content automatically
            storyContent.textContent = convertToMixedLanguage(currentStory.content);
        } else {
            // Use English content
            storyContent.textContent = currentStory.content;
        }
    }
    
    // Update star display
    function updateStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }
    
    // Highlight stars on hover
    function highlightStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('highlight');
            } else {
                star.classList.remove('highlight');
            }
        });
    }
    
    // Get rating text
    function getRatingText(rating) {
        const texts = {
            1: 'Poor',
            2: 'Fair',
            3: 'Good',
            4: 'Very Good',
            5: 'Excellent'
        };
        return texts[rating] || 'Select a rating';
    }
    
    // Show message
    function showMessage(message, type) {
        reviewMessage.textContent = message;
        reviewMessage.className = `review-message ${type}`;
    }
    
    // Convert English text to mixed language (English + Hindi)
    function convertToMixedLanguage(text) {
        // This is a simple simulation - in a real app, you would have actual translations
        const hindiWords = {
            'the': 'वह',
            'is': 'है',
            'are': 'हैं',
            'was': 'था',
            'were': 'थे',
            'and': 'और',
            'or': 'या',
            'but': 'लेकिन',
            'this': 'यह',
            'that': 'वह',
            'these': 'ये',
            'those': 'वे',
            'i': 'मैं',
            'you': 'आप',
            'he': 'वह (पुरुष)',
            'she': 'वह (स्त्री)',
            'we': 'हम',
            'they': 'वे',
            'my': 'मेरा',
            'your': 'आपका',
            'his': 'उसका (पुरुष)',
            'her': 'उसका (स्त्री)',
            'our': 'हमारा',
            'their': 'उनका',
            'hello': 'नमस्ते',
            'good': 'अच्छा',
            'bad': 'बुरा',
            'big': 'बड़ा',
            'small': 'छोटा',
            'new': 'नया',
            'old': 'पुराना',
            'very': 'बहुत',
            'much': 'अधिक',
            'many': 'कई',
            'few': 'थोड़े',
            'some': 'कुछ',
            'any': 'कोई',
            'all': 'सभी',
            'every': 'हर',
            'each': 'प्रत्येक',
            'one': 'एक',
            'two': 'दो',
            'three': 'तीन',
            'four': 'चार',
            'five': 'पाँच',
            'first': 'पहला',
            'second': 'दूसरा',
            'last': 'आखिरी',
            'time': 'समय',
            'day': 'दिन',
            'night': 'रात',
            'morning': 'सुबह',
            'evening': 'शाम',
            'today': 'आज',
            'tomorrow': 'कल',
            'yesterday': 'कल (बीता)',
            'week': 'सप्ताह',
            'month': 'महीना',
            'year': 'साल',
            'house': 'घर',
            'home': 'घर',
            'family': 'परिवार',
            'friend': 'दोस्त',
            'love': 'प्यार',
            'hate': 'नफरत',
            'happy': 'खुश',
            'sad': 'उदास',
            'angry': 'गुस्सा',
            'afraid': 'डर',
            'surprised': 'अचंभित',
            'tired': 'थका हुआ',
            'hungry': 'भूखा',
            'thirsty': 'प्यासा',
            'hot': 'गर्म',
            'cold': 'ठंडा',
            'warm': 'गर्म',
            'cool': 'ठंडा',
            'beautiful': 'सुंदर',
            'ugly': 'कुरूप',
            'easy': 'आसान',
            'difficult': 'मुश्किल',
            'important': 'महत्वपूर्ण',
            'necessary': 'आवश्यक',
            'possible': 'संभव',
            'impossible': 'असंभव'
        };
        
        // Simple word replacement for demonstration
        let mixedText = text;
        for (const [english, hindi] of Object.entries(hindiWords)) {
            // Case insensitive replacement
            const regex = new RegExp('\\b' + english + '\\b', 'gi');
            mixedText = mixedText.replace(regex, match => {
                // Preserve original case
                if (match === match.toUpperCase()) {
                    return hindi.toUpperCase();
                } else if (match === match.charAt(0).toUpperCase() + match.slice(1)) {
                    return hindi.charAt(0).toUpperCase() + hindi.slice(1);
                }
                return hindi;
            });
        }
        
        return mixedText;
    }
});