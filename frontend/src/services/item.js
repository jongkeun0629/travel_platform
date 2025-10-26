import api from "./api";

const itemService = {
  getItem: async (planId) => {
    const response = await api.get(`/api/plans/${planId}/items`);
    return response.data;
  },

  createItem: async (planId, itemData) => {
    const response = await api.post(`/api/plans/${planId}/items/add`, itemData);
    return response.data;
  },

  deleteItem: async (planId, itemId) => {
    await api.delete(`/api/plans/${planId}/items/${itemId}`);
  },

  updateItem: async (planId, itemId) => {
    const response = await api.patch(`/api/plans/${planId}/items/${itemId}`);
    return response.data;
  },
};

export default itemService;
