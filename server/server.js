require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { scrapeListingUrl } = require('./utils/scraper');

// Models
const User = require('./models/User');
const Activity = require('./models/Activity');
const Report = require('./models/Report');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const DB_FILE = path.join(__dirname, 'database.json');
let useMongo = false;

// Initialize JSON Database helper
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], activities: [], reports: [] }, null, 2));
  }
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  if (!db.reports) db.reports = [];
  if (!db.activities) db.activities = [];
  if (!db.users) db.users = [];
  return db;
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Connect to MongoDB with timeout fallback
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/internshield', {
  serverSelectionTimeoutMS: 3000
})
  .then(() => {
    console.log('Connected to MongoDB successfully. Production DB active.');
    useMongo = true;
    seedAdminUser();
  })
  .catch((err) => {
    console.warn('MongoDB connection failed (is MongoDB service running?). Falling back to local database.json storage.');
    useMongo = false;
    seedAdminUser();
  });

async function seedAdminUser() {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@inplasheild.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword@2026';
    const adminName = process.env.ADMIN_NAME || 'Admin';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (useMongo) {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount > 0) return;
      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        section: 'internship'
      });
    } else {
      const db = readDB();
      if (db.users.some((u) => u.role === 'admin')) return;
      db.users.push({
        id: `admin-${Date.now()}`,
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        section: 'internship',
        createdAt: new Date().toISOString(),
      });
      writeDB(db);
    }
    console.log(`Admin account ready: ${adminEmail}`);
  } catch (err) {
    console.error('Failed to seed admin user:', err);
  }
}

function sanitizeUser(user) {
  return {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    section: user.section,
    mobile: user.mobile || null,
    createdAt: user.createdAt,
  };
}

async function requireAdmin(req, res) {
  const email = (req.headers['x-user-email'] || '').trim().toLowerCase();
  if (!email) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return null;
  }
  const user = await findOneUser({ email });
  if (!user || user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Admin access required' });
    return null;
  }
  return user;
}

// Database Abstraction Wrappers
async function findOneUser(query) {
  if (useMongo) {
    return await User.findOne(query);
  } else {
    const db = readDB();
    if (query.email) {
      return db.users.find(u => u.email === query.email.toLowerCase()) || null;
    }
    if (query._id) {
      return db.users.find(u => u.id === query._id) || null;
    }
    return null;
  }
}

async function createUser(userData) {
  if (useMongo) {
    return await User.create(userData);
  } else {
    const db = readDB();
    const newUser = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...userData
    };
    db.users.push(newUser);
    writeDB(db);
    return newUser;
  }
}

async function updateUserSection(email, section) {
  if (useMongo) {
    const user = await User.findOne({ email });
    if (user) {
      user.section = section;
      await user.save();
      return user;
    }
  } else {
    const db = readDB();
    const user = db.users.find(u => u.email === email);
    if (user) {
      user.section = section;
      writeDB(db);
      return user;
    }
  }
  return null;
}

async function findReports() {
  if (useMongo) {
    return await Report.find();
  } else {
    const db = readDB();
    return db.reports || [];
  }
}

async function createReport(reportData) {
  if (useMongo) {
    return await Report.create(reportData);
  } else {
    const db = readDB();
    const newReport = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      ...reportData
    };
    db.reports.push(newReport);
    writeDB(db);
    return newReport;
  }
}

async function findActivities(query = {}) {
  if (useMongo) {
    return await Activity.find(query);
  } else {
    const db = readDB();
    let list = db.activities || [];
    if (query.userEmail) {
      list = list.filter(a => a.userEmail === query.userEmail);
    }
    return list;
  }
}

async function createActivity(activityData) {
  if (useMongo) {
    return await Activity.create(activityData);
  } else {
    const db = readDB();
    const newActivity = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      ...activityData
    };
    db.activities.push(newActivity);
    writeDB(db);
    return newActivity;
  }
}

function evaluateListing(text, companyName, jobTitle) {
  const redFlags = [];
  let score = 100;
  
  const cleanText = typeof text === 'string' ? text : '';
  const lowerText = cleanText.toLowerCase();
  const companyClean = (companyName || '').trim().toLowerCase();
  
  // 1. Pay-to-Join / Upfront Fees Check
  const payScamTriggers = [
    { kw: 'processing fee', desc: 'Listing mentions a "processing fee" for application or onboarding.' },
    { kw: 'security deposit', desc: 'Requires a security deposit, which is a classic pay-to-join scam indicator.' },
    { kw: 'registration fee', desc: 'Charges a registration fee to access the internship or training.' },
    { kw: 'security amount', desc: 'Mentions a security amount deposit for laptops or study materials.' },
    { kw: 'charge fee', desc: 'Requires candidates to pay fees to proceed.' },
    { kw: 'deposit money', desc: 'Requires depositing money before start.' },
    { kw: ' to pay ', desc: 'Asks to payment for certification or onboarding.' },
    { kw: 'training charge', desc: 'Charges for mandatory initial training.' },
    { kw: 'certification fee', desc: 'Charges a fee for issuing the internship certificate.' },
    { kw: 'buying course', desc: 'Requires buying a course as a prerequisite for selection.' },
    { kw: 'materials fee', desc: 'Charges for training kits or software tools.' },
    { kw: 'onboarding charges', desc: 'Mentions charges or fees during onboarding.' }
  ];
  
  let payScamMatched = false;
  payScamTriggers.forEach(trigger => {
    if (lowerText.includes(trigger.kw)) {
      payScamMatched = true;
      redFlags.push({
        type: 'Pay-to-Join Scheme',
        description: trigger.desc + ' Legitimate companies never charge applicants.',
        severity: 'high'
      });
    }
  });
  if (payScamMatched) {
    score -= 40;
  }

  // 2. Impersonation Scam Check (High-profile brand with public email)
  const topBrands = [
    'google', 'microsoft', 'apple', 'amazon', 'meta', 'netflix', 'adobe', 
    'tcs', 'tata consultancy services', 'wipro', 'infosys', 'cognizant', 
    'accenture', 'capgemini', 'hcl', 'ibm', 'oracle', 'salesforce'
  ];
  
  const publicEmailRegex = /([a-zA-Z0-9._%+-]+)@(gmail|yahoo|outlook|hotmail|zoho|protonmail|live)\.com/i;
  const emailMatch = text.match(publicEmailRegex);
  
  let brandImpersonated = false;
  if (emailMatch) {
    const emailStr = emailMatch[0].toLowerCase();
    const matchedBrand = topBrands.find(brand => 
      companyClean.includes(brand) || lowerText.includes(`company: ${brand}`) || lowerText.includes(`recruitment from ${brand}`) || lowerText.includes(`at ${brand}`)
    );
    
    if (matchedBrand) {
      brandImpersonated = true;
      redFlags.push({
        type: 'Brand Impersonation',
        description: `Claims association with "${matchedBrand.toUpperCase()}" but requests applications via a public email address (${emailStr}). Official recruiters use corporate domains.`,
        severity: 'high'
      });
      score -= 40;
    } else {
      redFlags.push({
        type: 'Public Domain Email',
        description: `Recruiter email (${emailStr}) is from a free public domain. Reputable corporate hiring uses official business domains.`,
        severity: 'medium'
      });
      score -= 20;
    }
  }

  // 3. WhatsApp/Telegram only communication channels
  const chatScamTriggers = [
    { kw: 'whatsapp only', desc: 'Communication is strictly WhatsApp-only.' },
    { kw: 'telegram channel', desc: 'Directs candidates to join a Telegram channel.' },
    { kw: 't.me/', desc: 'Uses t.me/ links for recruitment chat.' },
    { kw: 'dm on whatsapp', desc: 'Asks to send direct messages on WhatsApp.' },
    { kw: 'telegram group', desc: 'Uses Telegram groups for coordination.' }
  ];
  let chatScamMatched = false;
  chatScamTriggers.forEach(trigger => {
    if (lowerText.includes(trigger.kw)) {
      chatScamMatched = true;
      redFlags.push({
        type: 'Suspicious Contact Method',
        description: trigger.desc + ' Professional recruiters do not conduct business solely through instant messaging.',
        severity: 'medium'
      });
    }
  });
  if (chatScamMatched) {
    score -= 20;
  }

  // 4. Guaranteed / Urgent selection with no process
  const selectionScamTriggers = [
    { kw: 'direct selection', desc: 'Offers guaranteed "direct selection" without standard interviews.' },
    { kw: 'no interview', desc: 'Claims no interview or assessment is required.' },
    { kw: 'guaranteed selection', desc: 'Guarantees the internship offer upfront.' },
    { kw: 'earn 50k/month', desc: 'Promises unrealistically high salary for an internship.' },
    { kw: 'immediate joining', desc: 'Creates artificial urgency to join immediately.' },
    { kw: 'no experience required', desc: 'Offers high-paying roles with absolutely no skills/experience needed.' },
    { kw: 'quick money', desc: 'Promises fast income.' }
  ];
  let selectionScamMatched = false;
  selectionScamTriggers.forEach(trigger => {
    if (lowerText.includes(trigger.kw)) {
      selectionScamMatched = true;
      redFlags.push({
        type: 'Suspicious Offer Details',
        description: trigger.desc + ' Be cautious of listings that seem too easy or promise guaranteed returns.',
        severity: 'medium'
      });
    }
  });
  if (selectionScamMatched) {
    score -= 15;
  }

  // 5. Unprofessional presentation (excessive exclamation marks, etc.)
  const exclamationCount = (text.match(/!/g) || []).length;
  const currencyCount = (text.match(/\$|rs\./gi) || []).length;
  if (exclamationCount > 8 || currencyCount > 6) {
    redFlags.push({
      type: 'Unprofessional Presentation',
      description: 'Listing uses excessive capitalization, exclamation marks, or currency symbols typical of spam.',
      severity: 'low'
    });
    score -= 10;
  }

  score = Math.max(10, Math.min(100, score));

  let verdict = 'safe';
  if (score <= 40) {
    verdict = 'scam';
  } else if (score <= 75) {
    verdict = 'suspicious';
  }

  let summary = 'This listing appears legitimate. No immediate scam signals detected.';
  if (verdict === 'scam') {
    summary = brandImpersonated 
      ? 'Critical alert: Brand impersonation and phishing indicators detected.'
      : 'High-risk scam signals detected. We strongly advise against applying.';
  } else if (verdict === 'suspicious') {
    summary = 'Multiple suspicious elements detected. Proceed with caution and verify independently.';
  }

  return { score, verdict, summary, redFlags };
}

// --- API ROUTES ---

app.post('/api/login', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const { password, section } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await findOneUser({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (section && (section === 'internship' || section === 'placement')) {
      await updateUserSection(email, section);
    }

    res.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, mobile, section } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const existingUser = await findOneUser({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      mobile,
      role: 'student',
      section: section || 'internship'
    });

    res.json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post('/api/update-section', async (req, res) => {
  try {
    const email = (req.headers['x-user-email'] || '').trim().toLowerCase();
    const { section } = req.body;
    if (!email) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (!section || (section !== 'internship' && section !== 'placement')) {
      return res.status(400).json({ success: false, message: 'Valid section is required' });
    }
    
    const user = await findOneUser({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const updatedUser = await updateUserSection(email, section);
    res.json({ success: true, user: sanitizeUser(updatedUser) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const { url, companyName, description } = req.body;
    const reporterEmail = (req.headers['x-user-email'] || '').trim().toLowerCase();

    if (!description) {
      return res.status(400).json({ success: false, message: 'Description is required.' });
    }

    await createReport({
      url: url ? url.trim() : null,
      companyName: companyName ? companyName.trim() : null,
      description: description.trim(),
      reporterEmail: reporterEmail || 'Anonymous'
    });

    res.json({ success: true, message: 'Report submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { inputType, companyName, jobTitle, listingText, listingUrl, fileName, pdfBase64 } = req.body;
    
    let textToAnalyze = '';
    let isUrlSafe = false;
    let urlDomain = '';

    if (inputType === 'url' && listingUrl) {
      try {
        const parsedUrl = new URL(listingUrl.trim().startsWith('http') ? listingUrl.trim() : 'https://' + listingUrl.trim());
        urlDomain = parsedUrl.hostname.toLowerCase();
        
        const trustedDomains = [
          'google.com', 'google.co.in', 'microsoft.com', 'github.com', 
          'linkedin.com', 'indeed.com', 'internshala.com', 'apple.com',
          'amazon.com', 'amazon.in', 'meta.com', 'netflix.com'
        ];
        
        if (trustedDomains.some(d => urlDomain === d || urlDomain.endsWith('.' + d))) {
          isUrlSafe = true;
        }

        textToAnalyze = await scrapeListingUrl(listingUrl.trim());
      } catch (scrapeErr) {
        textToAnalyze = listingUrl;
      }
    } else if (inputType === 'text' && pdfBase64) {
      try {
        const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
        const pdfBuffer = Buffer.from(base64Data, 'base64');
        
        if (pdfBuffer.slice(0, 4).toString() === '%PDF') {
          const { PDFParse } = require('pdf-parse');
          const parser = new PDFParse(new Uint8Array(pdfBuffer));
          await parser.load();
          const result = await parser.getText();
          textToAnalyze = result?.text || '';
          await parser.destroy();
        } else {
          textToAnalyze = pdfBuffer.toString('utf-8');
        }
      } catch (pdfErr) {
        console.error('PDF extraction failed on server:', pdfErr);
        try {
          const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
          textToAnalyze = Buffer.from(base64Data, 'base64').toString('utf-8');
        } catch {
          textToAnalyze = listingText || '';
        }
      }
    } else {
      textToAnalyze = listingText || '';
    }

    let { score, verdict, summary, redFlags } = evaluateListing(textToAnalyze, companyName, jobTitle);

    // Search community reports
    let matches = [];
    const allReports = await findReports();
    if (listingUrl) {
      try {
        const scanDomain = new URL(listingUrl.trim().startsWith('http') ? listingUrl.trim() : 'https://' + listingUrl.trim()).hostname.toLowerCase();
        matches = allReports.filter(r => {
          if (!r.url) return false;
          try {
            const rDomain = new URL(r.url.trim().startsWith('http') ? r.url.trim() : 'https://' + r.url.trim()).hostname.toLowerCase();
            return rDomain === scanDomain && scanDomain !== '';
          } catch {
            return r.url.toLowerCase().includes(listingUrl.toLowerCase()) || listingUrl.toLowerCase().includes(r.url.toLowerCase());
          }
        });
      } catch (e) {
        matches = allReports.filter(r => r.url && r.url.toLowerCase().includes(listingUrl.trim().toLowerCase()));
      }
    }

    if (companyName) {
      const compReports = allReports.filter(r => r.companyName && r.companyName.trim().toLowerCase() === companyName.trim().toLowerCase());
      matches = [...matches, ...compReports];
    }

    // Deduplicate
    const uniqueMatches = Array.from(new Set(matches.map(m => (m._id || m.id).toString())))
      .map(id => matches.find(m => (m._id || m.id).toString() === id));
    const communityReportCount = uniqueMatches.length;

    if (communityReportCount > 0) {
      redFlags.push({
        type: 'Community Reports',
        description: `This listing matches ${communityReportCount} scam report(s) submitted by InplaSheild users.`,
        severity: 'high'
      });
      score -= Math.min(40, communityReportCount * 15);
      score = Math.max(10, score);
      if (score <= 40) {
        verdict = 'scam';
      } else if (score <= 75) {
        verdict = 'suspicious';
      }
      summary = `Caution: Checked against our community reporting database, this company/listing has ${communityReportCount} active threat report(s).`;
    }

    if (isUrlSafe && redFlags.length === 0) {
      score = 100;
      verdict = 'safe';
      summary = 'This listing appears legitimate. No immediate scam signals detected.';
    }

    const actionableSteps = [
      "Verify the company registration status on governmental/official portals.",
      "Check if recruitment emails originate from an official domain (e.g., @google.com) and not public services (e.g., @gmail.com).",
      "Search the company name along with terms like 'scam', 'reviews', or 'fake' online.",
      "Never share confidential banking details or transfer money for 'registration' or 'training'.",
      "Confirm details by contacting the company directly via their official website's contact form."
    ];

    const userEmail = (req.headers['x-user-email'] || '').trim().toLowerCase();
    await createActivity({
      type: inputType || (listingUrl ? 'url' : 'scan'),
      url: listingUrl || null,
      fileName: fileName || null,
      companyName: companyName || null,
      jobTitle: jobTitle || null,
      userEmail: userEmail || 'Anonymous',
      verdict,
      score
    });

    res.json({
      success: true,
      trustScore: score,
      verdict,
      summary,
      redFlags,
      actionableSteps,
      companyName: companyName || (isUrlSafe ? 'Google' : ''),
      jobTitle: jobTitle || '',
      communityReportCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during analysis.' });
  }
});

app.get('/api/student/stats', async (req, res) => {
  try {
    const email = (req.headers['x-user-email'] || '').trim().toLowerCase();
    if (!email) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const user = await findOneUser({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const myActivities = await findActivities({ userEmail: email });
    const allReports = await findReports();
    const myReports = allReports.filter((r) => r.reporterEmail === email);

    const totalScans = myActivities.length;
    const urlScans = myActivities.filter((a) => a.type === 'url').length;
    const fileScans = myActivities.filter((a) => a.type === 'scan' || a.type === 'text').length;
    
    const safeScans = myActivities.filter((a) => a.verdict === 'safe').length;
    const suspiciousScans = myActivities.filter((a) => a.verdict === 'suspicious').length;
    const scamScans = myActivities.filter((a) => a.verdict === 'scam').length;

    const recentScans = [...myActivities]
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 10)
      .map(a => ({
        id: a._id || a.id,
        date: a.date,
        time: a.time,
        type: a.type,
        url: a.url,
        fileName: a.fileName,
        verdict: a.verdict,
        score: a.score
      }));

    const recentReports = [...myReports]
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 10)
      .map(r => ({
        id: r._id || r.id,
        url: r.url,
        companyName: r.companyName,
        description: r.description,
        date: r.date,
        time: r.time
      }));

    res.json({
      success: true,
      stats: {
        totalScans,
        urlScans,
        fileScans,
        safeScans,
        suspiciousScans,
        scamScans,
        recentScans,
        recentReports
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/user-stats', async (req, res) => {
  try {
    const allActivities = await findActivities();
    const usageCount = allActivities.length;
    const pastedLinksDocs = [...allActivities].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 10);

    const pastedLinks = pastedLinksDocs.map((doc) => ({
      url: doc.url,
      fileName: doc.fileName,
      date: doc.date,
      time: doc.time,
      type: doc.type,
    }));

    res.json({
      success: true,
      stats: { usageCount, pastedLinks },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    if (!await requireAdmin(req, res)) return;

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const allUsers = useMongo ? await User.find() : readDB().users;
    const students = allUsers.filter((u) => u.role === 'student');
    const newThisWeek = allUsers.filter((u) => u.createdAt && new Date(u.createdAt) >= weekAgo).length;

    const internshipUsers = students.filter((u) => u.section === 'internship').length;
    const placementUsers = students.filter((u) => u.section === 'placement').length;

    const allActivities = await findActivities();
    const urlScans = allActivities.filter((a) => a.type === 'url').length;
    const fileScans = allActivities.filter((a) => a.type !== 'url').length;
    const totalScans = urlScans + fileScans;

    const scansByDay = {};
    allActivities.forEach((a) => {
      const day = a.date || 'Unknown';
      scansByDay[day] = (scansByDay[day] || 0) + 1;
    });
    const dailyScans = Object.entries(scansByDay)
      .map(([day, count]) => ({ day, count }))
      .slice(-7);

    const flaggedUrls = {};
    allActivities
      .filter((a) => a.url)
      .forEach((a) => {
        flaggedUrls[a.url] = (flaggedUrls[a.url] || 0) + 1;
      });
    const topUrls = Object.entries(flaggedUrls)
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const recentUsers = [...allUsers]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 20)
      .map(sanitizeUser);

    const allReports = await findReports();
    const recentReports = [...allReports]
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 10)
      .map(r => ({
        id: r._id || r.id,
        url: r.url,
        companyName: r.companyName,
        description: r.description,
        reporterEmail: r.reporterEmail,
        date: r.date,
        time: r.time
      }));

    const recentScans = [...allActivities]
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 10)
      .map((doc) => ({
        url: doc.url,
        fileName: doc.fileName,
        date: doc.date,
        time: doc.time,
        type: doc.type,
      }));

    res.json({
      success: true,
      stats: {
        totalUsers: allUsers.length,
        totalStudents: students.length,
        newThisWeek,
        internshipUsers,
        placementUsers,
        totalScans,
        urlScans,
        fileScans,
        dailyScans,
        topUrls,
        recentUsers,
        totalReports: allReports.length,
        recentReports,
        recentScans,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/alerts', async (req, res) => {
  try {
    if (!await requireAdmin(req, res)) return;

    const allActivities = await findActivities();
    const scamActivities = allActivities.filter(a => a.verdict === 'scam' || a.verdict === 'suspicious');

    const alerts = scamActivities
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .map(a => {
        const scamPercent = 100 - (a.score || 0);
        return {
          id: a._id || a.id,
          type: a.verdict === 'scam' ? 'danger' : 'warning',
          title: a.verdict === 'scam' ? 'Scam Detected' : 'Suspicious Listing Audit',
          message: `User (${a.userEmail || 'Anonymous'}) detected a ${a.verdict} from "${a.companyName || 'Unknown Company'}" (${a.jobTitle || 'Unspecified Role'}). Scam Match: ${scamPercent}%`,
          time: `${a.date || ''} ${a.time || ''}`,
          companyName: a.companyName,
          userEmail: a.userEmail,
          scamPercent
        };
      });

    res.json({ success: true, alerts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
seedAdminUser()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to seed admin user:', err);
    process.exit(1);
  });