/**
 * Seed Script — Creates the default admin user in MongoDB Atlas.
 * 
 * Usage: node src/scripts/seedAdmin.js
 * 
 * Only run this ONCE after setting up your Atlas database.
 * If the admin already exists, it will skip creation.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UserModel } from '../models/userModel.js';
import { hashPassword } from '../utils/hash.js';

dotenv.config();

const ADMIN_DATA = {
  email: 'ali.raza@shopmanager.com',
  name: 'Ali Raza',
  urduName: 'علی رضا',
  phone: '+92 300 1234567',
  role: 'OWNER / ADMIN',
  image: '',
  password: hashPassword('password123')
};

const seedAdmin = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ MONGO_URI is not defined in .env');
    process.exit(1);
  }

  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    // Check if admin already exists
    const existing = await UserModel.findOne({ email: ADMIN_DATA.email });
    if (existing) {
      console.log('ℹ️  Admin user already exists — skipping seed.');
    } else {
      const admin = new UserModel(ADMIN_DATA);
      await admin.save();
      console.log('✅ Default admin user created successfully!');
      console.log(`   Email: ${ADMIN_DATA.email}`);
      console.log(`   Password: password123`);
      console.log(`   Role: ${ADMIN_DATA.role}`);
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
