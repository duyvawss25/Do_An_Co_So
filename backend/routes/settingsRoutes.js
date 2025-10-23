const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// 🟦 Lấy cài đặt hiện tại (người dùng đăng nhập xem)
router.get("/", protect, settingsController.getSettings);

// 🟥 Cập nhật cài đặt (chỉ admin)
router.put("/", protect, isAdmin, settingsController.updateSettings);

// 🟥 Cập nhật hệ số cho tất cả lớp học phần (chỉ admin)
router.post("/update-coefficients", protect, isAdmin, settingsController.updateAllCoefficients);

// 🟦 Các route tương thích cũ (nếu cần)
router.get("/payment-rate", protect, settingsController.getPaymentRate);
router.put("/payment-rate", protect, isAdmin, settingsController.updatePaymentRate);

module.exports = router;
