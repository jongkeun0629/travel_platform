import { create } from "zustand";
import usePlanStore from "./planStore";
import planDetailService from "../services/planDetail";

const usePlanDetailStore = create((set) => ({
  planDetails: [],
  loading: false,
  error: null,

  createPlanDetail: async (planDetailData) => {
    set({ loading: true, error: null });
    try {
      const newPlanDetail = await planDetailService.createPlanDetail(
        planDetailData
      );
      set((state) => ({
        planDetails: [newPlanDetail, ...state.planDetails],
        loading: false,
      }));
      return newPlanDetail;
    } catch (err) {
      console.error("createPlanDetail error:", err);
      set({ loading: false, error: err.message || "Create planDetail failed" });
      throw err;
    }
  },

  getPlanDetail: async (planId) => {
    set({ loading: true, error: null });
    try {
      const planDetail = await planDetailService.getPlanDetail(planId);
      set({ loading: false });
      return planDetail;
    } catch (err) {
      console.error("getPlanDetail error:", err);
      set({ loading: false, error: err.message || "Get planDetail failed" });
      throw err;
    }
  },

  updatePlanDetail: async (planDetailId, planDetailData) => {
    set({ loading: true, error: null });
    try {
      const updated = await planDetailService.updatePlanDetail(
        planDetailId,
        planDetailData
      );
      set((state) => ({
        planDetails: state.planDetails.map((p) =>
          p.id === planDetailId ? updated : p
        ),
        loading: false,
      }));
      return updated;
    } catch (err) {
      console.error("updatePlanDetail error:", err);
      set({ loading: false, error: err.message || "Update failed" });
      throw err;
    }
  },

  deletePlanDetail: async (planDetailId) => {
    set({ loading: true, error: null });
    try {
      await planDetailService.deletePlanDetail(planDetailId);
      set((state) => ({
        planDetails: state.planDetails.filter((p) => p.id !== planDetailId),
        loading: false,
      }));
    } catch (err) {
      console.error("deletePlanDetail error:", err);
      set({ loading: false, error: err.message || "Delete failed" });
      throw err;
    }
  },
}));

export default usePlanDetailStore;
