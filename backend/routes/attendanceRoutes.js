const express = require('express');
const router = express.Router();
const {
  verifyAttendance,
  getSessionAttendance,
  getStudentAttendance
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Kiosk endpoint — deliberately no auth (student-facing device)
router.post('/verify', upload.single('capturedImage'), verifyAttendance);

router.get('/session/:sessionId', protect, getSessionAttendance);
router.get('/student/:studentId', protect, getStudentAttendance);

module.exports = router;