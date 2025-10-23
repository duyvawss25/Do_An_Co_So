const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, isAdmin } = require("../middleware/authMiddleware"); // ✅ đổi adminOnly → isAdmin

/**
 * @route   GET /api/users/me
 * @desc    Lấy thông tin người dùng hiện tại
 * @access  Private (chỉ người đã đăng nhập)
 */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

/**
 * @route   PUT /api/users/me
 * @desc    Cập nhật thông tin cá nhân
 * @access  Private (chỉ người dùng đăng nhập)
 */
router.put("/me", protect, async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật thông tin:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin người dùng" });
  }
});

/**
 * @route   GET /api/users
 * @desc    Lấy danh sách tất cả người dùng
 * @access  Private/Admin
 */
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Xóa người dùng (chỉ admin)
 * @access  Private/Admin
 */
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng để xóa" });
    }
    res.status(200).json({ message: "Đã xóa người dùng thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi xóa người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

module.exports = router;
