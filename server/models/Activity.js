const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  url: { type: String }, // Optional, since some scans might not have a URL
  date: { type: String },
  time: { type: String },
  type: { type: String, enum: ['scan', 'url'], default: 'scan' }
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);
