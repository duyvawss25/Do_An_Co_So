import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Popconfirm,
    Card,
    Typography,
    Tag,
    Space,
    Divider,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    BankOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";

const { Title, Text } = Typography;
const { TextArea } = Input;

const DepartmentPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: "Tên khoa",
            dataIndex: "name",
            key: "name",
            render: (text) => (
                <Space>
                    <BankOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
                    <Text strong style={{ fontSize: "14px" }}>{text}</Text>
                </Space>
            ),
        },
        {
            title: "Tên viết tắt",
            dataIndex: "shortName",
            key: "shortName",
            width: 150,
            render: (text) => (
                <Tag color="purple" style={{ fontSize: "13px", fontWeight: "500" }}>
                    {text}
                </Tag>
            ),
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            render: (text) => (
                <Text type="secondary" style={{ fontSize: "13px" }}>
                    {text || <Text type="secondary" italic>Chưa có mô tả</Text>}
                </Text>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            width: 160,
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
                        description="Bạn có chắc chắn muốn xóa khoa này?"
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
            const res = await axiosClient.get("/departments");
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
            const res = await axiosClient.delete(`/departments/${id}`);
            toast.success(res.data?.message || "Đã xóa thành công");
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || "Lỗi khi xóa";
            toast.error(msg);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            let res;
            if (editing) {
                res = await axiosClient.put(`/departments/${editing._id}`, values);
                toast.success(res.data?.message || "Đã cập nhật thành công");
            } else {
                res = await axiosClient.post("/departments", values);
                toast.success(res.data?.message || "Đã thêm mới thành công");
            }
            setModalOpen(false);
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || "Lỗi thao tác";
            toast.error(msg);
        }
    };

    return (
        <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
            <Card
                bordered={false}
                style={{
                    maxWidth: "1400px",
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
                                <BankOutlined style={{ marginRight: "8px" }} />
                                Quản lý khoa
                            </Title>
                            <Text type="secondary" style={{ fontSize: "14px" }}>
                                Danh sách các khoa và thông tin chi tiết
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
                            Thêm khoa
                        </Button>
                    </Space>
                </div>

                <Divider style={{ margin: "16px 0 24px 0" }} />

                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng số ${total} khoa`,
                        pageSizeOptions: ["10", "20", "50"],
                    }}
                    style={{ background: "white" }}
                    bordered
                />
            </Card>

            <Modal
                title={
                    <Space>
                        <BankOutlined style={{ color: "#1890ff" }} />
                        <span>{editing ? "Cập nhật khoa" : "Thêm khoa mới"}</span>
                    </Space>
                }
                open={modalOpen}
                onOk={handleOk}
                onCancel={() => setModalOpen(false)}
                destroyOnClose
                width={550}
                okText={editing ? "Cập nhật" : "Thêm mới"}
                cancelText="Hủy"
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
                        name="name"
                        label={<Text strong>Tên khoa</Text>}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên khoa",
                            },
                        ]}
                    >
                        <Input
                            placeholder="VD: Khoa Công nghệ thông tin"
                            size="large"
                            prefix={<BankOutlined style={{ color: "#bfbfbf" }} />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="shortName"
                        label={<Text strong>Tên viết tắt</Text>}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên viết tắt",
                            },
                        ]}
                    >
                        <Input
                            placeholder="VD: CNTT"
                            size="large"
                            maxLength={20}
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={
                            <Space>
                                <Text strong>Mô tả</Text>
                                <Text type="secondary" style={{ fontSize: "12px" }}>
                                    (Không bắt buộc)
                                </Text>
                            </Space>
                        }
                    >
                        <TextArea
                            placeholder="Nhập mô tả về khoa..."
                            rows={4}
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DepartmentPage;