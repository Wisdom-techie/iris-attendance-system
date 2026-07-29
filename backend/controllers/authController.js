const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register  (admin only — protect + isAdmin applied in route)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashedPassword, role });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/auth/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { registerAdmin, loginAdmin };