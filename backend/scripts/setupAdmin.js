import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createFreshAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform');
        console.log('🔧 Creating fresh admin account...\n');

        // Delete old admin if exists
        await User.deleteOne({ email: 'admin@bughunter.com' });
        console.log('✅ Cleaned up old admin account\n');

        // Create completely new admin
        const admin = new User({
            name: 'Admin',
            email: 'admin@test.com',
            password: '123456',  // Simple password
            role: 'admin',
            xp: 1000,
            level: 10,
            assessmentTaken: true
        });

        await admin.save();
        console.log('✅ New admin created!\n');

        // Verify it works
        const testAdmin = await User.findOne({ email: 'admin@test.com' });
        const passwordWorks = await testAdmin.comparePassword('123456');

        console.log('🧪 Testing login...');
        console.log('   Email: admin@test.com');
        console.log('   Password: 123456');
        console.log('   Test result:', passwordWorks ? '✅ WORKS!' : '❌ FAILED!');

        if (passwordWorks) {
            console.log('\n🎯 USE THESE CREDENTIALS:');
            console.log('   📧 Email: admin@test.com');
            console.log('   🔑 Password: 123456');
            console.log('\n✅ This is a FRESH account that should work!');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createFreshAdmin();
