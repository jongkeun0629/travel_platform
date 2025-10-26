// src/services/placeReview.js
import api from './api';

const normalize = (r) => ({ ...r, id: r.id ?? r.reviewId ?? r.placeReviewId });

export const listPlaceReviewsByPlace = async (placeId) => {
  const { data } = await api.get(`/api/places/${placeId}/reviews`);
  return (data ?? []).map(normalize);
};

export const searchPlaceReviews = async (keyword) => {
  const { data } = await api.get(`/api/place-reviews/search`, { params: { q: keyword } });
  return (data ?? []).map(normalize);
};

export const createPlaceReview = async (body) => {
  const { data } = await api.post(`/api/place-reviews`, body);
  return normalize(data);
};

export const updatePlaceReview = async (id, body) => {
  const { data } = await api.put(`/api/place-reviews/${id}`, body);
  return normalize(data);
};

export const deletePlaceReview = async (id) => {
  await api.delete(`/api/place-reviews/${id}`);
};
