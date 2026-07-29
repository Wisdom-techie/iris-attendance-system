const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await Admin.deleteOne({ email: 'admin@example.com' });
  console.log('Deleted:', result.deletedCount);
  process.exit();
};

run();