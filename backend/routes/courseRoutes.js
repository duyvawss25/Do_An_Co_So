const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// ✅ Tạo học phần mới — chỉ admin
router.post("/", protect, isAdmin, courseController.createCourse);

// ✅ Lấy danh sách học phần — người dùng đã đăng nhập
router.get("/", protect, courseController.getCourses);

// ✅ Lấy học phần theo ID — người dùng đã đăng nhập
router.get("/:id", protect, courseController.getCourseById);

// ✅ Cập nhật học phần — chỉ admin
router.put("/:id", protect, isAdmin, courseController.updateCourse);

// ✅ Xóa học phần — chỉ admin
router.delete("/:id", protect, isAdmin, courseController.deleteCourse);

module.exports = router;
