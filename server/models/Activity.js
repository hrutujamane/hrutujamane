const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  url: { type: String }, // Optional, since some scans might not have a URL
  fileName: { type: String },
  companyName: { type: String }, // Target company name scanned
  jobTitle: { type: String },    // Target job position scanned
  date: { type: String },
  time: { type: String },
  type: { type: String, default: 'scan' },
  userEmail: { type: String, default: 'Anonymous' },
  verdict: { type: String },
  score: { type: Number },
  timestamp: { type: Number, default: () => Date.now() }
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);
