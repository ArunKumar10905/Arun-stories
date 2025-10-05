const express = require('express');
const path = require('path');
const app = express();
const PORT = 3002;

// Serve static files from the public directory
app.use(express.static('public'));

// Serve index.html for all routes (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
});