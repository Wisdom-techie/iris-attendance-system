const express = require('express');
const router = express.Router();
const { enrollStudentIris, getEnrollmentHistory } = require('../controllers/enrollmentController');
const { protect, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/:studentId', protect, isAdmin, upload.single('irisImage'), enrollStudentIris);
router.get('/:studentId', protect, getEnrollmentHistory);

module.exports = router;