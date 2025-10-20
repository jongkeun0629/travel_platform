// src/services/userService.js
const USER_KEY = "currentUser";

export const userService = {
  // 현재 로그인된 사용자 정보를 가져옵니다.
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      return null;
    }
  },

  register(user) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === user.email)) {
      throw new Error("이미 존재하는 이메일입니다.");
    }
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  },

  // 가상의 로그인 처리
  login: (email, password) => {
    // 실제로는 백엔드 API 호출 로직이 들어갑니다.
    const user = { email, token: "fake-jwt-token" };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  // 로그아웃 처리
  logout: () => {
    localStorage.removeItem(USER_KEY);
  },
};
