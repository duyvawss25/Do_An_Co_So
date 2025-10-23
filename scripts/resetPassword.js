// scripts/resetPassword.js
// Usage: node scripts/resetPassword.js user@example.com newPassword

const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load backend config and User model
require('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });
const db = require(path.resolve(__dirname, '../backend/config/db'));
const User = require(path.resolve(__dirname, '../backend/models/User'));

async function main() {
  const email = process.argv[2];
  const newPassword = process.argv[3];
  if (!email || !newPassword) {
    console.error('Usage: node scripts/resetPassword.js <email> <newPassword>');
    process.exit(1);
  }

  try {
    await db();
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      process.exit(1);
    }

    // Set new plaintext password; model pre-save hook will hash it on save
    user.password = newPassword;
    await user.save();

    console.log('Password reset successfully for', email);
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    mongoose.connection.close();
  }
}

main();
