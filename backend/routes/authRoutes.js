const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/login', loginAdmin);
router.post('/register', protect, isAdmin, registerAdmin);

module.exports = router; 