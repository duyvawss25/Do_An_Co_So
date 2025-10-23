import React from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
    TeamOutlined,
    BookOutlined,
    ReadOutlined,
    BarChartOutlined,
    BankOutlined,
    ApartmentOutlined,
    FileTextOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        {
            key: "teacher-management",
            icon: <TeamOutlined />,
            label: "Quản lý giáo viên",
            children: [
                {
                    key: "degrees",
                    icon: <ApartmentOutlined />,
                    label: "Quản lý bằng cấp",
                },
                {
                    key: "departments",
                    icon: <BankOutlined />,
                    label: "Quản lý khoa",
                },
                {
                    key: "teachers",
                    icon: <TeamOutlined />,
                    label: "Danh sách giáo viên",
                },
                {
                    key: "teacher-stats",
                    icon: <BarChartOutlined />,
                    label: "Thống kê giáo viên",
                },
            ],
        },
        {
            key: "course-management",
            icon: <BookOutlined />,
            label: "Quản lý học phần",
            children: [
                {
                    key: "courses",
                    icon: <BookOutlined />,
                    label: "Danh sách học phần",
                },
                {
                    key: "semesters",
                    icon: <BankOutlined />,
                    label: "Quản lý kỳ học",
                },
                {
                    key: "course-classes",
                    icon: <ReadOutlined />,
                    label: "Lớp học phần",
                },
            ],
        },
        {
            key: "payment-management",
            icon: <BarChartOutlined />,
            label: "Tính tiền dạy",
            children: [
                {
                    key: "payment-settings",
                    icon: <BarChartOutlined />,
                    label: "Cài đặt tính tiền",
                },
                {
                    key: "payments",
                    icon: <BarChartOutlined />,
                    label: "Tính tiền giảng viên",
                },
                {
                    key: "reports",
                    icon: <FileTextOutlined />,
                    label: "Báo cáo tiền dạy",
                },
            ],
        },
        // 🟩 Phần người dùng
        {
            key: "user-section",
            icon: <UserOutlined />,
            label: "Người dùng",
            children: [
                {
                    key: "profile",
                    icon: <UserOutlined />,
                    label: "Hồ sơ cá nhân",
                },
                {
                    key: "settings",
                    icon: <SettingOutlined />,
                    label: "Cài đặt",
                },
            ],
        },
    ];

    const handleMenuClick = ({ key }) => {
        navigate(`/${key}`);
    };

    // Xác định menu đang được chọn
    const selectedKey = location.pathname.split("/")[1] || "teachers";

    return (
        <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            defaultOpenKeys={[
                "teacher-management",
                "course-management",
                "payment-management",
                "user-section",
            ]}
            items={items}
            onClick={handleMenuClick}
            style={{ height: "100%", borderRight: 0 }}
        />
    );
};

export default Sidebar;
