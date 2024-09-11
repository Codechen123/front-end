import axios from "axios";

// 创建 Axios 实例
const instance = axios.create({
  baseURL: "http://192.168.69.10:5000",
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 设置 token 到请求头中
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
