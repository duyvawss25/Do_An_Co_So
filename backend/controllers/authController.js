const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🟩 Đăng ký người dùng mới
exports.registerUser = async (req, res) => {
  try {
    console.log("📥 Register request:", req.body);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // 🟦 Gán role (mặc định là 'user', trừ khi bạn muốn tạo admin)
    const newUser = new User({
      name,
      email,
      password,
      role: role && role === "admin" ? "admin" : "user"
    });

    await newUser.save();
    console.log("✅ User created:", newUser.email);

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Đăng ký thành công!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi đăng ký:", error);
    return res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
};

// 🟩 Đăng nhập người dùng
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi đăng nhập:", error);
    return res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách users:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 🟩 Xóa người dùng theo ID (chỉ admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    await user.remove();
    res.json({ message: "Xóa user thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi xóa user:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};