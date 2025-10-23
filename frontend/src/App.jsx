import React from "react";
import { Layout } from "antd";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import TeacherPage from "./pages/TeacherPage";
import DepartmentPage from "./pages/DepartmentPage";
import DegreePage from "./pages/DegreePage";
import CoursePage from "./pages/CoursePage";
import CourseClassPage from "./pages/CourseClassPage";
import TeacherStatsPage from "./pages/TeacherStatsPage";
import SemesterPage from "./pages/SemesterPage";
import TeacherPaymentPage from "./pages/TeacherPaymentPage";
import PaymentSettingsPage from "./pages/PaymentSettingsPage";
import ReportPage from "./pages/ReportPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "antd/dist/reset.css";

const { Sider, Content } = Layout;

function App() {
    return (
        <Router>
            <Routes>
                {/* 🟩 Mặc định chuyển hướng về login */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* 🟩 Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* 🟩 Protected routes */}
                <Route
                    element={
                        <ProtectedRoute>
                            <Layout style={{ minHeight: "100vh" }}>
                                <Sider width={220} style={{ background: "#fff" }}>
                                    <Sidebar />
                                </Sider>
                                <Layout>
                                    <Content
                                        style={{
                                            margin: "24px 16px 0",
                                            background: "#fff",
                                            padding: 24,
                                        }}
                                    >
                                        {/* Outlet sẽ render các route con */}
                                        <Outlet />
                                    </Content>
                                </Layout>
                            </Layout>
                        </ProtectedRoute>
                    }
                >
                    <Route path="/teachers" element={<TeacherPage />} />
                    <Route path="/departments" element={<DepartmentPage />} />
                    <Route path="/degrees" element={<DegreePage />} />
                    <Route path="/courses" element={<CoursePage />} />
                    <Route path="/course-classes" element={<CourseClassPage />} />
                    <Route path="/teacher-stats" element={<TeacherStatsPage />} />
                    <Route path="/semesters" element={<SemesterPage />} />
                    <Route path="/payments" element={<TeacherPaymentPage />} />
                    <Route path="/payment-settings" element={<PaymentSettingsPage />} />
                    <Route path="/reports" element={<ReportPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    {/* 🟩 Nếu không khớp route nào thì về /teachers */}
                    <Route path="*" element={<Navigate to="/teachers" />} />
                </Route>
            </Routes>

            {/* 🟩 Toast notification */}
            <ToastContainer position="top-right" autoClose={3000} />
        </Router>
    );
}

export default App;
