const express = require('express');
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/', protect, isAdmin, createStudent);
router.get('/', protect, getStudents);           // admin + lecturer (any logged-in admin/lecturer)
router.get('/:id', protect, getStudentById);
router.put('/:id', protect, isAdmin, updateStudent);
router.delete('/:id', protect, isAdmin, deleteStudent);

module.exports = router;