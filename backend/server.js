require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import các routes hiện có
const teacherRoutes = require("./routes/teacherRoutes");
const degreeRoutes = require("./routes/degreeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const semesterRoutes = require("./routes/semesterRoutes");
const courseClassRoutes = require("./routes/courseClassRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

// 📌 Thêm mới 2 route auth và user
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Kết nối MongoDB
connectDB();

// Route test
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Gắn các route vào app
app.use("/api/teachers", teacherRoutes);
app.use("/api/degrees", degreeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/course-classes", courseClassRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/settings", settingsRoutes);

// 📌 Gắn thêm các route mới
app.use("/api/auth", authRoutes); // Đăng ký / đăng nhập
app.use("/api/users", userRoutes); // Lấy / cập nhật thông tin người dùng

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
