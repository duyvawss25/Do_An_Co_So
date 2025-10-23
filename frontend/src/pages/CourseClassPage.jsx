import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Card,
    Row,
    Col,
    Statistic,
    Space,
    Popconfirm,
    Tag,
    Typography,
    Divider,
    Empty,
    Badge,
} from "antd";
import { toast } from "react-toastify";
import {
    BookOutlined,
    TeamOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    FilterOutlined,
    BarChartOutlined,
    UserOutlined,
    CalendarOutlined,
    TrophyOutlined,
    GlobalOutlined,
} from "@ant-design/icons";
import axiosClient from "../api/axiosClient";

const { Option } = Select;
const { Title, Text } = Typography;

const CourseClassPage = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const [selectedSemester, setSelectedSemester] = useState(null);
    const [semesterStats, setSemesterStats] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseStats, setCourseStats] = useState(null);
    const [combinedStats, setCombinedStats] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [classesRes, coursesRes, semestersRes, teachersRes] =
                await Promise.all([
                    axiosClient.get("/course-classes"),
                    axiosClient.get("/courses"),
                    axiosClient.get("/semesters"),
                    axiosClient.get("/teachers"),
                ]);

            setData(classesRes.data);
            setFilteredData(classesRes.data);
            setCourses(coursesRes.data);
            setSemesters(semestersRes.data);
            setTeachers(teachersRes.data);
        } catch {
            toast.error("Lỗi tải dữ liệu");
        }
        setLoading(false);
    };

    const fetchSemesterStats = async () => {
        if (!selectedSemester) return;
        try {
            const res = await axiosClient.get(
                `/course-classes/stats/semester/${selectedSemester}`
            );
            setSemesterStats(res.data);
        } catch {
            toast.error("Lỗi tải thống kê theo kỳ học");
        }
    };

    const fetchCourseStats = async () => {
        if (!selectedCourse) return;
        try {
            const res = await axiosClient.get(
                `/course-classes/stats/course/${selectedCourse}`
            );
            setCourseStats(res.data);
        } catch {
            toast.error("Lỗi tải thống kê theo học phần");
        }
    };

    const fetchCombinedStats = async () => {
        if (!selectedSemester || !selectedCourse) return;
        try {
            const res = await axiosClient.get(
                `/course-classes/stats/semester/${selectedSemester}/course/${selectedCourse}`
            );
            setCombinedStats(res.data);
        } catch {
            toast.error("Lỗi tải thống kê kết hợp");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedSemester && !selectedCourse) {
            fetchSemesterStats();
        } else {
            setSemesterStats(null);
        }
    }, [selectedSemester, selectedCourse]);

    useEffect(() => {
        if (selectedCourse && !selectedSemester) {
            fetchCourseStats();
        } else {
            setCourseStats(null);
        }
    }, [selectedCourse, selectedSemester]);

    useEffect(() => {
        if (selectedSemester && selectedCourse) {
            fetchCombinedStats();
            setSemesterStats(null);
            setCourseStats(null);
        } else {
            setCombinedStats(null);
        }
    }, [selectedSemester, selectedCourse]);

    useEffect(() => {
        let filtered = data;

        if (selectedSemester) {
            filtered = filtered.filter(
                (item) => item.semester?._id === selectedSemester
            );
        }

        if (selectedCourse) {
            filtered = filtered.filter(
                (item) => item.course?._id === selectedCourse
            );
        }

        setFilteredData(filtered);
    }, [selectedSemester, selectedCourse, data]);

    const handleSemesterSelect = (value) => {
        setSelectedSemester(value);
    };

    const handleCourseSelect = (value) => {
        setSelectedCourse(value);
    };

    const handleAdd = () => {
        setEditing(null);
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditing(record);
        form.setFieldsValue({
            ...record,
            course: record.course?._id,
            semester: record.semester?._id,
            teacher: record.teacher?._id,
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await axiosClient.delete(`/course-classes/${id}`);
            toast.success(res.data?.message || "Đã xóa thành công");
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || "Lỗi xóa";
            toast.error(msg);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            let res;
            if (editing) {
                res = await axiosClient.put(
                    `/course-classes/${editing._id}`,
                    values
                );
                toast.success(res.data?.message || "Cập nhật thành công");
            } else {
                res = await axiosClient.post("/course-classes", values);
                toast.success(res.data?.message || "Thêm mới thành công");
            }
            setModalOpen(false);
            fetchData();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "Vui lòng kiểm tra lại thông tin";
            toast.error(msg);
        }
    };

    const formatSemester = (semester) => {
        if (!semester) return "";
        return `${semester.name} - ${semester.year}`;
    };

    const getTypeConfig = (type) => {
        const configs = {
            normal: { color: "blue", icon: <BookOutlined />, text: "Thường" },
            special: { color: "gold", icon: <TrophyOutlined />, text: "Chất lượng cao" },
            international: { color: "purple", icon: <GlobalOutlined />, text: "Quốc tế" },
        };
        return configs[type] || configs.normal;
    };

    const columns = [
        {
            title: "Mã lớp",
            dataIndex: "code",
            key: "code",
            width: 120,
            fixed: "left",
            render: (text) => (
                <Text strong style={{ color: "#1890ff", fontSize: 13 }}>
                    {text}
                </Text>
            ),
        },
        {
            title: "Tên lớp",
            dataIndex: "name",
            key: "name",
            width: 150,
            render: (text) => <Text style={{ fontSize: 13 }}>{text}</Text>,
        },
        {
            title: "Môn học",
            dataIndex: ["course", "name"],
            key: "course",
            width: 220,
            render: (_, record) =>
                record.course ? (
                    <div>
                        <Tag color="cyan" style={{ marginBottom: 4 }}>
                            {record.course.code}
                        </Tag>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {record.course.name}
                        </Text>
                    </div>
                ) : (
                    <Text type="danger" style={{ fontSize: 12 }}>
                        Môn học đã bị xóa
                    </Text>
                ),
        },
        {
            title: "Kỳ học",
            dataIndex: ["semester", "name"],
            key: "semester",
            width: 140,
            render: (_, record) =>
                record.semester ? (
                    <Tag icon={<CalendarOutlined />} color="geekblue">
                        {record.semester.name} - {record.semester.year}
                    </Tag>
                ) : (
                    <Text type="danger" style={{ fontSize: 12 }}>
                        Kỳ học đã bị xóa
                    </Text>
                ),
        },
        {
            title: "Giảng viên",
            dataIndex: ["teacher", "name"],
            key: "teacher",
            width: 180,
            render: (_, record) =>
                record.teacher ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <UserOutlined style={{ color: "#52c41a", fontSize: 14 }} />
                        <div>
                            <Text style={{ fontSize: 13 }}>{record.teacher.name}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                {record.teacher.code}
                            </Text>
                        </div>
                    </div>
                ) : (
                    <Text type="secondary" italic style={{ fontSize: 12 }}>
                        Chưa phân công
                    </Text>
                ),
        },
        {
            title: "Loại lớp",
            dataIndex: "type",
            key: "type",
            width: 160,
            render: (type) => {
                const config = getTypeConfig(type);
                return (
                    <Tag icon={config.icon} color={config.color}>
                        {config.text}
                    </Tag>
                );
            },
        },
        {
            title: "Hệ số",
            dataIndex: "coefficient",
            key: "coefficient",
            width: 80,
            align: "center",
            render: (val) => (
                <Badge count={val} showZero style={{ backgroundColor: "#faad14" }} />
            ),
        },
        {
            title: "Số sinh viên",
            dataIndex: "studentCount",
            key: "studentCount",
            width: 120,
            align: "center",
            render: (count) => (
                <Tag icon={<TeamOutlined />} color="success" style={{ fontSize: 13 }}>
                    {count} SV
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            width: 160,
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                        style={{ borderRadius: 6 }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa lớp học phần"
                        description="Bạn có chắc chắn muốn xóa lớp này không?"
                        okText="Xóa"
                        okType="danger"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            style={{ borderRadius: 6 }}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div
            style={{
                padding: "24px",
                background: "linear-gradient(to bottom, #f0f2f5 0%, #ffffff 100%)",
                minHeight: "100vh",
            }}
        >
            {/* Header */}
            <div
                style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "40px 32px",
                    borderRadius: 16,
                    marginBottom: 24,
                    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                }}
            >
                <Title level={2} style={{ color: "white", margin: 0, marginBottom: 8 }}>
                    <BookOutlined style={{ marginRight: 12 }} />
                    Quản lý Lớp Học Phần
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.95)", fontSize: 15 }}>
                    Theo dõi và quản lý các lớp học phần một cách hiệu quả
                </Text>
            </div>

            {/* Stats Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={8}>
                    <Card
                        style={{
                            borderRadius: 12,
                            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                            border: "1px solid #e8e8e8",
                        }}
                        bodyStyle={{ padding: 20 }}
                    >
                        <Space direction="vertical" style={{ width: "100%" }} size={16}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <FilterOutlined style={{ fontSize: 20, color: "white" }} />
                                </div>
                                <Text strong style={{ fontSize: 16 }}>
                                    Thống kê theo Kỳ học
                                </Text>
                            </div>
                            <Select
                                style={{ width: "100%" }}
                                placeholder="Chọn kỳ học để xem thống kê"
                                onChange={handleSemesterSelect}
                                value={selectedSemester}
                                allowClear
                                size="large"
                                suffixIcon={<CalendarOutlined />}
                            >
                                {semesters.map((sem) => (
                                    <Option key={sem._id} value={sem._id}>
                                        {formatSemester(sem)}
                                    </Option>
                                ))}
                            </Select>
                            {selectedSemester && !selectedCourse && semesterStats ? (
                                <div style={{ marginTop: 8 }}>
                                    <Divider style={{ margin: "12px 0" }} />
                                    <div style={{ maxHeight: 320, overflowY: "auto" }}>
                                        {semesterStats.map((item, index) => (
                                            <Card
                                                key={index}
                                                size="small"
                                                style={{
                                                    marginBottom: 12,
                                                    background: "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)",
                                                    borderColor: "#91d5ff",
                                                    borderRadius: 10,
                                                }}
                                            >
                                                <Text
                                                    strong
                                                    style={{
                                                        color: "#0050b3",
                                                        display: "block",
                                                        marginBottom: 12,
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    📚 {item.courseName}
                                                </Text>
                                                <Row gutter={12}>
                                                    <Col span={12}>
                                                        <Statistic
                                                            title="Số lớp"
                                                            value={item.totalClasses}
                                                            prefix={<BookOutlined />}
                                                            valueStyle={{
                                                                fontSize: 22,
                                                                color: "#1890ff",
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col span={12}>
                                                        <Statistic
                                                            title="Sinh viên"
                                                            value={item.totalStudents}
                                                            prefix={<TeamOutlined />}
                                                            valueStyle={{
                                                                fontSize: 22,
                                                                color: "#52c41a",
                                                            }}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ) : selectedSemester && !selectedCourse ? (
                                <Empty
                                    description="Đang tải thống kê..."
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    style={{ margin: "20px 0" }}
                                />
                            ) : null}
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card
                        style={{
                            borderRadius: 12,
                            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                            border: "1px solid #e8e8e8",
                        }}
                        bodyStyle={{ padding: 20 }}
                    >
                        <Space direction="vertical" style={{ width: "100%" }} size={16}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        background: "linear-gradient(135deg, #52c41a 0%, #237804 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <BarChartOutlined style={{ fontSize: 20, color: "white" }} />
                                </div>
                                <Text strong style={{ fontSize: 16 }}>
                                    Thống kê theo Học phần
                                </Text>
                            </div>
                            <Select
                                style={{ width: "100%" }}
                                placeholder="Chọn học phần để xem thống kê"
                                onChange={handleCourseSelect}
                                value={selectedCourse}
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                size="large"
                                suffixIcon={<BookOutlined />}
                            >
                                {courses.map((course) => (
                                    <Option key={course._id} value={course._id}>
                                        {course.code} - {course.name}
                                    </Option>
                                ))}
                            </Select>
                            {selectedCourse && !selectedSemester && courseStats ? (
                                <div style={{ marginTop: 8 }}>
                                    <Divider style={{ margin: "12px 0" }} />
                                    <div style={{ maxHeight: 320, overflowY: "auto" }}>
                                        {courseStats.map((item, index) => (
                                            <Card
                                                key={index}
                                                size="small"
                                                style={{
                                                    marginBottom: 12,
                                                    background: "linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)",
                                                    borderColor: "#b7eb8f",
                                                    borderRadius: 10,
                                                }}
                                            >
                                                <Text
                                                    strong
                                                    style={{
                                                        color: "#237804",
                                                        display: "block",
                                                        marginBottom: 12,
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    📅 {item.semesterName} - {item.semesterYear}
                                                </Text>
                                                <Row gutter={12}>
                                                    <Col span={12}>
                                                        <Statistic
                                                            title="Số lớp"
                                                            value={item.totalClasses}
                                                            prefix={<BookOutlined />}
                                                            valueStyle={{
                                                                fontSize: 22,
                                                                color: "#52c41a",
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col span={12}>
                                                        <Statistic
                                                            title="Sinh viên"
                                                            value={item.totalStudents}
                                                            prefix={<TeamOutlined />}
                                                            valueStyle={{
                                                                fontSize: 22,
                                                                color: "#1890ff",
                                                            }}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ) : selectedCourse && !selectedSemester ? (
                                <Empty
                                    description="Đang tải thống kê..."
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    style={{ margin: "20px 0" }}
                                />
                            ) : null}
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card
                        style={{
                            borderRadius: 12,
                            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                        }}
                        bodyStyle={{ padding: 20 }}
                    >
                        <Space direction="vertical" style={{ width: "100%" }} size={16}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <Text strong style={{ fontSize: 16, color: "white" }}>
                                    📊 Thống kê Kết hợp
                                </Text>
                            </div>
                            {selectedSemester && selectedCourse && combinedStats ? (
                                <div>
                                    <Row gutter={[12, 12]}>
                                        <Col span={12}>
                                            <Card
                                                size="small"
                                                style={{
                                                    background: "rgba(255,255,255,0.25)",
                                                    borderColor: "rgba(255,255,255,0.4)",
                                                    borderRadius: 10,
                                                    backdropFilter: "blur(10px)",
                                                }}
                                                bodyStyle={{
                                                    padding: 16,
                                                    textAlign: "center",
                                                }}
                                            >
                                                <BookOutlined
                                                    style={{
                                                        fontSize: 28,
                                                        color: "white",
                                                        marginBottom: 8,
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        fontSize: 32,
                                                        fontWeight: "bold",
                                                        color: "white",
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    {combinedStats.totalClasses}
                                                </div>
                                                <div
                                                    style={{
                                                        color: "rgba(255,255,255,0.95)",
                                                        fontSize: 13,
                                                        marginTop: 6,
                                                    }}
                                                >
                                                    Tổng số lớp
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col span={12}>
                                            <Card
                                                size="small"
                                                style={{
                                                    background: "rgba(255,255,255,0.25)",
                                                    borderColor: "rgba(255,255,255,0.4)",
                                                    borderRadius: 10,
                                                    backdropFilter: "blur(10px)",
                                                }}
                                                bodyStyle={{
                                                    padding: 16,
                                                    textAlign: "center",
                                                }}
                                            >
                                                <TeamOutlined
                                                    style={{
                                                        fontSize: 28,
                                                        color: "white",
                                                        marginBottom: 8,
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        fontSize: 32,
                                                        fontWeight: "bold",
                                                        color: "white",
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    {combinedStats.totalStudents}
                                                </div>
                                                <div
                                                    style={{
                                                        color: "rgba(255,255,255,0.95)",
                                                        fontSize: 13,
                                                        marginTop: 6,
                                                    }}
                                                >
                                                    Tổng sinh viên
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col span={24}>
                                            <Card
                                                size="small"
                                                style={{
                                                    background: "rgba(255,255,255,0.25)",
                                                    borderColor: "rgba(255,255,255,0.4)",
                                                    borderRadius: 10,
                                                    backdropFilter: "blur(10px)",
                                                }}
                                                bodyStyle={{
                                                    padding: 16,
                                                    textAlign: "center",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: 28,
                                                        fontWeight: "bold",
                                                        color: "white",
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    {combinedStats.avgStudentsPerClass}
                                                </div>
                                                <div
                                                    style={{
                                                        color: "rgba(255,255,255,0.95)",
                                                        fontSize: 13,
                                                        marginTop: 6,
                                                    }}
                                                >
                                                    Trung bình sinh viên/lớp
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Divider
                                        style={{
                                            borderColor: "rgba(255,255,255,0.3)",
                                            margin: "16px 0",
                                        }}
                                    />
                                    <div style={{ fontSize: 13 }}>
                                        <div
                                            style={{
                                                marginBottom: 8,
                                                color: "rgba(255,255,255,0.95)",
                                            }}
                                        >
                                            <strong>📅 Học kỳ:</strong>{" "}
                                            {combinedStats.semesterName} -{" "}
                                            {combinedStats.semesterYear}
                                        </div>
                                        <div style={{ color: "rgba(255,255,255,0.95)" }}>
                                            <strong>📚 Học phần:</strong>{" "}
                                            {combinedStats.courseCode} -{" "}
                                            {combinedStats.courseName}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Empty
                                    description={
                                        <span style={{ color: "rgba(255,255,255,0.95)" }}>
                                            {selectedSemester || selectedCourse
                                                ? "Chọn cả học kỳ và học phần để xem thống kê chi tiết"
                                                : "Chọn ít nhất một tiêu chí để xem thống kê"}
                                        </span>
                                    }
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    style={{ padding: "60px 0" }}
                                />
                            )}
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Table Card */}
            <Card
                style={{
                    borderRadius: 12,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    border: "1px solid #e8e8e8",
                }}
                bodyStyle={{ padding: 24 }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 20,
                        flexWrap: "wrap",
                        gap: 16,
                    }}
                >
                    <div>
                        <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                            📋 Danh sách Lớp Học Phần
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Hiển thị {filteredData.length} lớp học phần
                        </Text>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        size="large"
                        style={{
                            borderRadius: 8,
                            height: 42,
                            paddingLeft: 24,
                            paddingRight: 24,
                            boxShadow: "0 4px 12px rgba(24,144,255,0.4)",
                            fontWeight: 500,
                        }}
                    >
                        Thêm lớp học phần
                    </Button>
                </div>

                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    scroll={{ x: 1500 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng cộng ${total} lớp`,
                        pageSizeOptions: ["10", "20", "50", "100"],
                    }}
                    style={{ marginTop: 16 }}
                />
            </Card>

            {/* Modal */}
            <Modal
                title={
                    <Space style={{ fontSize: 18 }}>
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <BookOutlined style={{ color: "white", fontSize: 18 }} />
                        </div>
                        <span style={{ fontWeight: 600 }}>
                            {editing ? "Cập nhật lớp học phần" : "Thêm lớp học phần mới"}
                        </span>
                    </Space>
                }
                open={modalOpen}
                onOk={handleOk}
                onCancel={() => setModalOpen(false)}
                width={700}
                okText={editing ? "Cập nhật" : "Thêm mới"}
                cancelText="Hủy"
                destroyOnClose
                okButtonProps={{
                    size: "large",
                    style: { borderRadius: 8, paddingLeft: 32, paddingRight: 32 },
                }}
                cancelButtonProps={{
                    size: "large",
                    style: { borderRadius: 8, paddingLeft: 32, paddingRight: 32 },
                }}
            >
                <Divider style={{ margin: "16px 0 24px 0" }} />
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="code"
                                label={<Text strong>Mã lớp</Text>}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã lớp",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="VD: CNTT001"
                                    size="large"
                                    style={{ borderRadius: 8 }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label={<Text strong>Tên lớp</Text>}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên lớp",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="VD: Lớp 1"
                                    size="large"
                                    style={{ borderRadius: 8 }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="course"
                        label={<Text strong>Môn học</Text>}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn môn học",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn môn học"
                            size="large"
                            showSearch
                            optionFilterProp="children"
                            style={{ borderRadius: 8 }}
                        >
                            {courses.map((course) => (
                                <Select.Option key={course._id} value={course._id}>
                                    {course.code} - {course.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="semester"
                                label={<Text strong>Kỳ học</Text>}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn kỳ học",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn kỳ học"
                                    size="large"
                                    style={{ borderRadius: 8 }}
                                >
                                    {semesters.map((semester) => (
                                        <Select.Option key={semester._id} value={semester._id}>
                                            {semester.name} - {semester.year}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="teacher"
                                label={<Text strong>Giảng viên</Text>}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn giảng viên",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn giảng viên"
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    style={{ borderRadius: 8 }}
                                >
                                    {teachers.map((teacher) => (
                                        <Select.Option key={teacher._id} value={teacher._id}>
                                            {teacher.code} - {teacher.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label={<Text strong>Loại lớp</Text>}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn loại lớp",
                                    },
                                ]}
                                initialValue="normal"
                            >
                                <Select size="large" style={{ borderRadius: 8 }}>
                                    <Option value="normal">
                                        <Space>
                                            <BookOutlined />
                                            <span>Thường</span>
                                        </Space>
                                    </Option>
                                    <Option value="special">
                                        <Space>
                                            <TrophyOutlined />
                                            <span>Chất lượng cao</span>
                                        </Space>
                                    </Option>
                                    <Option value="international">
                                        <Space>
                                            <GlobalOutlined />
                                            <span>Quốc tế</span>
                                        </Space>
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="studentCount"
                                label={<Text strong>Số lượng sinh viên</Text>}
                                initialValue={0}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: "100%", borderRadius: 8 }}
                                    placeholder="VD: 50"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default CourseClassPage;