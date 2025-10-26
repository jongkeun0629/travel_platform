import axiosInstance from "./axiosInstance";

const USER_KEY = "currentUser";

export const userService = {
  login: async ({ identifier, password }) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        identifier,
        password,
      });
      // 로그인 성공 시 토큰 저장
      const userData = response.data;
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      return userData;
    } catch (err) {
      throw new Error(err.response?.data?.message || "로그인 실패");
    }
  },

  logout: () => {
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  register: async ({ userId, email, password }) => {
    try {
      const response = await axiosInstance.post("/api/auth/register", {
        userId,
        email,
        password,
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "회원가입 실패");
    }
  },
};
