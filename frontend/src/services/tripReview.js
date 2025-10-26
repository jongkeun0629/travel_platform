import api from './api';

const normalize = (r) => ({ ...r, id: r.id ?? r.tripReviewId });

export const listTripReviews = async () => {
  const { data } = await api.get('/api/trip-reviews');
  return (data ?? []).map(normalize);
};

export const createTripReview = async (body) => {
  const { data } = await api.post('/api/trip-reviews', body);
  return normalize(data);
};

export const updateTripReview = async (id, body) => {
  const { data } = await api.put(`/api/trip-reviews/${id}`, body);
  return normalize(data);
};

export const deleteTripReview = async (id) => {
  await api.delete(`/api/trip-reviews/${id}`);
};

export const listTripReviewsByUser = async (userId) => {
  const { data } = await api.get(`/api/trip-reviews/user/${userId}`);
  return (data ?? []).map(normalize);
};

export const listTripReviewsByRegion = async (region) => {
  const { data } = await api.get(`/api/trip-reviews/region`, { params: { region } });
  return (data ?? []).map(normalize);
};
    