const AttendanceRecord = require('../models/AttendanceRecord');
const AttendanceSession = require('../models/AttendanceSession');
const IrisEnrollment = require('../models/IrisEnrollment');
const cloudinary = require('../config/cloudinary');
const { compareImages } = require('../utils/imageMatcher');

const MATCH_THRESHOLD = 75; // similarity % required to count as a match — tune this after testing

// Downloads an image from a URL and returns it as a Buffer
const fetchImageBuffer = async (url) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

// POST /api/attendance/verify  (kiosk endpoint — no auth, student-facing)
const verifyAttendance = async (req, res) => {
  try {
    const { studentId, sessionId } = req.body;

    if (!req.file) return res.status(400).json({ message: 'No image captured' });

    const session = await AttendanceSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.status !== 'open') {
      return res.status(400).json({ message: 'This session is closed' });
    }

    const existing = await AttendanceRecord.findOne({ student: studentId, session: sessionId });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already recorded for this session' });
    }

    const enrollment = await IrisEnrollment.findOne({ student: studentId, status: 'active' });
    if (!enrollment) {
      return res.status(400).json({ message: 'No active iris enrollment found for this student' });
    }

    // Upload the captured verification image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'iris-verifications', resource_type: 'image' },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    // Real comparison: fetch the stored enrollment image, compare against the captured one
    const enrollmentImageBuffer = await fetchImageBuffer(enrollment.imageUrl);
    const similarity = await compareImages(enrollmentImageBuffer, req.file.buffer);

    const isMatch = similarity >= MATCH_THRESHOLD;

    const record = await AttendanceRecord.create({
      student: studentId,
      session: sessionId,
      capturedImageUrl: uploadResult.secure_url,
      matchedEnrollment: enrollment._id,
      matchStatus: isMatch ? 'matched' : 'no_match',
      matchConfidence: similarity
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/attendance/session/:sessionId
const getSessionAttendance = async (req, res) => {
  try {
    const records = await AttendanceRecord.find({ session: req.params.sessionId })
      .populate('student', 'fullName matricNumber')
      .sort({ timestamp: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/attendance/student/:studentId
const getStudentAttendance = async (req, res) => {
  try {
    const records = await AttendanceRecord.find({ student: req.params.studentId })
      .populate('session', 'courseCode startTime')
      .sort({ timestamp: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { verifyAttendance, getSessionAttendance, getStudentAttendance };