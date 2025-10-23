import React, { useEffect, useState } from "react";
import {
    Card,
    Form,
    InputNumber,
    Button,
    Typography,
    Tag,
    Space,
} from "antd";
import {
    SaveOutlined,
    DollarOutlined,
    PercentageOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";

const { Title, Text } = Typography;

const PaymentSettingsPage = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const fetchSettings = async () => {
        try {
            const response = await axiosClient.get("/settings");
            const settings = response.data;
            form.setFieldsValue({
                baseRate: settings.baseRate,
                normalCoefficient: settings.classCoefficients?.normal || 1.0,
                specialCoefficient: settings.classCoefficients?.special || 1.5,
                internationalCoefficient:
                    settings.classCoefficients?.international || 2.0,
            });
        } catch {
            toast.error("Lỗi tải cài đặt");
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const settingsData = {
                baseRate: values.baseRate,
                classCoefficients: {
                    normal: values.normalCoefficient,
                    special: values.specialCoefficient,
                    international: values.internationalCoefficient,
                },
            };
            await axiosClient.put("/settings", settingsData);
            toast.success("Đã cập nhật cài đặt và hệ số lớp học phần");
            await fetchSettings();
        } catch {
            toast.error("Lỗi cập nhật");
        }
        setLoading(false);
    };

    const coefficientCards = [
        {
            name: "normalCoefficient",
            label: "Lớp thường",
            icon: "📚",
            color: "blue",
            gradient: "from-blue-400 to-blue-600",
            bgGradient: "from-blue-50 to-blue-100",
            placeholder: "1.0",
            description: "Hệ số chuẩn cho các lớp thông thường",
        },
        {
            name: "specialCoefficient",
            label: "Lớp chất lượng cao",
            icon: "⭐",
            color: "orange",
            gradient: "from-orange-400 to-orange-600",
            bgGradient: "from-orange-50 to-orange-100",
            placeholder: "1.5",
            description: "Hệ số cao hơn cho lớp chất lượng cao",
        },
        {
            name: "internationalCoefficient",
            label: "Lớp quốc tế",
            icon: "🌍",
            color: "green",
            gradient: "from-green-400 to-green-600",
            bgGradient: "from-green-50 to-green-100",
            placeholder: "2.0",
            description: "Hệ số cao nhất cho lớp quốc tế",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <DollarOutlined className="text-white text-3xl" />
                        </div>
                        <div>
                            <Title level={2} className="!mb-1">
                                Cài đặt hệ thống thanh toán
                            </Title>
                            <Text type="secondary" className="text-base">
                                Quản lý định mức và hệ số tính lương giảng viên
                            </Text>
                        </div>
                    </div>
                </div>

                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    {/* Base Rate Card */}
                    <Card
                        className="mb-6 shadow-lg rounded-2xl border-0 overflow-hidden"
                        bordered={false}
                    >
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 -mx-6 -mt-6 px-6 py-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <DollarOutlined className="text-white text-xl" />
                                </div>
                                <div>
                                    <Text className="text-white text-lg font-semibold block">
                                        Định mức tiền cơ bản
                                    </Text>
                                    <Text className="text-white/80 text-sm">
                                        Mức lương cơ bản theo tiết giảng dạy
                                    </Text>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-xl">
                            <Form.Item
                                name="baseRate"
                                label={
                                    <span className="text-base font-semibold text-gray-700">
                                        Định mức tiền theo tiết (VNĐ)
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập định mức tiền",
                                    },
                                ]}
                            >
                                <InputNumber
                                    className="w-full !rounded-xl"
                                    size="large"
                                    formatter={(value) =>
                                        `${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )
                                    }
                                    parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, "")
                                    }
                                    placeholder="VD: 50,000"
                                    min={0}
                                    prefix="₫"
                                />
                            </Form.Item>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                                <div className="flex gap-3">
                                    <InfoCircleOutlined className="text-blue-500 text-lg mt-0.5" />
                                    <div>
                                        <Text className="text-sm font-medium text-blue-900 block mb-1">
                                            💡 Gợi ý tính toán
                                        </Text>
                                        <Text className="text-sm text-blue-700">
                                            Tiền lương = Định mức × Số tiết ×
                                            Hệ số lớp học phần
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Coefficients Section */}
                    <Card
                        className="mb-6 shadow-lg rounded-2xl border-0 overflow-hidden"
                        bordered={false}
                    >
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 -mx-6 -mt-6 px-6 py-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <PercentageOutlined className="text-white text-xl" />
                                </div>
                                <div>
                                    <Text className="text-white text-lg font-semibold block">
                                        Hệ số lớp học phần
                                    </Text>
                                    <Text className="text-white/80 text-sm">
                                        Thiết lập hệ số nhân cho từng loại lớp
                                    </Text>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {coefficientCards.map((card) => (
                                <div
                                    key={card.name}
                                    className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 border-2 border-${card.color}-200 hover:shadow-lg transition-all duration-300 hover:scale-105`}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-md text-2xl`}
                                        >
                                            {card.icon}
                                        </div>
                                        <div>
                                            <Text className="font-semibold text-gray-800 block text-base">
                                                {card.label}
                                            </Text>
                                            <Tag
                                                color={card.color}
                                                className="!m-0 !text-xs"
                                            >
                                                Hệ số
                                            </Tag>
                                        </div>
                                    </div>

                                    <Form.Item
                                        name={card.name}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập hệ số",
                                            },
                                        ]}
                                        className="!mb-3"
                                    >
                                        <InputNumber
                                            className="w-full !rounded-xl"
                                            size="large"
                                            min={0}
                                            max={10}
                                            step={0.1}
                                            placeholder={card.placeholder}
                                        />
                                    </Form.Item>

                                    <Text className="text-xs text-gray-600 block">
                                        {card.description}
                                    </Text>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <div className="flex gap-3">
                                <InfoCircleOutlined className="text-amber-600 text-lg mt-0.5" />
                                <div>
                                    <Text className="text-sm font-medium text-amber-900 block mb-1">
                                        📊 Ví dụ tính toán
                                    </Text>
                                    <Text className="text-sm text-amber-700 block">
                                        Với định mức 50,000 VNĐ/tiết và 30 tiết
                                        giảng dạy:
                                    </Text>
                                    <ul className="text-sm text-amber-700 mt-2 ml-4 space-y-1">
                                        <li>
                                            • Lớp thường (×1.0): 50,000 × 30 ×
                                            1.0 ={" "}
                                            <strong>1,500,000 VNĐ</strong>
                                        </li>
                                        <li>
                                            • Lớp CLC (×1.5): 50,000 × 30 × 1.5
                                            = <strong>2,250,000 VNĐ</strong>
                                        </li>
                                        <li>
                                            • Lớp quốc tế (×2.0): 50,000 × 30 ×
                                            2.0 = <strong>3,000,000 VNĐ</strong>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<SaveOutlined />}
                            size="large"
                            className="!h-12 !px-10 !rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 !text-base font-semibold"
                        >
                            {loading ? "Đang cập nhật..." : "Lưu cài đặt"}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default PaymentSettingsPage;