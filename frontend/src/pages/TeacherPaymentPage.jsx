import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Select, Button } from "antd";
import { Loader2, Calculator, ChevronDown, ChevronUp, DollarSign, BookOpen, Users } from "lucide-react";

const TeacherPaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [payments, setPayments] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const res = await axiosClient.get("/semesters");
      const data = res.data;
      setSemesters(data);
      if (data.length > 0) setSelectedSemester(data[0]._id);
    } catch {
      alert("Lỗi tải danh sách kỳ học");
    }
  };

  const fetchPayments = async () => {
    if (!selectedSemester) return alert("Vui lòng chọn kỳ học");
    setLoading(true);
    try {
      const res = await axiosClient.get(
        `/payments/calculate-semester/${selectedSemester}`
      );
      setPayments(res.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi tải dữ liệu thanh toán");
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (teacherId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(teacherId)) {
      newExpanded.delete(teacherId);
    } else {
      newExpanded.add(teacherId);
    }
    setExpandedRows(newExpanded);
  };

  const totalAmount = payments.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const totalLessons = payments.reduce((sum, p) => sum + (p.totalLessons || 0), 0);

  const getClassTypeName = (type) => ({
    normal: "Thường",
    special: "Chất lượng cao",
    international: "Quốc tế",
  }[type] || type);

  const getClassTypeColor = (type) => ({
    normal: "bg-blue-100 text-blue-700",
    special: "bg-purple-100 text-purple-700",
    international: "bg-emerald-100 text-emerald-700",
  }[type] || "bg-gray-100 text-gray-700");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            Quản lý Thanh toán Giảng viên
          </h1>
          <p className="text-gray-600 ml-15">Tính toán và theo dõi thanh toán cho giảng viên theo kỳ học</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">Chọn kỳ học</label>
              <Select
                className="w-full md:w-72"
                placeholder="Chọn kỳ học"
                size="large"
                value={selectedSemester}
                onChange={setSelectedSemester}
                options={semesters.map((s) => ({
                  value: s._id,
                  label: `${s.name} - ${s.year}`,
                }))}
              />
            </div>
            <Button
              type="primary"
              size="large"
              className="mt-6 h-11 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              onClick={fetchPayments}
              disabled={!selectedSemester || loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Calculator className="w-5 h-5 mr-2" />
              )}
              Tính toán thanh toán
            </Button>
          </div>
        </div>

        {/* Stats */}
        {payments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Tổng giảng viên</p>
                  <p className="text-3xl font-bold">{payments.length}</p>
                </div>
                <Users className="w-12 h-12 text-blue-200 opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Tổng số tiết</p>
                  <p className="text-3xl font-bold">{totalLessons.toLocaleString()}</p>
                </div>
                <BookOpen className="w-12 h-12 text-purple-200 opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-1">Tổng tiền</p>
                  <p className="text-3xl font-bold">{totalAmount.toLocaleString('vi-VN')} đ</p>
                </div>
                <DollarSign className="w-12 h-12 text-emerald-200 opacity-80" />
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Chưa có dữ liệu thanh toán</p>
              <p className="text-gray-400 text-sm mt-2">Vui lòng chọn kỳ học và nhấn "Tính toán thanh toán"</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mã GV</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tên giảng viên</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Số tiết</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Hệ số BC</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Tổng tiền</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((payment, index) => {
                    const isExpanded = expandedRows.has(payment.teacher.id);
                    return (
                      <React.Fragment key={payment.teacher.id}>
                        <tr className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{payment.teacher.code}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{payment.teacher.name}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm text-gray-700 font-medium">{payment.totalLessons}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {payment.degreeCoefficient}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm font-bold text-emerald-600">{payment.totalAmount?.toLocaleString('vi-VN')} đ</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => toggleRow(payment.teacher.id)}
                              className="p-1 hover:bg-gray-200 rounded-lg transition-colors duration-150"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                              <div className="rounded-xl bg-white shadow-inner p-4 border border-blue-100">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-blue-500" />
                                  Chi tiết môn học
                                </h4>
                                <div className="space-y-2">
                                  {payment.details?.map((detail, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-800 text-sm">{detail.courseName}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getClassTypeColor(detail.classType)}`}>
                                            {getClassTypeName(detail.classType)}
                                          </span>
                                          <span className="text-xs text-gray-500">Hệ số: {detail.classCoefficient}</span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm font-medium text-gray-700">{detail.lessons} tiết</p>
                                        <p className="text-sm font-bold text-emerald-600">{detail.amount?.toLocaleString('vi-VN')} đ</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherPaymentPage;