
const express = require('express');
const path = require('path');
const xvideos = require('@rodrigogs/xvideos');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const page = Number(req.query.page || 1);

    if (!q) {
      return res.status(400).json({ error: 'Missing search query ?q=' });
    }

    const results = await xvideos.videos.search({
      search: q,
      page
    });

    res.json(results.videos || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Fresh videos endpoint
app.get('/api/fresh', async (req, res) => {
  try {
    const page = Number(req.query.page || 1);

    const results = await xvideos.videos.fresh({ page });

    res.json(results.videos || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch fresh videos' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
