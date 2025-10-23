import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosClient from "../api/axiosClient";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // 🟩 Validate dữ liệu trước khi gửi
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email!";
    if (!formData.password.trim()) newErrors.password = "Vui lòng nhập mật khẩu!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🟩 Hàm xử lý đăng nhập (đổi tên thành onFinish)
  const onFinish = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setServerError("");

    try {
      // Use shared axios client which already sets Content-Type and baseURL
      const payload = { email: formData.email.trim(), password: formData.password };
      // Debug: show exactly what we're sending to the server
      console.log("[Login] Sending payload:", payload);
      const res = await axiosClient.post("/auth/login", payload);
      // 🟢 Lưu token và thông tin user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Đăng nhập thành công!");
      navigate("/profile");
    } catch (error) {
      // 🟥 Hiển thị lỗi từ server hoặc lỗi mạng
      if (error.response) {
        // show message and log details for debugging
        const msg = error.response.data?.message || error.response.statusText || "Đăng nhập thất bại!";
        setServerError(msg);
        console.error("Login error response:", error.response.data);
      } else {
        setServerError("Không thể kết nối đến máy chủ!");
        console.error("Network error", error);
      }
    } finally {
      setLoading(false);
    }
  };

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
            <div className="mb-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-8 shadow-lg shadow-cyan-500/50">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                OFFICIAL
              </h2>
              <p className="text-gray-400 text-sm">Đăng nhập để tiếp tục</p>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Username Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="USERNAME"
                    className={`w-full pl-12 pr-4 py-4 bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-700'
                      } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">{errors.email}</p>
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
                    className={`w-full pl-12 pr-4 py-4 bg-slate-800 border ${errors.password ? 'border-red-500' : 'border-slate-700'
                      } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Login Button */}
              <button
                onClick={onFinish}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
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
                  "LOGIN"
                )}
              </button>

              {/* Server error */}
              {serverError && (
                <p className="mt-4 text-sm text-red-400">{serverError}</p>
              )}

              {/* Links */}
              <div className="flex items-center justify-between mt-6 text-sm">
                <label className="flex items-center cursor-pointer text-gray-400 hover:text-white transition-colors">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Welcome Section */}
          <div className="md:w-7/12 p-12 flex items-center justify-center relative overflow-hidden">
            {/* Animated Background Circles */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-purple-400 rounded-full opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-4 border-blue-400 rounded-full opacity-20"></div>
            </div>

            {/* Welcome Text */}
            <div className="relative z-10 text-center">
              <h1 className="text-7xl font-bold text-white mb-6">
                Welcome.
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md mx-auto mb-8">
                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore.
              </p>
              <div className="text-gray-400">
                <span>Not a member? </span>
                <a href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Sign up now
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
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full transition-colors">
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;