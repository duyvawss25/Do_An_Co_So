import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Popconfirm,
    DatePicker,
    Card,
    Typography,
    Tag,
    Space,
    Divider,
    Row,
    Col,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    BankOutlined,
    TrophyOutlined,
    CalendarOutlined,
    IdcardOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import moment from "moment";

const { Title, Text } = Typography;

const TeacherPage = () => {
    const [data, setData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: "Mã số",
            dataIndex: "code",
            key: "code",
            width: 120,
            render: (text) => (
                <Tag color="blue" style={{ fontSize: "13px", fontWeight: "500" }}>
                    {text}
                </Tag>
            ),
        },
        {
            title: "Họ tên",
            dataIndex: "name",
            key: "name",
            render: (text) => (
                <Space>
                    <UserOutlined style={{ color: "#1890ff" }} />
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: "Ngày sinh",
            dataIndex: "dob",
            key: "dob",
            width: 130,
            render: (dob) => (
                <Space>
                    <CalendarOutlined style={{ color: "#52c41a" }} />
                    <Text>{dob ? moment(dob).format("DD/MM/YYYY") : ""}</Text>
                </Space>
            ),
        },
        {
            title: "Điện thoại",
            dataIndex: "phone",
            key: "phone",
            width: 130,
            render: (text) => (
                <Space>
                    <PhoneOutlined style={{ color: "#fa8c16" }} />
                    <Text>{text}</Text>
                </Space>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (text) => (
                <Space>
                    <MailOutlined style={{ color: "#eb2f96" }} />
                    <Text type="secondary">{text}</Text>
                </Space>
            ),
        },
        {
            title: "Khoa",
            dataIndex: "department",
            key: "department",
            width: 180,
            render: (dept) => (
                <Tag color="purple" icon={<BankOutlined />}>
                    {dept?.name || ""}
                </Tag>
            ),
        },
        {
            title: "Bằng cấp",
            dataIndex: "degree",
            key: "degree",
            width: 130,
            render: (deg) => (
                <Tag color="green" icon={<TrophyOutlined />}>
                    {deg?.name || ""}
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
                        onClick={() => handleEdit(record)}
                        size="small"
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xác nhận xóa"
                        description="Bạn có chắc chắn muốn xóa giảng viên này?"
                        okText="Xóa"
                        okType="danger"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button danger icon={<DeleteOutlined />} size="small">
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/teachers");
            setData(res.data);
        } catch {
            toast.error("Lỗi tải dữ liệu giảng viên");
        }
        setLoading(false);
    };

    const fetchDepartments = async () => {
        try {
            const res = await axiosClient.get("/departments");
            setDepartments(res.data);
        } catch {
            toast.error("Lỗi tải danh sách khoa");
        }
    };

    const fetchDegrees = async () => {
        try {
            const res = await axiosClient.get("/degrees");
            setDegrees(res.data);
        } catch {
            toast.error("Lỗi tải danh sách bằng cấp");
        }
    };

    useEffect(() => {
        fetchData();
        fetchDepartments();
        fetchDegrees();
    }, []);

    const handleAdd = () => {
        setEditing(null);
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditing(record);
        form.setFieldsValue({
            ...record,
            dob: record.dob ? moment(record.dob) : null,
            department: record.department?._id,
            degree: record.degree?._id,
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axiosClient.delete(`/teachers/${id}`);
            fetchData();
            toast.success("Xóa giảng viên thành công!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log("=== FORM VALUES ===");
            console.log("Toàn bộ dữ liệu form:", values);
            console.log("Ngày sinh (dob):", values.dob);
            console.log("Type của dob:", typeof values.dob);
            console.log("==================");

            if (editing) {
                await axiosClient.put(`/teachers/${editing._id}`, values);
                toast.success("Cập nhật giảng viên thành công!");
            } else {
                await axiosClient.post("/teachers", values);
                toast.success("Thêm giảng viên thành công!");
            }
            fetchData();
            setModalOpen(false);
        } catch (error) {
            console.error("=== FORM ERROR ===");
            console.error("Lỗi validation:", error);
            console.error("Error fields:", error.errorFields);
            console.error("==================");
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
        }
    };

    return (
        <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
            <Card
                bordered={false}
                style={{
                    maxWidth: "1600px",
                    margin: "0 auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                }}
            >
                <div style={{ marginBottom: "24px" }}>
                    <Space
                        align="center"
                        style={{
                            width: "100%",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                        }}
                    >
                        <div>
                            <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
                                <UserOutlined style={{ marginRight: "8px" }} />
                                Quản lý giảng viên
                            </Title>
                            <Text type="secondary" style={{ fontSize: "14px" }}>
                                Danh sách giảng viên và thông tin chi tiết
                            </Text>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                            size="large"
                            style={{
                                borderRadius: "6px",
                                height: "40px",
                                fontWeight: "500",
                            }}
                        >
                            Thêm giảng viên
                        </Button>
                    </Space>
                </div>

                <Divider style={{ margin: "16px 0 24px 0" }} />

                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    scroll={{ x: 1400 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng số ${total} giảng viên`,
                        pageSizeOptions: ["10", "20", "50"],
                    }}
                    style={{ background: "white" }}
                    bordered
                />
            </Card>

            <Modal
                title={
                    <Space>
                        <UserOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
                        <span style={{ fontSize: "16px" }}>
                            {editing ? "Cập nhật giảng viên" : "Thêm giảng viên mới"}
                        </span>
                    </Space>
                }
                open={modalOpen}
                onOk={handleOk}
                onCancel={() => setModalOpen(false)}
                destroyOnClose
                width={700}
                okText={editing ? "Cập nhật" : "Thêm mới"}
                cancelText="Hủy"
                okButtonProps={{
                    style: { borderRadius: "6px", height: "38px" },
                }}
                cancelButtonProps={{
                    style: { borderRadius: "6px", height: "38px" },
                }}
            >
                <Divider style={{ margin: "16px 0 24px 0" }} />
                <Form form={form} layout="vertical" name="teacher_form">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="code"
                                label={
                                    <Space>
                                        <IdcardOutlined />
                                        <Text strong>Mã giảng viên</Text>
                                    </Space>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã giảng viên!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="VD: GV001"
                                    size="large"
                                    prefix={<IdcardOutlined style={{ color: "#bfbfbf" }} />}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label={
                                    <Space>
                                        <UserOutlined />
                                        <Text strong>Họ và tên</Text>
                                    </Space>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập họ và tên!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="VD: Nguyễn Văn A"
                                    size="large"
                                    prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="dob"
                                label={
                                    <Space>
                                        <CalendarOutlined />
                                        <Text strong>Ngày sinh</Text>
                                    </Space>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn ngày sinh!",
                                    },
                                    {
                                        validator: (_, value) => {
                                            if (value) {
                                                const currentYear = moment().year();
                                                let birthYear;

                                                if (value.$y) {
                                                    birthYear = value.$y;
                                                } else if (typeof value === "string") {
                                                    birthYear = moment(value).year();
                                                } else {
                                                    birthYear = value.year();
                                                }

                                                const age = currentYear - birthYear;

                                                console.log("=== DEBUG TUỔI ===");
                                                console.log("Ngày sinh được chọn:", value);
                                                console.log("Năm hiện tại:", currentYear);
                                                console.log("Năm sinh:", birthYear);
                                                console.log("Tuổi tính được:", age);
                                                console.log("Điều kiện age >= 22:", age >= 22);
                                                console.log("==================");

                                                if (age < 22) {
                                                    return Promise.reject(
                                                        new Error("Giảng viên phải từ 22 tuổi trở lên.")
                                                    );
                                                }
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format="DD/MM/YYYY"
                                    size="large"
                                    placeholder="Chọn ngày sinh"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label={
                                    <Space>
                                        <PhoneOutlined />
                                        <Text strong>Số điện thoại</Text>
                                    </Space>
                                }
                                rules={[
                                    {
                                        pattern: /^\d{10}$/,
                                        message: "Số điện thoại phải có 10 chữ số!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="VD: 0123456789"
                                    size="large"
                                    prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="email"
                        label={
                            <Space>
                                <MailOutlined />
                                <Text strong>Email</Text>
                            </Space>
                        }
                        rules={[
                            {
                                type: "email",
                                message: "Định dạng email không hợp lệ!",
                            },
                        ]}
                    >
                        <Input
                            placeholder="VD: giaovien@university.edu.vn"
                            size="large"
                            prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="department"
                                label={
                                    <Space>
                                        <BankOutlined />
                                        <Text strong>Khoa</Text>
                                    </Space>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn khoa!",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn khoa"
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {departments.map((dept) => (
                                        <Select.Option key={dept._id} value={dept._id}>
                                            {dept.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="degree"
                                label={
                                    <Space>
                                        <TrophyOutlined />
                                        <Text strong>Bằng cấp</Text>
                                    </Space>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn bằng cấp!",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn bằng cấp"
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {degrees.map((deg) => (
                                        <Select.Option key={deg._id} value={deg._id}>
                                            {deg.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default TeacherPage;