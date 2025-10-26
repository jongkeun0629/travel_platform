import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Spring Boot 서버 주소
  withCredentials: true, // JWT 쿠키 인증 등 필요 시
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
