import React, { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    Progress,
    Space,
    Divider,
} from "antd";
import {
    TeamOutlined,
    BankOutlined,
    TrophyOutlined,
    RiseOutlined,
    UserOutlined,
} from "@ant-design/icons";
import axiosClient from "../api/axiosClient";

const { Title, Text } = Typography;

const TeacherStatsPage = () => {
    const [stats, setStats] = useState({
        totalTeachers: 0,
        teachersByDepartment: [],
        teachersByDegree: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const teachersRes = await axiosClient.get("/teachers");
                const teachers = teachersRes.data;

                const deptCount = {};
                teachers.forEach((teacher) => {
                    const deptName = teacher.department?.name || "Chưa phân công";
                    deptCount[deptName] = (deptCount[deptName] || 0) + 1;
                });

                const degreeCount = {};
                teachers.forEach((teacher) => {
                    const degreeName = teacher.degree?.name || "Chưa xác định";
                    degreeCount[degreeName] = (degreeCount[degreeName] || 0) + 1;
                });

                setStats({
                    totalTeachers: teachers.length,
                    teachersByDepartment: Object.entries(deptCount).map(
                        ([name, count]) => ({ name, count })
                    ),
                    teachersByDegree: Object.entries(degreeCount).map(
                        ([name, count]) => ({ name, count })
                    ),
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const getProgressColor = (index) => {
        const colors = ["#1890ff", "#52c41a", "#faad14", "#f5222d", "#722ed1", "#13c2c2"];
        return colors[index % colors.length];
    };

    return (
        <div
            style={{
                padding: "24px",
                background: "#f0f2f5",
                minHeight: "100vh",
            }}
        >
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                <div style={{ marginBottom: "24px" }}>
                    <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
                        <RiseOutlined style={{ marginRight: "8px" }} />
                        Thống kê giảng viên
                    </Title>
                    <Text type="secondary" style={{ fontSize: "14px" }}>
                        Báo cáo tổng quan về số lượng giảng viên theo khoa và bằng cấp
                    </Text>
                </div>

                {/* Tổng số giảng viên */}
                <Card
                    loading={loading}
                    bordered={false}
                    style={{
                        marginBottom: "24px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24}>
                            <Statistic
                                title={
                                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "16px" }}>
                                        Tổng số giảng viên
                                    </span>
                                }
                                value={stats.totalTeachers}
                                prefix={<TeamOutlined style={{ fontSize: "32px" }} />}
                                valueStyle={{
                                    color: "#fff",
                                    fontSize: "48px",
                                    fontWeight: "bold",
                                }}
                                suffix={<UserOutlined style={{ fontSize: "24px", opacity: 0.8 }} />}
                            />
                        </Col>
                    </Row>
                </Card>

                {/* Thống kê chi tiết */}
                <Row gutter={[16, 16]}>
                    {/* Thống kê theo khoa */}
                    <Col xs={24} lg={12}>
                        <Card
                            loading={loading}
                            title={
                                <Space>
                                    <BankOutlined
                                        style={{ fontSize: "18px", color: "#1890ff" }}
                                    />
                                    <Text strong style={{ fontSize: "16px" }}>
                                        Thống kê theo khoa
                                    </Text>
                                </Space>
                            }
                            bordered={false}
                            style={{
                                height: "100%",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                borderRadius: "8px",
                            }}
                            bodyStyle={{ padding: "24px" }}
                        >
                            {stats.teachersByDepartment.length === 0 ? (
                                <Text type="secondary" italic>
                                    Chưa có dữ liệu
                                </Text>
                            ) : (
                                stats.teachersByDepartment.map(({ name, count }, index) => {
                                    const percent = ((count / stats.totalTeachers) * 100).toFixed(1);
                                    const color = getProgressColor(index);
                                    return (
                                        <div
                                            key={name}
                                            style={{
                                                marginBottom: index === stats.teachersByDepartment.length - 1 ? 0 : "24px",
                                            }}
                                        >
                                            <Row
                                                justify="space-between"
                                                align="middle"
                                                style={{ marginBottom: "8px" }}
                                            >
                                                <Col>
                                                    <Space>
                                                        <BankOutlined style={{ color }} />
                                                        <Text strong>{name}</Text>
                                                    </Space>
                                                </Col>
                                                <Col>
                                                    <Space size="large">
                                                        <Text
                                                            strong
                                                            style={{
                                                                color,
                                                                fontSize: "18px",
                                                            }}
                                                        >
                                                            {count}
                                                        </Text>
                                                        <Text type="secondary">
                                                            ({percent}%)
                                                        </Text>
                                                    </Space>
                                                </Col>
                                            </Row>
                                            <Progress
                                                percent={parseFloat(percent)}
                                                strokeColor={color}
                                                showInfo={false}
                                                strokeWidth={10}
                                            />
                                        </div>
                                    );
                                })
                            )}
                        </Card>
                    </Col>

                    {/* Thống kê theo bằng cấp */}
                    <Col xs={24} lg={12}>
                        <Card
                            loading={loading}
                            title={
                                <Space>
                                    <TrophyOutlined
                                        style={{ fontSize: "18px", color: "#52c41a" }}
                                    />
                                    <Text strong style={{ fontSize: "16px" }}>
                                        Thống kê theo bằng cấp
                                    </Text>
                                </Space>
                            }
                            bordered={false}
                            style={{
                                height: "100%",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                borderRadius: "8px",
                            }}
                            bodyStyle={{ padding: "24px" }}
                        >
                            {stats.teachersByDegree.length === 0 ? (
                                <Text type="secondary" italic>
                                    Chưa có dữ liệu
                                </Text>
                            ) : (
                                stats.teachersByDegree.map(({ name, count }, index) => {
                                    const percent = ((count / stats.totalTeachers) * 100).toFixed(1);
                                    const color = getProgressColor(index + 3);
                                    return (
                                        <div
                                            key={name}
                                            style={{
                                                marginBottom: index === stats.teachersByDegree.length - 1 ? 0 : "24px",
                                            }}
                                        >
                                            <Row
                                                justify="space-between"
                                                align="middle"
                                                style={{ marginBottom: "8px" }}
                                            >
                                                <Col>
                                                    <Space>
                                                        <TrophyOutlined style={{ color }} />
                                                        <Text strong>{name}</Text>
                                                    </Space>
                                                </Col>
                                                <Col>
                                                    <Space size="large">
                                                        <Text
                                                            strong
                                                            style={{
                                                                color,
                                                                fontSize: "18px",
                                                            }}
                                                        >
                                                            {count}
                                                        </Text>
                                                        <Text type="secondary">
                                                            ({percent}%)
                                                        </Text>
                                                    </Space>
                                                </Col>
                                            </Row>
                                            <Progress
                                                percent={parseFloat(percent)}
                                                strokeColor={color}
                                                showInfo={false}
                                                strokeWidth={10}
                                            />
                                        </div>
                                    );
                                })
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default TeacherStatsPage;