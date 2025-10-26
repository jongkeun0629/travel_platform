import api from "./api";

const planDetailService = {
  createPlanDetail: async (planData) => {
    const response = await api.post(`/api/plan-details`, planData);
    return response.data;
  },

  getPlanDetail: async (planId) => {
    const response = await api.get(`/api/plan-details/plan/${planId}`);
    return response.data;
  },

  updatePlanDetail: async (planDetailId, planData) => {
    const response = await api.put(
      `/api/plan-details/${planDetailId}`,
      planData
    );
    return response.data;
  },

  deletePlanDetail: async (planDetailId) => {
    await api.delete(`/api/plan-details/${planDetailId}`);
  },
};

export default planDetailService;
