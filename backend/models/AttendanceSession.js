const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  courseTitle: { type: String },
  lecturer: { type: String, required: true },
  level: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
});

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);