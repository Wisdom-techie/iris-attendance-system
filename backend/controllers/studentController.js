const Student = require('../models/Student');

// POST /api/students  (admin only)
const createStudent = async (req, res) => {
  try {
    const { fullName, matricNumber, department, level, email } = req.body;

    const exists = await Student.findOne({ $or: [{ matricNumber }, { email }] });
    if (exists) {
      return res.status(400).json({ message: 'Student with this matric number or email already exists' });
    }

    const student = await Student.create({ fullName, matricNumber, department, level, email });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/students  (admin, lecturer)
const getStudents = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { matricNumber: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/students/:id  (admin, lecturer)
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/students/:id  (admin only)
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/students/:id  (admin only)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createStudent, getStudents, getStudentById, updateStudent, deleteStudent };