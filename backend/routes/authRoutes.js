const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getAllUsers, deleteUser } = require("../controllers/authController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// 🟩 Đăng ký (user thường)
router.post("/register", registerUser);

// 🟩 Đăng nhập
router.post("/login", loginUser);

// 🟥 Chỉ admin được xem danh sách user
router.get("/users", protect, isAdmin, getAllUsers);

// 🟥 Chỉ admin được xóa user
router.delete("/users/:id", protect, isAdmin, deleteUser);

module.exports = router;
