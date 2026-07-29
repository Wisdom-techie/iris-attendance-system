const IrisEnrollment = require('../models/IrisEnrollment');
const Student = require('../models/Student');
const cloudinary = require('../config/cloudinary');

// POST /api/enrollment/:studentId  (admin only)
const enrollStudentIris = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    // Mark any existing active enrollment as superseded
    await IrisEnrollment.updateMany(
      { student: studentId, status: 'active' },
      { status: 'superseded' }
    );

    // Upload buffer to Cloudinary via upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'iris-enrollments', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const enrollment = await IrisEnrollment.create({
      student: studentId,
      imageUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      status: 'active'
    });

    student.irisEnrolled = true;
    await student.save();

    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/enrollment/:studentId  (admin, lecturer)
const getEnrollmentHistory = async (req, res) => {
  try {
    const enrollments = await IrisEnrollment.find({ student: req.params.studentId }).sort({ enrolledAt: -1 });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { enrollStudentIris, getEnrollmentHistory };