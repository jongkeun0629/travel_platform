// src/services/placeReview.js
import api from "../services/api";

const normalize = (r) => ({
  ...r,
  id: r.id ?? r.reviewId ?? r.placeReviewId,
  placeName: r.placeName ?? r.place?.placeName ?? "", // 안전망
  rating: r.rating ?? 5,
  content: r.content ?? "",
  userId: r.userId ?? r.user?.id,
  username: r.username ?? r.user?.username,
});

export const listPlaceReviewsByPlace = async (placeId) => {
  if (!placeId || Number.isNaN(Number(placeId))) return [];
  try {
    const { data } = await api.get(`/api/place-reviews/place/${placeId}`);
    return (data ?? []).map(normalize);
  } catch (e) {
    if ([204, 404].includes(e.response?.status)) return [];
    throw e;
  }
};

export const searchPlaceReviews = async (q) => {
  const keyword = (q ?? "").trim();
  if (!keyword) return [];
  try {
    const { data } = await api.get(`/api/place-reviews/search`, {
      params: { q: keyword }, // ✅ 서버는 q로 받도록
    });
    return (data ?? []).map(normalize);
  } catch (e) {
    if ([204, 404].includes(e.response?.status)) return [];
    throw e;
  }
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
