const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const exists = await Admin.findOne({ email: 'admin@project.com' });
    if (exists) {
      console.log('Admin already exists. Exiting.');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('david797799', 10);

const admin = await Admin.create({
  name: 'Super Admin',
  email: 'admin@project.com',
  password: hashedPassword,
  role: 'admin'
});

    console.log('Admin created:', admin.email);
    process.exit();
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();