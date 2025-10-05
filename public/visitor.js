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
    
    // Current story data
    let currentStory = null;
    
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
    
    // Load stories from backend
    function loadStories() {
        fetch(`${API_BASE}/stories`)
            .then(response => response.json())
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
            .then(response => response.json())
            .then(story => {
                currentStory = story;
                storyTitle.textContent = story.title;
                displayStoryContent();
                storyListSection.classList.add('hidden');
                storyDetailSection.classList.remove('hidden');
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