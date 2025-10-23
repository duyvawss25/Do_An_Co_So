import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Card,
    Space,
    Tag,
    Typography,
    Divider,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    BookOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";

const { Title, Text } = Typography;

const CoursePage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/courses");
            setData(res.data);
        } catch {
            toast.error("Lỗi tải dữ liệu");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditing(null);
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditing(record);
        form.setFieldsValue(record);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await axiosClient.delete(`/courses/${id}`);
            toast.success(res.data?.message || "Đã xóa học phần thành công");
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || "Lỗi khi xóa học phần";
            toast.error(msg);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            let res;
            if (editing) {
                res = await axiosClient.put(`/courses/${editing._id}`, values);
                toast.success(res.data?.message || "Cập nhật thành công");
            } else {
                res = await axiosClient.post("/courses", values);
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

    const filteredData = data.filter(
        (item) =>
            item.code?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: "Mã học phần",
            dataIndex: "code",
            key: "code",
            width: 150,
            render: (text) => (
                <Tag color="blue" style={{ fontSize: "13px", padding: "4px 12px" }}>
                    {text}
                </Tag>
            ),
        },
        {
            title: "Tên học phần",
            dataIndex: "name",
            key: "name",
            render: (text) => (
                <Text strong style={{ fontSize: "14px" }}>
                    {text}
                </Text>
            ),
        },
        {
            title: "Số tín chỉ",
            dataIndex: "credits",
            key: "credits",
            width: 120,
            align: "center",
            render: (text) => (
                <Tag color="green" style={{ fontSize: "13px" }}>
                    {text} tín chỉ
                </Tag>
            ),
        },
        {
            title: "Số tiết",
            dataIndex: "totalLessons",
            key: "totalLessons",
            width: 120,
            align: "center",
            render: (text) => (
                <Tag color="orange" style={{ fontSize: "13px" }}>
                    {text} tiết
                </Tag>
            ),
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            render: (text) => (
                <Text type="secondary" style={{ fontSize: "13px" }}>
                    {text || "Chưa có mô tả"}
                </Text>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            width: 160,
            align: "center",
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa học phần"
                        description="Bạn có chắc chắn muốn xóa học phần này?"
                        okText="Xóa"
                        okType="danger"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ 
            padding: "24px", 
            background: "#f0f2f5",
            minHeight: "100vh"
        }}>
            <Card
                bordered={false}
                style={{
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <div style={{ marginBottom: "24px" }}>
                    <Space
                        style={{
                            width: "100%",
                            justifyContent: "space-between",
                        }}
                    >
                        <Space align="center">
                            <BookOutlined
                                style={{ fontSize: "28px", color: "#1890ff" }}
                            />
                            <Title level={3} style={{ margin: 0 }}>
                                Quản lý học phần
                            </Title>
                        </Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                            size="large"
                            style={{
                                borderRadius: "8px",
                                height: "40px",
                                fontSize: "15px",
                            }}
                        >
                            Thêm học phần
                        </Button>
                    </Space>
                </div>

                <Divider style={{ margin: "16px 0 24px 0" }} />

                <div style={{ marginBottom: "16px" }}>
                    <Input
                        placeholder="Tìm kiếm theo mã hoặc tên học phần..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        size="large"
                        style={{
                            borderRadius: "8px",
                            maxWidth: "400px",
                        }}
                        allowClear
                    />
                </div>

                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng số ${total} học phần`,
                        style: { marginTop: "16px" },
                    }}
                    style={{
                        background: "white",
                        borderRadius: "8px",
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>

            <Modal
                title={
                    <Space>
                        <BookOutlined style={{ color: "#1890ff" }} />
                        <span>{editing ? "Cập nhật học phần" : "Thêm học phần mới"}</span>
                    </Space>
                }
                open={modalOpen}
                onOk={handleOk}
                onCancel={() => setModalOpen(false)}
                destroyOnHidden
                okText={editing ? "Cập nhật" : "Thêm mới"}
                cancelText="Hủy"
                width={600}
                style={{ top: 50 }}
                okButtonProps={{
                    style: { borderRadius: "6px", height: "36px" },
                }}
                cancelButtonProps={{
                    style: { borderRadius: "6px", height: "36px" },
                }}
            >
                <Divider style={{ margin: "16px 0" }} />
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="code"
                        label="Mã học phần"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mã học phần",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Ví dụ: CNTT101"
                            size="large"
                            style={{ borderRadius: "6px" }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Tên học phần"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên học phần",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Ví dụ: Lập trình cơ bản"
                            size="large"
                            style={{ borderRadius: "6px" }}
                        />
                    </Form.Item>
                    <Space style={{ width: "100%" }} size="large">
                        <Form.Item
                            name="credits"
                            label="Số tín chỉ"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập số tín chỉ",
                                },
                            ]}
                            style={{ flex: 1, marginBottom: 0 }}
                        >
                            <InputNumber
                                min={1}
                                max={10}
                                placeholder="3"
                                size="large"
                                style={{ width: "100%", borderRadius: "6px" }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="totalLessons"
                            label="Số tiết"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập số tiết",
                                },
                            ]}
                            style={{ flex: 1, marginBottom: 0 }}
                        >
                            <InputNumber
                                min={1}
                                max={200}
                                placeholder="45"
                                size="large"
                                style={{ width: "100%", borderRadius: "6px" }}
                            />
                        </Form.Item>
                    </Space>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        style={{ marginTop: "24px" }}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Nhập mô tả về học phần..."
                            size="large"
                            style={{ borderRadius: "6px" }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CoursePage;