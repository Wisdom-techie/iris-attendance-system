const express = require('express');
const router = express.Router();
const { createSession, getSessions, getSessionById, closeSession } = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createSession);
router.get('/', protect, getSessions);
router.get('/:id', protect, getSessionById);
router.put('/:id/close', protect, closeSession);

module.exports = router;