const AttendanceSession = require('../models/AttendanceSession');

// POST /api/sessions  (admin, lecturer)
const createSession = async (req, res) => {
  try {
    const { courseCode, courseTitle, lecturer, level, startTime, endTime } = req.body;

    const session = await AttendanceSession.create({
      courseCode,
      courseTitle,
      lecturer,
      level,
      startTime,
      endTime,
      createdBy: req.admin._id
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/sessions  (admin, lecturer)
const getSessions = async (req, res) => {
  try {
    const sessions = await AttendanceSession.find().sort({ startTime: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/sessions/:id
const getSessionById = async (req, res) => {
  try {
    const session = await AttendanceSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/sessions/:id/close
const closeSession = async (req, res) => {
  try {
    const session = await AttendanceSession.findByIdAndUpdate(
      req.params.id,
      { status: 'closed' },
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createSession, getSessions, getSessionById, closeSession };