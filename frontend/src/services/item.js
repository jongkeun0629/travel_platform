import api from "./api";

const itemService = {
  getItem: async (planId) => {
    const response = await api.get(`/api/plans/${planId}/items`);
    return response.data;
  },
};

export default itemService;
