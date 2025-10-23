const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// ✅ Tạo khoa mới — chỉ admin
router.post("/", protect, isAdmin, departmentController.createDepartment);

// ✅ Lấy danh sách khoa — người dùng đã đăng nhập
router.get("/", protect, departmentController.getDepartments);

// ✅ Lấy khoa theo ID — người dùng đã đăng nhập
router.get("/:id", protect, departmentController.getDepartmentById);

// ✅ Cập nhật khoa — chỉ admin
router.put("/:id", protect, isAdmin, departmentController.updateDepartment);

// ✅ Xóa khoa — chỉ admin
router.delete("/:id", protect, isAdmin, departmentController.deleteDepartment);

module.exports = router;
