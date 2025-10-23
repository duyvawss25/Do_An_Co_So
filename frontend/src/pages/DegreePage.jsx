import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Space,
    Popconfirm,
    Card,
    Typography,
    Tag,
    Divider,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";

const { Title, Text } = Typography;

const DegreePage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: "Tên bằng cấp",
            dataIndex: "name",
            key: "name",
            render: (text) => (
                <Space>
                    <TrophyOutlined style={{ color: "#1890ff" }} />
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: "Tên viết tắt",
            dataIndex: "shortName",
            key: "shortName",
            render: (text) => (
                <Tag color="blue" style={{ fontSize: "13px" }}>
                    {text}
                </Tag>
            ),
        },
        {
            title: "Hệ số",
            dataIndex: "coefficient",
            key: "coefficient",
            render: (value) => (
                <Tag color="green" style={{ fontSize: "13px", minWidth: "50px", textAlign: "center" }}>
                    ×{value}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            width: 150,
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
                        description="Bạn có chắc chắn muốn xóa bằng cấp này?"
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

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/degrees");
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
            const res = await axiosClient.delete(`/degrees/${id}`);
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
                res = await axiosClient.put(`/degrees/${editing._id}`, values);
                toast.success(res.data?.message || "Đã cập nhật thành công");
            } else {
                res = await axiosClient.post("/degrees", values);
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
                    maxWidth: "1200px",
                    margin: "0 auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                }}
            >
                <div style={{ marginBottom: "24px" }}>
                    <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
                        <div>
                            <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
                                <TrophyOutlined style={{ marginRight: "8px" }} />
                                Quản lý bằng cấp
                            </Title>
                            <Text type="secondary" style={{ fontSize: "14px" }}>
                                Danh sách các bằng cấp và hệ số tương ứng
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
                            Thêm bằng cấp
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
                        showTotal: (total) => `Tổng số ${total} bằng cấp`,
                    }}
                    style={{ background: "white" }}
                    bordered
                />
            </Card>

            <Modal
                title={
                    <Space>
                        <TrophyOutlined style={{ color: "#1890ff" }} />
                        <span>{editing ? "Cập nhật bằng cấp" : "Thêm bằng cấp mới"}</span>
                    </Space>
                }
                open={modalOpen}
                onOk={handleOk}
                onCancel={() => setModalOpen(false)}
                destroyOnClose
                width={500}
                okText={editing ? "Cập nhật" : "Thêm mới"}
                cancelText="Hủy"
                okButtonProps={{
                    style: { borderRadius: "6px", height: "36px" }
                }}
                cancelButtonProps={{
                    style: { borderRadius: "6px", height: "36px" }
                }}
            >
                <Divider style={{ margin: "16px 0" }} />
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label={<Text strong>Tên bằng cấp</Text>}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên bằng cấp",
                            },
                        ]}
                    >
                        <Input
                            placeholder="VD: Thạc sĩ"
                            size="large"
                            prefix={<TrophyOutlined style={{ color: "#bfbfbf" }} />}
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
                            placeholder="VD: ThS"
                            size="large"
                            maxLength={10}
                        />
                    </Form.Item>
                    <Form.Item
                        name="coefficient"
                        label={<Text strong>Hệ số bằng cấp</Text>}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập hệ số",
                            },
                        ]}
                        initialValue={1}
                    >
                        <InputNumber
                            min={1}
                            max={10}
                            step={0.1}
                            style={{ width: "100%" }}
                            placeholder="VD: 1.5"
                            size="large"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DegreePage;