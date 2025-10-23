import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Kiểm tra token đăng nhập
  return token ? children : <Navigate to="/login" />; // Nếu có token -> cho vào, ngược lại -> về login
};

export default ProtectedRoute;
