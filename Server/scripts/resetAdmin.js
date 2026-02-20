const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/database');

// Load env vars
dotenv.config({ path: '../.env' }); // Adjust path to .env since script in scripts/

const resetAdminPassword = async () => {
    try {
        // Connect to database
        // Note: connectDB uses process.env.MONGO_URI, so we need to ensure dotenv loaded correctly
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not defined in .env');
            // Fallback to default if not found, just in case
            process.env.MONGO_URI = 'mongodb://localhost:27017/order_tracking';
        }

        await connectDB();

        const email = 'admin.verify@test.com';
        const newPassword = 'admin123';

        let user = await User.findOne({ email });

        if (!user) {
            console.log(`User ${email} not found. Creating new admin user...`);
            user = await User.create({
                name: 'Admin Verify',
                email,
                password: newPassword,
                role: 'admin'
            });
            console.log(`Admin user created successfully.`);
        } else {
            console.log(`User ${email} found. Resetting password...`);
            user.password = newPassword;
            await user.save();
            console.log(`Password reset successfully.`);
        }

        console.log(`\nCredentials for login:`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${newPassword}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

resetAdminPassword();
