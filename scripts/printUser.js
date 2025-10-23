// scripts/printUser.js
// Usage: node scripts/printUser.js user@example.com

const mongoose = require('mongoose');
const path = require('path');

// Load backend config and User model
require('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });
const db = require(path.resolve(__dirname, '../backend/config/db'));
const User = require(path.resolve(__dirname, '../backend/models/User'));

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/printUser.js <email>');
    process.exit(1);
  }

  try {
    await db();
    const user = await User.findOne({ email }).lean();
    if (!user) {
      console.log('User not found:', email);
    } else {
      // Hide sensitive fields but show password field so we can inspect hashing
      console.log('User record:');
      console.log({
        _id: user._id,
        email: user.email,
        name: user.name,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    mongoose.connection.close();
  }
}

main();
