const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5500;

// Serve static files from the current folder
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serving at http://localhost:${PORT}`);
});
