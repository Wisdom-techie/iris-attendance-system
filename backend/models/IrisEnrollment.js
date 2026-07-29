const mongoose = require('mongoose');

const irisEnrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  imageUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true },
  status: { type: String, enum: ['active', 'superseded'], default: 'active' },
  enrolledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IrisEnrollment', irisEnrollmentSchema);