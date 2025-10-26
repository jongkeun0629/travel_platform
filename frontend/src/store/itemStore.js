import { create } from "zustand";
import itemService from "../services/item";

const useItemStore = create((set) => ({
  getItem: async (planId) => {
    set({ loading: true, error: null });
    try {
      const item = await itemService.getItem(planId);
      set({ loading: false });
      return item;
    } catch (err) {
      console.error("getItem error:", err);
      set({ loading: false, error: err.message || "Get item failed" });
      throw err;
    }
  },
}));
