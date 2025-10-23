import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    Popconfirm,
    Select,
    Card,
    Space,
    Tag,
    Typography,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const SemesterPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/semesters");
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
        form.setFieldsValue({
            ...record,
            startDate: dayjs(record.startDate),
            endDate: dayjs(record.endDate),
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await axiosClient.delete(`/semesters/${id}`);
            toast.success(res.data?.message || "Đã xóa kỳ học thành công");
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || "Lỗi khi xóa kỳ học";
            toast.error(msg);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editing) {
                await axiosClient.put(`/semesters/${editing._id}`, values);
                toast.success("Cập nhật kỳ học thành công!");
            } else {
                await axiosClient.post("/semesters", values);
                toast.success("Thêm kỳ học thành công!");
            }
            fetchData();
            setModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        }
    };

    const handleCancel = () => {
        setModalOpen(false);
    };

    const validateEndDate = (_, value) => {
        const startDate = form.getFieldValue("startDate");
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject("Ngày kết thúc phải sau ngày bắt đầu");
        }
        return Promise.resolve();
    };

    const filteredData = data.filter(
        (item) =>
            item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.year?.toLowerCase().includes(searchText.toLowerCase())
    );

    const getSemesterColor = (name) => {
        if (name?.includes("1")) return "blue";
        if (name?.includes("2")) return "green";
        if (name?.includes("3")) return "orange";
        return "default";
    };

    const columns = [
        {
            title: "Tên kỳ học",
            dataIndex: "name",
            key: "name",
            width: 180,
            render: (text) => (
                <Tag
                    color={getSemesterColor(text)}
                    className="text-sm py-1 px-3 font-medium"
                >
                    {text}
                </Tag>
            ),
        },
        {
            title: "Năm học",
            dataIndex: "year",
            key: "year",
            width: 150,
            render: (text) => (
                <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-blue-500" />
                    <Text strong className="text-sm">
                        {text}
                    </Text>
                </div>
            ),
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            width: 150,
            render: (date) => (
                <Tag color="cyan" className="text-sm">
                    {dayjs(date).format("DD/MM/YYYY")}
                </Tag>
            ),
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            width: 150,
            render: (date) => (
                <Tag color="volcano" className="text-sm">
                    {dayjs(date).format("DD/MM/YYYY")}
                </Tag>
            ),
        },
        {
            title: "Thời gian",
            key: "duration",
            width: 120,
            align: "center",
            render: (_, record) => {
                const days = dayjs(record.endDate).diff(
                    dayjs(record.startDate),
                    "day"
                );
                return (
                    <Tag color="geekblue" className="text-sm">
                        {days} ngày
                    </Tag>
                );
            },
        },
        {
            title: "Hành động",
            key: "action",
            width: 180,
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
                        className="hover:scale-105 transition-transform"
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa kỳ học"
                        description="Bạn có chắc chắn muốn xóa kỳ học này?"
                        okText="Xóa"
                        okType="danger"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            className="hover:scale-105 transition-transform"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <Card
                bordered={false}
                className="shadow-xl rounded-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                <CalendarOutlined className="text-white text-2xl" />
                            </div>
                            <div>
                                <Title level={3} className="!mb-0">
                                    Quản lý kỳ học
                                </Title>
                                <Text type="secondary" className="text-sm">
                                    Quản lý các kỳ học trong năm
                                </Text>
                            </div>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                            size="large"
                            className="!h-11 !rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105"
                        >
                            Thêm kỳ học
                        </Button>
                    </div>
                </div>

                {/* Search & Stats */}
                <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                    <Input
                        placeholder="Tìm kiếm theo tên kỳ học hoặc năm học..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        size="large"
                        className="!rounded-lg max-w-md shadow-sm"
                        allowClear
                    />
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                            <Text type="secondary" className="text-xs">
                                Tổng số kỳ học
                            </Text>
                            <div className="text-2xl font-bold text-blue-600">
                                {filteredData.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-lg overflow-hidden border border-gray-200">
                    <Table
                        rowKey="_id"
                        columns={columns}
                        dataSource={filteredData}
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => (
                                <span className="text-sm text-gray-600">
                                    Tổng số <strong>{total}</strong> kỳ học
                                </span>
                            ),
                            className: "!mt-4 !mb-2",
                        }}
                        className="custom-table"
                        scroll={{ x: 1000 }}
                    />
                </div>
            </Card>

            {/* Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-3 pb-2 border-b">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <CalendarOutlined className="text-white text-xl" />
                        </div>
                        <span className="text-lg font-semibold">
                            {editing ? "Cập nhật kỳ học" : "Thêm kỳ học mới"}
                        </span>
                    </div>
                }
                open={modalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnHidden
                okText={editing ? "Cập nhật" : "Thêm mới"}
                cancelText="Hủy"
                width={650}
                className="top-8"
                okButtonProps={{
                    className: "!rounded-lg !h-10 !shadow-md hover:!shadow-lg",
                }}
                cancelButtonProps={{
                    className: "!rounded-lg !h-10",
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="semester_form"
                    className="mt-6"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="name"
                            label={
                                <span className="font-semibold">
                                    Tên Học Kỳ
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn tên học kỳ!",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Chọn học kỳ"
                                size="large"
                                className="!rounded-lg"
                            >
                                <Select.Option value="Học kì 1">
                                    <div className="flex items-center gap-2">
                                        <Tag color="blue" className="!m-0">
                                            Học kì 1
                                        </Tag>
                                    </div>
                                </Select.Option>
                                <Select.Option value="Học kì 2">
                                    <div className="flex items-center gap-2">
                                        <Tag color="green" className="!m-0">
                                            Học kì 2
                                        </Tag>
                                    </div>
                                </Select.Option>
                                <Select.Option value="Học kì 3">
                                    <div className="flex items-center gap-2">
                                        <Tag color="orange" className="!m-0">
                                            Học kì 3
                                        </Tag>
                                    </div>
                                </Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="year"
                            label={
                                <span className="font-semibold">Năm Học</span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập năm học!",
                                },
                                {
                                    pattern: /^(\d{4})-(\d{4})$/,
                                    message:
                                        "Định dạng năm học phải là YYYY-YYYY.",
                                },
                                {
                                    validator: (_, value) => {
                                        if (value) {
                                            const [startYear, endYear] = value
                                                .split("-")
                                                .map(Number);
                                            if (endYear !== startYear + 1) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Năm kết thúc phải lớn hơn năm bắt đầu 1 năm."
                                                    )
                                                );
                                            }
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input
                                placeholder="Ví dụ: 2023-2024"
                                size="large"
                                className="!rounded-lg"
                            />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="startDate"
                            label={
                                <span className="font-semibold">
                                    Ngày bắt đầu
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn ngày bắt đầu",
                                },
                            ]}
                        >
                            <DatePicker
                                className="w-full !rounded-lg"
                                size="large"
                                format="DD/MM/YYYY"
                                placeholder="Chọn ngày bắt đầu"
                            />
                        </Form.Item>

                        <Form.Item
                            name="endDate"
                            label={
                                <span className="font-semibold">
                                    Ngày kết thúc
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn ngày kết thúc",
                                },
                                { validator: validateEndDate },
                            ]}
                        >
                            <DatePicker
                                className="w-full !rounded-lg"
                                size="large"
                                format="DD/MM/YYYY"
                                placeholder="Chọn ngày kết thúc"
                            />
                        </Form.Item>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Text type="secondary" className="text-xs block mb-1">
                            💡 Gợi ý
                        </Text>
                        <Text type="secondary" className="text-xs">
                            Năm học thường bắt đầu vào tháng 9 và kết thúc vào
                            tháng 5-6 năm sau. Mỗi học kỳ thường kéo dài từ
                            4-5 tháng.
                        </Text>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default SemesterPage;