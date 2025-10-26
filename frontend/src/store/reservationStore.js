import { create } from "zustand";
import reservationService from "../services/reservation";

const useReservationStore = create((set) => ({
  reservations: [],
  loading: false,
  error: null,

  // 타입별 reservation 생성
  createTransportReservation: async (reservationData) => {
    set({ loading: true, error: null });
    try {
      const newReservation =
        await reservationService.createTransportReservation(reservationData);
      set((state) => ({
        reservations: [newReservation, ...state.reservations],
        loading: false,
      }));
      return newReservation;
    } catch (err) {
      console.error("createTransportReservation error:", err);
      set({
        loading: false,
        error: err.message || "Create transport reservation failed",
      });
      throw err;
    }
  },

  createAccommodationReservation: async (reservationData) => {
    set({ loading: true, error: null });
    try {
      const newReservation =
        await reservationService.createAccommodationReservation(
          reservationData
        );
      set((state) => ({
        reservations: [newReservation, ...state.reservations],
        loading: false,
      }));
      return newReservation;
    } catch (err) {
      console.error("createAccommodationReservation error:", err);
      set({
        loading: false,
        error: err.message || "Create accommodation reservation failed",
      });
      throw err;
    }
  },

  createRestaurantReservation: async (reservationData) => {
    set({ loading: true, error: null });
    try {
      const newReservation =
        await reservationService.createRestaurantReservation(reservationData);
      set((state) => ({
        reservations: [newReservation, ...state.reservations],
        loading: false,
      }));
      return newReservation;
    } catch (err) {
      console.error("createRestaurantReservation error:", err);
      set({
        loading: false,
        error: err.message || "Create restaurant reservation failed",
      });
      throw err;
    }
  },

  getReservation: async (planId) => {
    set({ loading: true, error: null });
    try {
      const content = await reservationService.getReservation(planId);
      set({ reservations: content, loading: false });
      return content;
    } catch (err) {
      console.error("getReservation error:", err);
      set({ loading: false, error: err.message || "Get reservation failed" });
      throw err;
    }
  },

  updateTransportReservation: async (reservationId, reservationData) => {
    set({ loading: true, error: null });
    try {
      const updated = await reservationService.updateTransportReservation(
        reservationId,
        reservationData
      );
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r.id === reservationId ? updated : r
        ),
        loading: false,
      }));
      return updated;
    } catch (err) {
      console.error("updateTransportReservation error:", err);
      set({
        loading: false,
        error: err.message || "Update transport reservation failed",
      });
      throw err;
    }
  },

  updateAccommodationReservation: async (reservationId, reservationData) => {
    set({ loading: true, error: null });
    try {
      const updated = await reservationService.updateAccommodationReservation(
        reservationId,
        reservationData
      );
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r.id === reservationId ? updated : r
        ),
        loading: false,
      }));
      return updated;
    } catch (err) {
      console.error("updateAccommodationReservation error:", err);
      set({
        loading: false,
        error: err.message || "Update accommodation reservation failed",
      });
      throw err;
    }
  },

  updateRestaurantReservation: async (reservationId, reservationData) => {
    set({ loading: true, error: null });
    try {
      const updated = await reservationService.updateRestaurantReservation(
        reservationId,
        reservationData
      );
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r.id === reservationId ? updated : r
        ),
        loading: false,
      }));
      return updated;
    } catch (err) {
      console.error("updateRestaurantReservation error:", err);
      set({
        loading: false,
        error: err.message || "Update restaurant reservation failed",
      });
      throw err;
    }
  },

  deleteReservation: async (reservationId) => {
    set({ loading: true, error: null });
    try {
      await reservationService.deleteReservation(reservationId);
      set((state) => ({
        reservations: state.reservations.filter((r) => r.id !== reservationId),
        loading: false,
      }));
    } catch (err) {
      console.error("deleteReservation error:", err);
      set({ loading: false, error: err.message || "Delete failed" });
      throw err;
    }
  },
}));

export default useReservationStore;
