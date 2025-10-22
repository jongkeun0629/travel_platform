const USER_KEY = "currentUser";
const USERS_KEY = "users";

export const userService = {
  // 현재 로그인된 사용자 반환
  getCurrentUser() {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      return null;
    }
  },

  // 회원가입 (아이디, 이메일 중복검사)
  register({ userId, email, password }) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

    // 중복 체크
    if (users.find((u) => u.userId === userId)) {
      throw new Error("이미 존재하는 아이디입니다.");
    }
    if (users.find((u) => u.email === email)) {
      throw new Error("이미 존재하는 이메일입니다.");
    }

    // 새로운 사용자 저장
    const newUser = { userId, email, password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    console.log("✅ 회원가입 성공:", newUser);
    return newUser;
  },

  // 로그인 (아이디 또는 이메일 + 비밀번호)
  login({ identifier, password }) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

    const user = users.find(
      (u) =>
        (u.userId === identifier || u.email === identifier) &&
        u.password === password
    );

    if (!user) {
      throw new Error("아이디/이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    // 로그인 성공 시 현재 유저 저장
    const loggedInUser = { userId: user.userId, email: user.email };
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));

    console.log("✅ 로그인 성공:", loggedInUser);
    return loggedInUser;
  },

  logout() {
    localStorage.removeItem(USER_KEY);
  },
};
