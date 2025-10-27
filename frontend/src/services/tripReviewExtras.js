import api from "./api";

// 댓글: 엔티티 그대로 내려오므로 안전 정규화
const normComment = (c) => ({
  id: c.id,
  userId: c.user?.id ?? c.userId,
  username: c.user?.username ?? c.username ?? `user#${c.user?.id ?? ""}`,
  content: c.content,
  createdAt: c.createdAt,
});

// 좋아요 개수 조회 (GET /api/trip-reviews/{id}/likes)
export const getTripReviewLikeCount = async (reviewId) => {
  const { data } = await api.get(`/api/trip-reviews/${reviewId}/likes`);
  return Number(data ?? 0);
};

// 좋아요 토글 (POST /api/trip-reviews/{id}/like?userId=...)
export const toggleTripReviewLike = async (reviewId, userId) => {
  await api.post(`/api/trip-reviews/${reviewId}/like`, null, {
    params: { userId },
  });
  // 토글 응답이 String이므로, 최신 카운트는 별도 조회
  const likeCount = await getTripReviewLikeCount(reviewId);
  return { likeCount };
};

// 댓글 목록 (GET /api/trip-reviews/{id}/comments)
export const listTripReviewComments = async (reviewId) => {
  const { data } = await api.get(`/api/trip-reviews/${reviewId}/comments`);
  return (data ?? []).map(normComment);
};

// 댓글 생성 (POST /api/trip-reviews/{id}/comments?userId=...&content=...)
export const createTripReviewComment = async (reviewId, { content }, userId) => {
  const { data } = await api.post(
    `/api/trip-reviews/${reviewId}/comments`,
    null,
    { params: { userId, content } }
  );
  return normComment(data);
};

// 댓글 삭제 (현재 컨트롤러엔 delete 매핑이 없으니, 추가 전엔 잠시 미사용)
export const deleteTripReviewComment = async (reviewId, commentId) => {
  // 백엔드에 @DeleteMapping("/{reviewId}/comments/{commentId}") 추가되면 아래 사용:
  // await api.delete(`/api/trip-reviews/${reviewId}/comments/${commentId}`);
  throw new Error("서버에 댓글 삭제 API가 아직 없습니다.");
};
