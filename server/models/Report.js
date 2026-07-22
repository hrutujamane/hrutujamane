const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  url: { type: String, trim: true },
  companyName: { type: String, trim: true },
  description: { type: String, required: true },
  reporterEmail: { type: String, default: 'Anonymous' },
  timestamp: { type: Number, default: () => Date.now() },
  date: { type: String, default: () => new Date().toLocaleDateString() },
  time: { type: String, default: () => new Date().toLocaleTimeString() }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
