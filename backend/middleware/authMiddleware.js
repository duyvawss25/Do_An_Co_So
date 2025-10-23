const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * 🟩 Middleware: Xác thực token người dùng
 */
exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Kiểm tra token có tồn tại và hợp lệ định dạng Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không có token xác thực" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");

    // Tìm người dùng tương ứng
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    next(); // Cho phép đi tiếp
  } catch (err) {
    console.error("❌ Token error:", err);
    return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

/**
 * 🟥 Middleware: Chỉ admin mới được truy cập
 */
exports.isAdmin = (req, res, next) => {
  console.log("Current user:", req.user);
  if (req.user && req.user.role === "admin") {
    return next(); // ✅ Cho phép admin đi tiếp
  }
  return res.status(403).json({ message: "Chỉ admin mới có quyền truy cập" });
};
