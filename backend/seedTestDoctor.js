import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedTestDoctor = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blinkfit', {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });

    console.log('Connected to MongoDB');

    // Check if test doctor already exists
    const existingDoctor = await User.findOne({ email: 'doctor@test.com' });
    if (existingDoctor) {
      console.log('Test doctor already exists:', existingDoctor.email);
      process.exit(0);
    }

    // Create test doctor user (verified by default for testing)
    const testDoctor = new User({
      name: 'Dr. John Smith',
      email: 'doctor@test.com',
      password: 'doctor123', // This will be hashed automatically
      role: 'doctor',
      emailVerified: true, // Pre-verified for testing
      isActive: true,
      profile: {
        specialization: 'Ophthalmology',
        licenseNumber: 'MD-123456',
        experience: 8,
        hospital: 'City Eye Care Center',
        isVerifiedDoctor: true,
      },
    });

    await testDoctor.save();
    console.log('✅ Test doctor created successfully!');
    console.log('Email: doctor@test.com');
    console.log('Password: doctor123');
    console.log('Note: This doctor is pre-verified for testing purposes');

  } catch (error) {
    console.error('Error creating test doctor:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedTestDoctor();
