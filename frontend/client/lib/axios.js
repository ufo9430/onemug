import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE;
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
