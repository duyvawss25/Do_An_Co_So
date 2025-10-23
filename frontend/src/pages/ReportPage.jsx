import React, { useState, useEffect } from "react";
import {
    Tabs,
    Card,
    Table,
    Statistic,
    Select,
    Button,
    Spin,
    Typography,
    Tag,
} from "antd";
import {
    DownloadOutlined,
    BarChartOutlined,
    TeamOutlined,
    BankOutlined,
    DollarOutlined,
    BookOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;

const ReportPage = () => {
    const [loading, setLoading] = useState(false);
    const [yearReport, setYearReport] = useState(null);
    const [departmentReport, setDepartmentReport] = useState(null);
    const [schoolReport, setSchoolReport] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeData = async () => {
            await fetchYears();
            await fetchDepartments();
            setIsInitialized(true);
        };
        initializeData();
    }, []);

    useEffect(() => {
        if (isInitialized && selectedYear) {
            fetchYearReport();
            fetchSchoolReport();
        }
    }, [isInitialized, selectedYear]);

    useEffect(() => {
        if (isInitialized && selectedDepartment) {
            fetchDepartmentReport();
        }
    }, [isInitialized, selectedDepartment, selectedYear]);

    const fetchYears = async () => {
        try {
            const response = await axiosClient.get("/semesters");
            const uniqueYears = [...new Set(response.data.map((s) => s.year))]
                .sort()
                .reverse();
            setYears(uniqueYears);
            if (uniqueYears.length > 0) {
                setSelectedYear(uniqueYears[0]);
            }
        } catch (error) {
            console.error("Error fetching years:", error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axiosClient.get("/departments");
            setDepartments(response.data);
            if (response.data.length > 0) {
                setSelectedDepartment(response.data[0]._id);
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const fetchYearReport = async () => {
        if (!selectedYear) return;
        setLoading(true);
        try {
            const response = await axiosClient.get(
                `/payments/report/year/${selectedYear}`
            );
            setYearReport(response.data);
        } catch (error) {
            console.error("Error fetching year report:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartmentReport = async () => {
        if (!selectedDepartment) return;
        setLoading(true);
        try {
            const url = selectedYear
                ? `/payments/report/department/${selectedDepartment}?year=${selectedYear}`
                : `/payments/report/department/${selectedDepartment}`;
            const response = await axiosClient.get(url);
            setDepartmentReport(response.data);
        } catch (error) {
            console.error("Error fetching department report:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSchoolReport = async () => {
        setLoading(true);
        try {
            const url = selectedYear
                ? `/payments/report/school?year=${selectedYear}`
                : "/payments/report/school";
            const response = await axiosClient.get(url);
            setSchoolReport(response.data);
        } catch (error) {
            console.error("Error fetching school report:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const yearReportColumns = [
        {
            title: "STT",
            key: "index",
            render: (_, __, index) => (
                <Tag color="blue" className="font-mono">
                    {index + 1}
                </Tag>
            ),
            width: 70,
            align: "center",
        },
        {
            title: "Mã GV",
            dataIndex: ["teacher", "code"],
            key: "code",
            width: 120,
            render: (text) => (
                <Tag color="cyan" className="font-mono text-sm">
                    {text}
                </Tag>
            ),
        },
        {
            title: "Họ tên",
            dataIndex: ["teacher", "name"],
            key: "name",
            render: (text) => (
                <Text strong className="text-sm">
                    {text}
                </Text>
            ),
        },
        {
            title: "Khoa",
            dataIndex: ["teacher", "department"],
            key: "department",
            render: (text) => (
                <Tag color="geekblue" className="text-xs">
                    {text}
                </Tag>
            ),
        },
        {
            title: "Tổng tiết",
            dataIndex: "totalLessons",
            key: "totalLessons",
            align: "right",
            width: 120,
            render: (text) => (
                <Tag color="orange" className="font-semibold">
                    {text} tiết
                </Tag>
            ),
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            key: "totalAmount",
            align: "right",
            render: (amount) => (
                <Text strong className="text-green-600 text-sm">
                    {formatCurrency(amount)}
                </Text>
            ),
            width: 180,
        },
    ];

    const departmentReportColumns = [
        {
            title: "STT",
            key: "index",
            render: (_, __, index) => (
                <Tag color="blue" className="font-mono">
                    {index + 1}
                </Tag>
            ),
            width: 70,
            align: "center",
        },
        {
            title: "Mã GV",
            dataIndex: ["teacher", "code"],
            key: "code",
            width: 120,
            render: (text) => (
                <Tag color="cyan" className="font-mono text-sm">
                    {text}
                </Tag>
            ),
        },
        {
            title: "Họ tên",
            dataIndex: ["teacher", "name"],
            key: "name",
            render: (text) => (
                <Text strong className="text-sm">
                    {text}
                </Text>
            ),
        },
        {
            title: "Tổng tiết",
            dataIndex: "totalLessons",
            key: "totalLessons",
            align: "right",
            width: 120,
            render: (text) => (
                <Tag color="orange" className="font-semibold">
                    {text} tiết
                </Tag>
            ),
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            key: "totalAmount",
            align: "right",
            render: (amount) => (
                <Text strong className="text-green-600 text-sm">
                    {formatCurrency(amount)}
                </Text>
            ),
            width: 180,
        },
    ];

    const schoolReportColumns = [
        {
            title: "STT",
            key: "index",
            render: (_, __, index) => (
                <Tag color="blue" className="font-mono">
                    {index + 1}
                </Tag>
            ),
            width: 70,
            align: "center",
        },
        {
            title: "Khoa",
            dataIndex: ["department", "name"],
            key: "department",
            render: (text) => (
                <div className="flex items-center gap-2">
                    <BankOutlined className="text-blue-500" />
                    <Text strong className="text-sm">
                        {text}
                    </Text>
                </div>
            ),
        },
        {
            title: "Số GV",
            dataIndex: "totalTeachers",
            key: "totalTeachers",
            align: "center",
            width: 100,
            render: (text) => (
                <Tag color="purple" className="font-semibold">
                    {text} GV
                </Tag>
            ),
        },
        {
            title: "Tổng tiết",
            dataIndex: "totalLessons",
            key: "totalLessons",
            align: "right",
            width: 120,
            render: (text) => (
                <Tag color="orange" className="font-semibold">
                    {text} tiết
                </Tag>
            ),
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            key: "totalAmount",
            align: "right",
            render: (amount) => (
                <Text strong className="text-green-600 text-sm">
                    {formatCurrency(amount)}
                </Text>
            ),
            width: 180,
        },
    ];

    const handleTabChange = (key) => {
        if (key === "1") {
            fetchYearReport();
        } else if (key === "2") {
            fetchDepartmentReport();
        } else if (key === "3") {
            fetchSchoolReport();
        }
    };

    const StatCard = ({ title, value, icon, prefix, formatter, color }) => (
        <div
            className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
            <div className="flex items-center justify-between mb-3">
                <Text className="text-white/80 text-sm font-medium">
                    {title}
                </Text>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div className="text-white text-3xl font-bold">
                {prefix}
                {formatter ? formatter(value) : value}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                            <BarChartOutlined className="text-white text-3xl" />
                        </div>
                        <div>
                            <Title level={2} className="!mb-1">
                                Báo cáo tiền dạy
                            </Title>
                            <Text type="secondary" className="text-base">
                                Thống kê và báo cáo chi tiết về tiền lương
                                giảng dạy
                            </Text>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="shadow-lg rounded-2xl border-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    📅 Năm học
                                </label>
                                <Select
                                    className="w-full"
                                    size="large"
                                    value={selectedYear}
                                    onChange={setSelectedYear}
                                    placeholder="Chọn năm học"
                                >
                                    <Option value="">Tất cả</Option>
                                    {years.map((year) => (
                                        <Option key={year} value={year}>
                                            {year}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    🏛️ Khoa
                                </label>
                                <Select
                                    className="w-full"
                                    size="large"
                                    value={selectedDepartment}
                                    onChange={setSelectedDepartment}
                                    placeholder="Chọn khoa"
                                >
                                    {departments.map((dept) => (
                                        <Option key={dept._id} value={dept._id}>
                                            {dept.name}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<DownloadOutlined />}
                                    onClick={() =>
                                        toast.info(
                                            "Tính năng xuất báo cáo sẽ được phát triển"
                                        )
                                    }
                                    className="w-full !h-12 !rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105"
                                >
                                    Xuất Báo Cáo
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <Card className="shadow-xl rounded-2xl border-0 overflow-hidden">
                    <Tabs
                        defaultActiveKey="1"
                        onChange={handleTabChange}
                        size="large"
                        className="custom-tabs"
                    >
                        <TabPane
                            tab={
                                <span className="flex items-center gap-2 text-base">
                                    <TeamOutlined />
                                    Báo cáo theo năm học
                                </span>
                            }
                            key="1"
                        >
                            <Spin spinning={loading}>
                                {yearReport && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            <StatCard
                                                title="Tổng số giảng viên"
                                                value={yearReport.totalTeachers}
                                                icon={
                                                    <TeamOutlined className="text-white text-xl" />
                                                }
                                                color="from-blue-500 to-blue-600"
                                            />
                                            <StatCard
                                                title="Tổng số tiết"
                                                value={yearReport.totalLessons}
                                                icon={
                                                    <BookOutlined className="text-white text-xl" />
                                                }
                                                color="from-orange-500 to-orange-600"
                                            />
                                            <StatCard
                                                title="Tổng tiền"
                                                value={yearReport.totalAmount}
                                                formatter={formatCurrency}
                                                icon={
                                                    <DollarOutlined className="text-white text-xl" />
                                                }
                                                color="from-green-500 to-green-600"
                                            />
                                            <StatCard
                                                title="Định mức cơ bản"
                                                value={yearReport.baseRate}
                                                formatter={formatCurrency}
                                                icon={
                                                    <TrophyOutlined className="text-white text-xl" />
                                                }
                                                color="from-purple-500 to-purple-600"
                                            />
                                        </div>
                                        <div className="rounded-xl overflow-hidden border border-gray-200">
                                            <Table
                                                columns={yearReportColumns}
                                                dataSource={yearReport.teachers}
                                                rowKey={(record) =>
                                                    record.teacher.id
                                                }
                                                pagination={{
                                                    pageSize: 10,
                                                    showSizeChanger: true,
                                                    showQuickJumper: true,
                                                    showTotal: (total, range) =>
                                                        `${range[0]}-${range[1]} của ${total} giảng viên`,
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            </Spin>
                        </TabPane>

                        <TabPane
                            tab={
                                <span className="flex items-center gap-2 text-base">
                                    <BankOutlined />
                                    Báo cáo theo khoa
                                </span>
                            }
                            key="2"
                        >
                            <Spin spinning={loading}>
                                {departmentReport && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <StatCard
                                                title="Khoa"
                                                value={
                                                    departmentReport.department
                                                        .name
                                                }
                                                icon={
                                                    <BankOutlined className="text-white text-xl" />
                                                }
                                                color="from-indigo-500 to-indigo-600"
                                            />
                                            <StatCard
                                                title="Tổng số giảng viên"
                                                value={
                                                    departmentReport.totalTeachers
                                                }
                                                icon={
                                                    <TeamOutlined className="text-white text-xl" />
                                                }
                                                color="from-blue-500 to-blue-600"
                                            />
                                            <StatCard
                                                title="Tổng tiền"
                                                value={
                                                    departmentReport.totalAmount
                                                }
                                                formatter={formatCurrency}
                                                icon={
                                                    <DollarOutlined className="text-white text-xl" />
                                                }
                                                color="from-green-500 to-green-600"
                                            />
                                        </div>
                                        <div className="rounded-xl overflow-hidden border border-gray-200">
                                            <Table
                                                columns={
                                                    departmentReportColumns
                                                }
                                                dataSource={
                                                    departmentReport.teachers
                                                }
                                                rowKey={(record) =>
                                                    record.teacher.id
                                                }
                                                pagination={{
                                                    pageSize: 10,
                                                    showSizeChanger: true,
                                                    showQuickJumper: true,
                                                    showTotal: (total, range) =>
                                                        `${range[0]}-${range[1]} của ${total} giảng viên`,
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            </Spin>
                        </TabPane>

                        <TabPane
                            tab={
                                <span className="flex items-center gap-2 text-base">
                                    <BankOutlined />
                                    Báo cáo toàn trường
                                </span>
                            }
                            key="3"
                        >
                            <Spin spinning={loading}>
                                {schoolReport && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            <StatCard
                                                title="Tổng số khoa"
                                                value={
                                                    schoolReport.totalDepartments
                                                }
                                                icon={
                                                    <BankOutlined className="text-white text-xl" />
                                                }
                                                color="from-indigo-500 to-indigo-600"
                                            />
                                            <StatCard
                                                title="Tổng số giảng viên"
                                                value={
                                                    schoolReport.totalTeachers
                                                }
                                                icon={
                                                    <TeamOutlined className="text-white text-xl" />
                                                }
                                                color="from-blue-500 to-blue-600"
                                            />
                                            <StatCard
                                                title="Tổng số tiết"
                                                value={
                                                    schoolReport.totalLessons
                                                }
                                                icon={
                                                    <BookOutlined className="text-white text-xl" />
                                                }
                                                color="from-orange-500 to-orange-600"
                                            />
                                            <StatCard
                                                title="Tổng tiền"
                                                value={schoolReport.totalAmount}
                                                formatter={formatCurrency}
                                                icon={
                                                    <DollarOutlined className="text-white text-xl" />
                                                }
                                                color="from-green-500 to-green-600"
                                            />
                                        </div>
                                        <div className="rounded-xl overflow-hidden border border-gray-200">
                                            <Table
                                                columns={schoolReportColumns}
                                                dataSource={
                                                    schoolReport.departments
                                                }
                                                rowKey={(record) =>
                                                    record.department.id
                                                }
                                                expandable={{
                                                    expandedRowRender: (
                                                        record
                                                    ) => (
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <Table
                                                                columns={
                                                                    departmentReportColumns
                                                                }
                                                                dataSource={
                                                                    record.teachers
                                                                }
                                                                rowKey={(
                                                                    teacher
                                                                ) =>
                                                                    teacher
                                                                        .teacher
                                                                        .id
                                                                }
                                                                pagination={
                                                                    false
                                                                }
                                                                size="small"
                                                            />
                                                        </div>
                                                    ),
                                                }}
                                                pagination={{
                                                    pageSize: 10,
                                                    showSizeChanger: true,
                                                    showQuickJumper: true,
                                                    showTotal: (total, range) =>
                                                        `${range[0]}-${range[1]} của ${total} khoa`,
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            </Spin>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
};

export default ReportPage;  