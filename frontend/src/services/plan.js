import api from "./api";

const planService = {
  createPlan: async (planData, userId) => {
    if (!userId) {
      throw new Error("createPlan requires userId");
    }
    const response = await api.post("/api/plans", planData, {
      params: { userId },
    });
    return response.data;
  },
  getAllPlans: async (page = 0, size = 10) => {
    const response = await api.get("/api/plans", {
      params: { page, size },
    });
    return response.data.content || response.data;
  },

  getPlanById: async (planId) => {
    const response = await api.get(`/api/plans/${planId}`);
    return response.data;
  },

  getUserPlans: async (page = 0, size = 10, userId) => {
    const response = await api.get(`/api/plans/user/${userId}`, {
      params: { page, size },
    });
    return response.data.content || response.data;
  },

  getUserPlanCount: async (userId) => {
    const response = await api.get(`/api/plans/user/${userId}/count`);
    return response.data.count;
  },

  updatePlan: async (planId, planData) => {
    const response = await api.put(`/api/plans/${planId}`, planData);
    return response.data;
  },

  deletePlan: async (planId) => {
    await api.delete(`/api/plans/${planId}`);
  },
};

export default planService;
