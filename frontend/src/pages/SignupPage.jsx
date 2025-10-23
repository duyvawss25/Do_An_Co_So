import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // 🟩 Kiểm tra dữ liệu nhập
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ tên!";
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email!";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ!";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu!";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự!";
    }

    if (!formData.confirm.trim()) {
      newErrors.confirm = "Vui lòng xác nhận mật khẩu!";
    } else if (formData.password !== formData.confirm) {
      newErrors.confirm = "Mật khẩu không trùng khớp!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🟩 Xử lý đăng ký
  const onFinish = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setServerError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 201 || res.status === 200) {
        alert("🎉 Đăng ký thành công!");
        navigate("/login");
      }
    } catch (error) {
      console.error("❌ Lỗi đăng ký:", error);
      const message =
        error.response?.data?.message ||
        "Lỗi máy chủ! Vui lòng thử lại sau.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  // 🟩 Xử lý khi nhập
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") onFinish();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-6xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Form */}
          <div className="md:w-5/12 p-12 relative z-10">
            {/* Logo Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/50">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                OFFICIAL
              </h2>
              <p className="text-gray-400 text-sm">Tạo tài khoản mới</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Full Name Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="FULL NAME"
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-800 border ${
                      errors.name ? 'border-red-500' : 'border-slate-700'
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="EMAIL"
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-800 border ${
                      errors.email ? 'border-red-500' : 'border-slate-700'
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="PASSWORD"
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-800 border ${
                      errors.password ? 'border-red-500' : 'border-slate-700'
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="confirm"
                    value={formData.confirm}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="CONFIRM PASSWORD"
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-800 border ${
                      errors.confirm ? 'border-red-500' : 'border-slate-700'
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                {errors.confirm && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.confirm}</p>
                )}
              </div>

              {/* Register Button */}
              <button
                onClick={onFinish}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "REGISTER"
                )}
              </button>

              {/* Terms */}
              <p className="text-xs text-gray-400 text-center mt-3">
                Bằng việc đăng ký, bạn đồng ý với{" "}
                <a href="#" className="text-cyan-400 hover:text-cyan-300">Điều khoản dịch vụ</a>
                {" "}và{" "}
                <a href="#" className="text-cyan-400 hover:text-cyan-300">Chính sách bảo mật</a>
              </p>
            </div>
          </div>

          {/* Right Side - Welcome Section */}
          <div className="md:w-7/12 p-12 flex items-center justify-center relative overflow-hidden">
            {/* Animated Background Circles */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-purple-400 rounded-full opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-4 border-blue-400 rounded-full opacity-20"></div>
            </div>

            {/* Welcome Text */}
            <div className="relative z-10 text-center">
              <h1 className="text-7xl font-bold text-white mb-6">
                Join Us.
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md mx-auto mb-8">
                Tạo tài khoản để trải nghiệm những tính năng tuyệt vời và kết nối với cộng đồng của chúng tôi.
              </p>
              <div className="text-gray-400">
                <span>Đã có tài khoản? </span>
                <a href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Đăng nhập ngay
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Top Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg"></div>
            <span className="text-white font-bold text-lg">TEMPLATE DESIGN</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-gray-300 text-sm">
            <a href="#" className="hover:text-white transition-colors">ABOUT</a>
            <a href="#" className="hover:text-white transition-colors">DOWNLOAD</a>
            <a href="#" className="hover:text-white transition-colors">PRICING</a>
            <a href="#" className="hover:text-white transition-colors">FEATURES</a>
            <a href="#" className="hover:text-white transition-colors">CONTACT</a>
            <a href="/login">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full transition-colors">
                SIGN IN
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;