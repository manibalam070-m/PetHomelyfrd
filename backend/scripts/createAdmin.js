import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } = process.env;

if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before running this command.');
  process.exit(1);
}

try {
  await mongoose.connect(MONGO_URI);
  let admin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() }).select('+password');

  if (!admin) {
    admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
  } else {
    admin.name = ADMIN_NAME;
    admin.password = ADMIN_PASSWORD;
    admin.role = 'admin';
    await admin.save();
  }

  console.log(`Admin ready: ${admin.email}`);
} catch (error) {
  console.error(`Unable to create admin: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
