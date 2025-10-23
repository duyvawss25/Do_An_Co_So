import React, { useState } from "react";

const Settings = () => {
  const [privacy, setPrivacy] = useState("public");
  const [contact, setContact] = useState("");
  const [support, setSupport] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("account");

  const handleSave = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/users/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ privacy, contact, support }),
    })
      .then((res) => res.json())
      .then(() => alert("Cài đặt đã lưu!"))
      .catch(() => alert("Lưu thất bại!"));
  };

  const settingsSections = [
    {
      id: "dymino",
      title: "Dymino",
      items: [
        { id: "account", label: "Trung tâm tài khoản", desc: "Quản lý cài đặt tài khoản và trải nghiệm Dymino." },
        { id: "info", label: "Thông tin cá nhân", icon: "👤" },
        { id: "password", label: "Mật khẩu và bảo mật", icon: "🔒" },
        { id: "ads", label: "Tùy chọn quảng cáo", icon: "📢" },
        { id: "verification", label: "Xác minh", icon: "✓" },
        { id: "more", label: "Xem thêm", icon: "→" }
      ]
    },
    {
      id: "tools",
      title: "Công cụ và nguồn lực",
      items: [
        { id: "privacy", label: "Quyền riêng tư", icon: "🔐" },
        { id: "family", label: "Trung tâm gia đình", icon: "👨‍👩‍👧‍👦" },
        { id: "defaults", label: "Cài đặt mặc định", icon: "⚙️" }
      ]
    },
    {
      id: "preferences",
      title: "Tùy chọn",
      desc: "Tùy chỉnh trải nghiệm của bạn trên Dymino.",
      items: [
        { id: "touch", label: "Cảm xúc", icon: "😊" },
        { id: "notifications", label: "Thông báo", icon: "🔔" },
        { id: "help", label: "Trợ năng", icon: "♿" },
        { id: "language", label: "Ngôn ngữ & khu vực", icon: "🌐" },
        { id: "media", label: "File phương tiện", icon: "📁" },
        { id: "appearance", label: "Chế độ tối", icon: "🌙" }
      ]
    }
  ];

  const quickAccessCards = [
    { icon: "👤", title: "Chặn", desc: "Quản lý danh sách chặn của bạn.", color: "from-yellow-400 to-orange-400" },
    { icon: "📝", title: "Nhật ký hoạt động", desc: "Xem và quản lý hoạt động của bạn.", color: "from-orange-400 to-red-400" },
    { icon: "💡", title: "Chế độ tối", desc: "Điều chỉnh giao diện theo ánh sáng.", color: "from-yellow-300 to-yellow-500" }
  ];

  const helpLinks = [
    { icon: "🔒", title: "Trung tâm quyền riêng tư", desc: "Quản lý quyền riêng tư trên Dymino." },
    { icon: "💻", title: "Trung tâm trợ giúp", desc: "Tìm hiểu thêm về cài đặt Dymino." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-6">
            <h1 className="text-2xl font-bold">Cài đặt & Quyền riêng tư</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm cài đặt"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>

            {settingsSections.map((section) => (
              <div key={section.id} className="space-y-2">
                <h3 className="font-semibold text-lg">{section.title}</h3>
                {section.desc && <p className="text-sm text-gray-500">{section.desc}</p>}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        activeSection === item.id
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.icon && <span className="text-xl">{item.icon}</span>}
                      <div>
                        <div className="font-medium">{item.label}</div>
                        {item.desc && <div className="text-xs text-gray-500">{item.desc}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickAccessCards.map((card, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow hover:shadow-md transition-all cursor-pointer">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-3xl mb-4`}>
                    {card.icon}
                  </div>
                  <h4 className="font-bold text-lg mb-1">{card.title}</h4>
                  <p className="text-sm text-gray-600">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Settings Form */}
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
              <h3 className="text-xl font-bold">Cài đặt tài khoản</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Quyền riêng tư</label>
                  <select
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                  >
                    <option value="public">Công khai</option>
                    <option value="private">Riêng tư</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-medium">Thông tin liên hệ</label>
                  <input
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Email hoặc số điện thoại"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Hỗ trợ / Góp ý</label>
                  <textarea
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    value={support}
                    onChange={(e) => setSupport(e.target.value)}
                    placeholder="Nhập góp ý của bạn..."
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all transform hover:scale-[1.02]"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>

            {/* Help Links */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Bạn cần giúp gì khác?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpLinks.map((link, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow hover:shadow-md flex items-start gap-4 cursor-pointer transition-all">
                    <div className="text-4xl">{link.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">{link.title}</h4>
                      <p className="text-sm text-gray-600">{link.desc}</p>
                    </div>
                    <span className="text-2xl text-gray-400">→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
