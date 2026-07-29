const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession', required: true },
  capturedImageUrl: { type: String, required: true },
  matchedEnrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'IrisEnrollment' },
  matchStatus: { type: String, enum: ['matched', 'no_match', 'pending'], default: 'pending' },
  matchConfidence: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

attendanceRecordSchema.index({ student: 1, session: 1 }, { unique: true });

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);