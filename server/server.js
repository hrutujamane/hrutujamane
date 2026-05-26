const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Default login credentials
let users = [{ email: "rutuja@test.com", password: "password123" }];

// History tracking for the Dashboard
let userActivity = {
  usageCount: 0,
  pastedLinks: []
};

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) res.json({ success: true });
  else res.status(401).json({ success: false });
});

app.post('/api/analyze', (req, res) => {
  const { listingUrl } = req.body;
  userActivity.usageCount += 1; // Increments every time you click analyze
  if (listingUrl) {
    userActivity.pastedLinks.push({
      url: listingUrl,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    });
  }
  res.json({ success: true, trustScore: 95 });
});

app.get('/api/user-stats', (req, res) => {
  res.json({ success: true, stats: userActivity });
});

app.listen(5000, () => console.log("Backend running on port 5000"));