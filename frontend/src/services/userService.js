import interestService from "./interest";

const USER_KEY = "user";
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

  updateUser(old, updateData) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const userIndex = users.findIndex((u) => u.userId === old);

    if (userIndex === -1) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    const newUserId = updateData.userId;
    const isDuplicate = users.some(
      (u, index) => index !== userIndex && u.userId === newUserId
    );

    if (isDuplicate) {
      throw new Error("이미 사용 중인 아이디입니다.");
    }

    users[userIndex] = {
      ...users[userIndex],
      userId: newUserId,
      email: updateData.email,
    };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const currentUser = JSON.parse(localStorage.getItem(USERS_KEY));
    if (currentUser && currentUser.userId === old) {
      currentUser.userId = newUserId;
      localStorage.setItem(USERS_KEY, JSON.stringify(currentUser));
    }

    return currentUser;
  },
  async updateInterests(interestsArray) {
        // InterestService의 DTO 형식에 맞춰 객체 재구성
        const requestDto = { interestNames: interestsArray }; 
        return await interestService.updateUserInterests(requestDto);
    }
};
