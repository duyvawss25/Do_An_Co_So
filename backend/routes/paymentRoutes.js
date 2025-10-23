const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// 🟩 Chỉ admin được cập nhật hoặc tính toán

// Lấy định mức tiền hiện tại — người dùng đã đăng nhập đều xem được
router.get("/settings/payment-rate", protect, paymentController.getPaymentRate);

// Cập nhật định mức tiền — chỉ admin
router.put("/settings/payment-rate", protect, isAdmin, paymentController.updatePaymentRate);

// 🧮 Tính tiền dạy cho một giảng viên trong một kỳ — chỉ admin
router.get("/calculate/:teacherId/:semesterId", protect, isAdmin, paymentController.calculateTeacherPayment);

// 🧮 Tính tiền dạy cho tất cả giảng viên trong một kỳ — chỉ admin
router.get("/calculate-semester/:semesterId", protect, isAdmin, paymentController.calculateSemesterPayments);

// 🧾 Báo cáo tiền dạy trong một năm — chỉ admin
router.get("/report/year/:year", protect, isAdmin, paymentController.reportYear);

// 🧾 Báo cáo tiền dạy của giáo viên trong một khoa — chỉ admin
router.get("/report/department/:departmentId", protect, isAdmin, paymentController.reportDepartment);

// 🧾 Báo cáo tiền dạy của toàn trường — chỉ admin
router.get("/report/school", protect, isAdmin, paymentController.reportSchool);

module.exports = router;
