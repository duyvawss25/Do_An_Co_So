require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const deleteAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    
    const result = await User.deleteMany({});
    console.log(`✅ Đã xóa ${result.deletedCount} users`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

deleteAll();