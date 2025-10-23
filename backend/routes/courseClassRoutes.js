const express = require("express");
const router = express.Router();
const courseClassController = require("../controllers/courseClassController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// 📊 Các route thống kê — tất cả người dùng đã đăng nhập
router.get("/stats/semester/:semesterId", protect, courseClassController.getStatsBySemester);
router.get("/stats/course/:courseId", protect, courseClassController.getStatsByCourse);
router.get("/stats/semester/:semesterId/course/:courseId", protect, courseClassController.getStatsBySemesterAndCourse);
router.get("/stats/year/:year", protect, courseClassController.getStatsByYear);

// ✅ Tạo lớp học phần mới — chỉ admin
router.post("/", protect, isAdmin, courseClassController.createCourseClass);

// ✅ Lấy danh sách lớp học phần — tất cả người dùng đã đăng nhập
router.get("/", protect, courseClassController.getCourseClasses);

// ✅ Lấy lớp học phần theo ID — tất cả người dùng đã đăng nhập
router.get("/:id", protect, courseClassController.getCourseClassById);

// ✅ Cập nhật lớp học phần — chỉ admin
router.put("/:id", protect, isAdmin, courseClassController.updateCourseClass);

// ✅ Xóa lớp học phần — chỉ admin
router.delete("/:id", protect, isAdmin, courseClassController.deleteCourseClass);

module.exports = router;
