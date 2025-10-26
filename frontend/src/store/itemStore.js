import { create } from "zustand";
import itemService from "../services/item";
import usePlanStore from "../store/planStore";

const useItemStore = create((set) => ({
  item: [],
  ischecked: false,
  loading: false,
  error: null,

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

  createItem: async (itemData) => {
    set({ loading: true, error: null });
    try {
      const planId = usePlanStore.getState().plan.planId;
      const newItem = await itemService.createItem(planId, itemData);
      set((state) => ({
        item: [newItem, ...state.item],
        ischecked: false,
        loading: false,
      }));
      return newItem;
    } catch (err) {
      console.error("createItem error:", err);
      set({ loading: false, error: err.message || "Create item failed" });
      throw err;
    }
  },
}));

export default useItemStore;
