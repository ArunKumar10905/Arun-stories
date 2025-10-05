const express = require('express');
const path = require('path');
const app = express();
const PORT = 8001;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// In-memory storage for stories and reviews (in production, you would use a database)
let stories = [
  {
    id: '1',
    title: 'The Adventure Begins',
    content: 'In a land far away, there lived a brave knight named Arthur. He was known throughout the kingdom for his courage and kindness. One day, a mysterious message arrived that would change his life forever...',
    mixedContent: 'In a land far away, there lived a brave knight named Arthur. He was known throughout the kingdom for his courage और kindness. One day, a mysterious संदेश arrived that would change his life forever...',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'The Magic Forest',
    content: 'Deep in the heart of the enchanted woods, where sunlight barely touched the ground, magical creatures roamed freely. Elves, fairies, and talking animals lived in harmony, protected by ancient spells.',
    mixedContent: 'Deep in the heart of the enchanted woods, where sunlight barely touched the ground, magical creatures roamed freely. Elves, fairies, और talking animals lived in harmony, protected by ancient spells.',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'The Lost Treasure',
    content: 'Captain Jack had been searching for the legendary treasure of Pirates Bay for years. Many had tried and failed, but Jack was determined. With his trusty map and loyal crew, he set sail for one final attempt.',
    mixedContent: 'Captain Jack had been searching for the legendary treasure of Pirates Bay for years. Many had tried और failed, but Jack was determined. With his trusty map और loyal crew, he set sail for one final attempt.',
    createdAt: new Date().toISOString()
  }
];

// In-memory storage for reviews
let reviews = [];

// In-memory storage for admin notifications
let adminNotifications = [];

// Routes
app.get('/api/stories', (req, res) => {
  // Return stories without mixed content for listing
  const storiesList = stories.map(story => ({
    id: story.id,
    title: story.title,
    createdAt: story.createdAt
  }));
  res.json(storiesList);
});

app.get('/api/stories/:id', (req, res) => {
  const story = stories.find(s => s.id === req.params.id);
  if (!story) {
    return res.status(404).json({ message: 'Story not found' });
  }
  res.json(story);
});

app.post('/api/stories', (req, res) => {
  const { title, content, mixedContent } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  
  const newStory = {
    id: Date.now().toString(),
    title,
    content,
    mixedContent: mixedContent || content, // Use English content as default for mixed if not provided
    createdAt: new Date().toISOString()
  };
  
  stories.push(newStory);
  res.status(201).json(newStory);
});

app.put('/api/stories/:id', (req, res) => {
  const { title, content, mixedContent } = req.body;
  const storyIndex = stories.findIndex(s => s.id === req.params.id);
  
  if (storyIndex === -1) {
    return res.status(404).json({ message: 'Story not found' });
  }
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  
  stories[storyIndex] = {
    ...stories[storyIndex],
    title,
    content,
    mixedContent: mixedContent || content // Use English content as default for mixed if not provided
  };
  
  res.json(stories[storyIndex]);
});

app.delete('/api/stories/:id', (req, res) => {
  const storyIndex = stories.findIndex(s => s.id === req.params.id);
  
  if (storyIndex === -1) {
    return res.status(404).json({ message: 'Story not found' });
  }
  
  stories.splice(storyIndex, 1);
  // Send a simple success response without JSON for DELETE
  res.status(204).send();
});

// Review routes
app.get('/api/stories/:id/reviews', (req, res) => {
  const storyReviews = reviews.filter(review => review.storyId === req.params.id);
  res.json(storyReviews);
});

app.post('/api/stories/:id/reviews', (req, res) => {
  const { rating, comment } = req.body;
  const storyId = req.params.id;
  
  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  
  // Check if story exists
  const story = stories.find(s => s.id === storyId);
  if (!story) {
    return res.status(404).json({ message: 'Story not found' });
  }
  
  const newReview = {
    id: Date.now().toString(),
    storyId,
    rating: parseInt(rating),
    comment: comment || '',
    createdAt: new Date().toISOString()
  };
  
  reviews.push(newReview);
  
  // Create admin notification
  const notification = {
    id: Date.now().toString(),
    type: 'review',
    message: `New ${rating}-star review for story "${story.title}"`,
    storyTitle: story.title,
    rating,
    comment: comment || '',
    createdAt: new Date().toISOString(),
    read: false
  };
  
  adminNotifications.push(notification);
  
  res.status(201).json(newReview);
});

// Admin notification routes
app.get('/api/admin/notifications', (req, res) => {
  res.json(adminNotifications);
});

app.put('/api/admin/notifications/:id/read', (req, res) => {
  const notification = adminNotifications.find(n => n.id === req.params.id);
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  
  notification.read = true;
  res.json(notification);
});

// Serve frontend files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});