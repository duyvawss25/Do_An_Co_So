import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Card, Table, Select, Button } from "antd";
import { Loader2, Calculator } from "lucide-react";

const TeacherPaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [payments, setPayments] = useState([]);

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

  const columns = [
    { title: "Mã GV", dataIndex: ["teacher", "code"], key: "code" },
    { title: "Tên giảng viên", dataIndex: ["teacher", "name"], key: "name" },
    {
      title: "Tổng số tiết",
      dataIndex: "totalLessons",
      key: "totalLessons",
      align: "right",
    },
    {
      title: "Hệ số bằng cấp",
      dataIndex: "degreeCoefficient",
      key: "degreeCoefficient",
      align: "right",
    },
    {
      title: "Tổng tiền (VNĐ)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      render: (val) => val?.toLocaleString("vi-VN"),
    },
  ];

  const expandedRowRender = (record) => {
    const detailColumns = [
      { title: "Môn học", dataIndex: "courseName", key: "courseName" },
      { title: "Số tiết", dataIndex: "lessons", key: "lessons", align: "right" },
      {
        title: "Loại lớp",
        dataIndex: "classType",
        key: "classType",
        render: (type) =>
          ({
            normal: "Thường",
            special: "Chất lượng cao",
            international: "Quốc tế",
          }[type]),
      },
      {
        title: "Hệ số lớp",
        dataIndex: "classCoefficient",
        key: "classCoefficient",
        align: "right",
      },
      {
        title: "Thành tiền (VNĐ)",
        dataIndex: "amount",
        key: "amount",
        align: "right",
        render: (val) => val?.toLocaleString("vi-VN"),
      },
    ];
    return <Table columns={detailColumns} dataSource={record.details} pagination={false} rowKey="courseClass" />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Select
            className="w-56"
            placeholder="Chọn kỳ học"
            value={selectedSemester}
            onChange={setSelectedSemester}
            options={semesters.map((s) => ({
              value: s._id,
              label: `${s.name} - ${s.year}`,
            }))}
          />
          <Button
            type="primary"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            onClick={fetchPayments}
            disabled={!selectedSemester}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
            Tính toán
          </Button>
        </div>
      </div>

      <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={payments}
          rowKey={(record) => record.teacher.id}
          loading={loading}
          expandable={{ expandedRowRender }}
          pagination={false}
          className="rounded-xl"
        />
      </Card>
    </div>
  );
};

export default TeacherPaymentPage;
