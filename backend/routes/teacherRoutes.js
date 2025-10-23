const express = require("express");
const teacherController = require("../controllers/teacherController");
const { protect, isAdmin } = require("../middleware/authMiddleware"); // ✅ đổi adminOnly → isAdmin
const router = express.Router();

// 🟢 Lấy danh sách giáo viên (ai cũng xem được)
router.get("/", teacherController.getTeachers);

// 🟢 Lấy giáo viên theo ID
router.get("/:id", teacherController.getTeacherById);

// 🟡 Chỉ admin mới được tạo, cập nhật, xóa giáo viên
router.post("/", protect, isAdmin, teacherController.createTeacher);
router.put("/:id", protect, isAdmin, teacherController.updateTeacher);
router.delete("/:id", protect, isAdmin, teacherController.deleteTeacher);

module.exports = router;
