import { create } from "zustand";
import { authService } from "../services/auth";

const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,

  socialLoginSuccess: () => {
    const accessToken = localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");

    const user = userStr ? JSON.parse(userStr) : null;

    if (accessToken && user) {
      set({
        user: user,
        isAuthenticated: !!accessToken,
        loading: false,
        error: null,
      });
      return true;
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
      return false;
    }
  },

  login: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login(userData);
      set({
        user: data?.user || null,
        isAuthenticated: !!data?.access_token,
        loading: false,
      });
      return data;
    } catch (err) {
      console.error("authStore.login error:", err);
      set({
        loading: false,
        error: err.response?.data?.message || "Login failed",
      });
      throw err;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.register(userData);
      set({
        user: data.user,
        isAuthenticated: true,
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Registration failed",
      });
      throw err;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  setAuth: (authData) => set(authData),

  updateUser: (userData) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    set((state) => ({
      user: { ...state.user, ...userData },
    }));
  },
}));

export default useAuthStore;
