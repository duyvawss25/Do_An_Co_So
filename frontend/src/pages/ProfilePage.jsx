import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { User, Mail, Phone, Save, LogOut, Loader2, ArrowLeft, CheckCircle2, Shield } from "lucide-react";
import { Toaster, toast } from "sonner";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy thông tin user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axiosClient.get("/users/me")
      .then(res => {
        setUser(res.data);
        toast.success("Đã tải thông tin cá nhân");
      })
      .catch(() => {
        toast.error("Không thể lấy thông tin. Vui lòng đăng nhập lại.");
        navigate("/login");
      });
  }, [navigate]);

  const handleSave = () => {
    if (!user.name || !user.email) {
      toast.error("Vui lòng điền đầy đủ họ tên và email");
      return;
    }

    setIsLoading(true);
    axiosClient.put("/users/me", user)
      .then(() => {
        toast.success("Cập nhật thành công!");
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Lưu thất bại! Vui lòng thử lại.");
        setIsLoading(false);
      });
  };

  const handleChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Đã đăng xuất");
    navigate("/login");
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-slate-900/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-10 max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 bg-white/70 backdrop-blur-lg border border-white/50 text-slate-700 hover:bg-white/80 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <div className="bg-white/70 backdrop-blur-lg px-6 py-3 rounded-2xl border border-white/50 shadow-lg">
            <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-500" />
              Thông tin cá nhân
            </h1>
          </div>
        </div>

        {/* Main Section */}
        <div className="grid md:grid-cols-[2fr_1fr] gap-6">
          {/* Profile Form */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-xl space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800">
              <Shield className="w-6 h-6 text-emerald-500" />
              Cập nhật thông tin
            </h2>
            <p className="text-slate-600">Quản lý thông tin tài khoản của bạn</p>

            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700">
                <User className="w-4 h-4 text-blue-500" />
                Họ và tên
              </label>
              <input
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                className="w-full h-12 px-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-purple-500" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full h-12 px-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-pink-500" />
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                placeholder="0123 456 789"
                className="w-full h-12 px-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/30"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Lưu thay đổi
                  </>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 h-12 px-6 bg-white/80 border border-red-200 text-red-600 rounded-xl hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 inline-block mr-2" />
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Avatar */}
            <div className="bg-gradient-to-br from-blue-100/70 to-cyan-100/70 backdrop-blur-lg rounded-2xl border border-blue-200/50 shadow-lg text-center p-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-xl">
                <User className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">{user.name || "Người dùng"}</h3>
              <p className="text-slate-600 text-sm">{user.email || "email@example.com"}</p>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-purple-100/70 to-pink-100/70 backdrop-blur-lg rounded-2xl border border-purple-200/50 shadow-lg p-6 space-y-4">
              <div className="flex justify-between border-b border-purple-200/50 pb-3">
                <span className="text-slate-700 text-sm">Trạng thái</span>
                <span className="text-emerald-700 px-3 py-1 bg-emerald-100 rounded-full text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã xác thực
                </span>
              </div>
              <div className="flex justify-between border-b border-purple-200/50 pb-3">
                <span className="text-slate-700 text-sm">Loại tài khoản</span>
                <span className="text-purple-700">Thành viên</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 text-sm">Điểm tích lũy</span>
                <span className="text-2xl text-purple-700">1,250</span>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white/70 backdrop-blur-lg border border-white/50 rounded-2xl shadow-lg p-6 space-y-3">
              <h4 className="font-semibold text-slate-800">💡 Mẹo hữu ích</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" /> Cập nhật email để nhận thông báo</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" /> Thêm số điện thoại để xác thực nhanh</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" /> Tích điểm để nhận ưu đãi đặc biệt</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-orange-50/70 to-yellow-50/70 backdrop-blur-lg border border-orange-200/50 rounded-2xl shadow-lg p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-100/80 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Bảo mật thông tin</h4>
            <p className="text-slate-600 text-sm">
              Thông tin của bạn được mã hóa và bảo vệ. Chúng tôi không chia sẻ dữ liệu cá nhân với bên thứ ba.
            </p>
          </div>
        </div>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
        style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            color: '#1e293b',
        },
        }}
    />

    </div>
  );
};

export default Profile;
