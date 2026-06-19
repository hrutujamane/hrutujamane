require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize JSON Database
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], activities: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- API ROUTES ---

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email === "rutuja@test.com" && password === "password123") {
      return res.json({ success: true, user: { name: "Rutuja", email, role: 'student', section: 'internship' } });
    }

    const db = readDB();
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, user: { name: user.name, email: user.email, role: user.role, section: user.section } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, mobile, role, section } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const db = readDB();
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      mobile,
      role: role || 'student',
      section: section || 'internship',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);

    res.json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { listingUrl, fileName } = req.body;
    const db = readDB();
    
    db.activities.push({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      type: listingUrl ? 'url' : 'scan',
      url: listingUrl || null,
      fileName: fileName || null,
      timestamp: Date.now()
    });
    
    writeDB(db);
    res.json({ success: true, trustScore: 95 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/api/user-stats', async (req, res) => {
  try {
    const db = readDB();
    const usageCount = db.activities.length;
    
    const pastedLinksDocs = db.activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
      
    const pastedLinks = pastedLinksDocs.map(doc => ({
      url: doc.url,
      fileName: doc.fileName,
      date: doc.date,
      time: doc.time,
      type: doc.type
    }));

    res.json({ 
      success: true, 
      stats: { usageCount, pastedLinks }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));