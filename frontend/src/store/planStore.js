import { create } from "zustand";
import useAuthStore from "../store/authStore";
import planService from "../services/plan";

const usePlanStore = create((set) => ({
  plans: [],
  userPlans: [],
  userPlanCount: 0,
  loading: false,
  error: null,

  createPlan: async (planData) => {
    set({ loading: true, error: null });
    try {
      // 현재 유저 id를 가져와 함께 전달
      const currentUser = useAuthStore.getState().user;
      const userId = currentUser?.id;
      if (!userId) {
        throw new Error("로그인이 필요합니다.");
      }
      const newPlan = await planService.createPlan(planData, userId);
      set((state) => ({
        plans: [newPlan, ...state.plans],
        loading: false,
      }));
      return newPlan;
    } catch (err) {
      console.error("createPlan error:", err);
      set({ loading: false, error: err.message || "Create plan failed" });
      throw err;
    }
  },

  fetchPlans: async (page = 0) => {
    set({ loading: true, error: null });
    try {
      const content = await planService.getAllPlans(page);
      set({ plans: content, loading: false });
      return content;
    } catch (err) {
      console.error("fetchPlans error:", err);
      set({ loading: false, error: err.message || "Fetch plans failed" });
      throw err;
    }
  },

  getUserPlans: async (page = 0, userId) => {
    set({ loading: true, error: null });
    try {
      const content = await planService.getUserPlans(page, 10, userId);
      set({ userPlans: content, loading: false });
      return content;
    } catch (err) {
      console.error("getUserPlans error:", err);
      set({ loading: false, error: err.message || "Get user plans failed" });
      throw err;
    }
  },

  getUserPlanCount: async (userId) => {
    set({ loading: true, error: null });
    try {
      const count = await planService.getUserPlanCount(userId);
      set({ userPlanCount: count, loading: false });
      return count;
    } catch (err) {
      console.error("getUserPlanCount error:", err);
      set({ loading: false, error: err.message || "Get count failed" });
      throw err;
    }
  },

  getPlanById: async (planId) => {
    set({ loading: true, error: null });
    try {
      const plan = await planService.getPlanById(planId);
      // optionally update plans array or cache
      set({ loading: false });
      return plan;
    } catch (err) {
      console.error("getPlanById error:", err);
      set({ loading: false, error: err.message || "Get plan failed" });
      throw err;
    }
  },

  updatePlan: async (planId, planData) => {
    set({ loading: true, error: null });
    try {
      const updated = await planService.updatePlan(planId, planData);
      set((state) => ({
        plans: state.plans.map((p) => (p.id === planId ? updated : p)),
        loading: false,
      }));
      return updated;
    } catch (err) {
      console.error("updatePlan error:", err);
      set({ loading: false, error: err.message || "Update failed" });
      throw err;
    }
  },

  deletePlan: async (planId) => {
    set({ loading: true, error: null });
    try {
      await planService.deletePlan(planId);
      set((state) => ({
        plans: state.plans.filter((p) => p.id !== planId),
        loading: false,
      }));
    } catch (err) {
      console.error("deletePlan error:", err);
      set({ loading: false, error: err.message || "Delete failed" });
      throw err;
    }
  },
}));

export default usePlanStore;
