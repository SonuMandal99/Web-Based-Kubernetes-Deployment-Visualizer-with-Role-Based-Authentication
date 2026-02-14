#!/usr/bin/env node

/**
 * Database Initialization Script
 * 
 * This script sets up the MongoDB database with initial data
 * Usage: node scripts/init-db.js
 */

import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...\n');

    // Connect to MongoDB
    await connectDB();

    // Check if admin user already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });

    if (adminExists) {
      console.log('✓ Admin user already exists');
    } else {
      // Create default admin user
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'Admin',
        isActive: true,
      });

      await adminUser.save();
      console.log('✓ Admin user created');
      console.log('  Email: admin@example.com');
      console.log('  Password: admin123');
      console.log('  Role: Admin');
      console.log('  ⚠️  Change password immediately in production!');
    }

    // Create demo viewer user
    const viewerExists = await User.findOne({ email: 'viewer@example.com' });

    if (viewerExists) {
      console.log('✓ Viewer user already exists');
    } else {
      const viewerUser = new User({
        name: 'Viewer User',
        email: 'viewer@example.com',
        password: 'viewer123',
        role: 'Viewer',
        isActive: true,
      });

      await viewerUser.save();
      console.log('✓ Viewer user created');
      console.log('  Email: viewer@example.com');
      console.log('  Password: viewer123');
      console.log('  Role: Viewer');
    }

    console.log('\n✓ Database initialization completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Database initialization failed:', error.message);
    process.exit(1);
  }
};

initializeDatabase();
