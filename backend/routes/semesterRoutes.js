const express = require("express");
const router = express.Router();
const semesterController = require("../controllers/semesterController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// 🟩 Tạo kỳ học mới — chỉ admin
router.post("/", protect, isAdmin, semesterController.createSemester);

// 🟦 Lấy danh sách kỳ học — mọi người đăng nhập đều xem được
router.get("/", protect, semesterController.getSemesters);

// 🟦 Lấy thông tin 1 kỳ học — mọi người đăng nhập đều xem được
router.get("/:id", protect, semesterController.getSemesterById);

// 🟥 Cập nhật kỳ học — chỉ admin
router.put("/:id", protect, isAdmin, semesterController.updateSemester);

// 🟥 Xóa kỳ học — chỉ admin
router.delete("/:id", protect, isAdmin, semesterController.deleteSemester);

module.exports = router;
