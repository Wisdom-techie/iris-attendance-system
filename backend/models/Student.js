const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  matricNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  level: { type: String, required: true }, // e.g. "400L"
  email: { type: String, required: true, unique: true },
  irisEnrolled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);