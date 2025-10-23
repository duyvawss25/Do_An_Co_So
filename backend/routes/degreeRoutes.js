const express = require("express");
const router = express.Router();
const degreeController = require("../controllers/degreeController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// ✅ Tạo bằng cấp mới — chỉ admin
router.post("/", protect, isAdmin, degreeController.createDegree);

// ✅ Lấy danh sách bằng cấp — người dùng đã đăng nhập
router.get("/", protect, degreeController.getDegrees);

// ✅ Lấy bằng cấp theo ID — người dùng đã đăng nhập
router.get("/:id", protect, degreeController.getDegreeById);

// ✅ Cập nhật bằng cấp — chỉ admin
router.put("/:id", protect, isAdmin, degreeController.updateDegree);

// ✅ Xóa bằng cấp — chỉ admin
router.delete("/:id", protect, isAdmin, degreeController.deleteDegree);

module.exports = router;
