import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // backend port 5000
  headers: { "Content-Type": "application/json" },
});

// Thêm interceptor để tự gắn token từ localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
