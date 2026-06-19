const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  role: { type: String, default: 'student' },
  section: { type: String, default: 'internship' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
