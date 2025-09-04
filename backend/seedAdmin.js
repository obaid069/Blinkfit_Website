import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blinkfit', {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: 'admin@blinkfit.com',
      role: 'admin' 
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user with specified credentials
    const admin = new User({
      name: 'BlinkFit Admin',
      email: 'admin@blinkfit.com',
      password: 'adminwow@979',
      role: 'admin',
      emailVerified: true,
      isActive: true,
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@blinkfit.com');
    console.log('🔑 Password: adminwow@979');
    console.log('🌐 Login URL: http://localhost:5173/admin/login');
    console.log('⚠️  Please keep these credentials secure!');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
    if (error.code === 11000) {
      console.log('🔄 Admin user with this email already exists');
    }
  } finally {
    mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

seedAdmin();
