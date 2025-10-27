// src/pages/TripReviewPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

import {
  listTripReviews,
  listTripReviewsByRegion,
  createTripReview,
  updateTripReview,
  deleteTripReview,
} from "../services/tripReview";

import {
  toggleTripReviewLike,
  listTripReviewComments,
  createTripReviewComment,
  // deleteTripReviewComment, // 백엔드에 삭제 API 추가되면 활성화
  getTripReviewLikeCount,
} from "../services/tripReviewExtras";

const clampRating = (v) => Math.min(5, Math.max(1, Number(v) || 1));

export default function TripReviewPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [regionFilter, setRegionFilter] = useState("");
  const [form, setForm] = useState({
    title: "",
    content: "",
    region: "",
    rating: 5,
    userId: 1,
    planId: 1,
  });

  // 댓글 상태: { [reviewId]: { list: [], loading: boolean, input: "" } }
  const [commentState, setCommentState] = useState({});

  const items = useMemo(() => reviews, [reviews]);

  const requireLogin = () => {
    if (!user?.id) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return false;
    }
    return true;
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = regionFilter
        ? await listTripReviewsByRegion(regionFilter)
        : await listTripReviews();

      const enriched = await Promise.all(
        (data ?? []).map(async (r) => {
          let likeCount = r.likeCount ?? r.likes ?? 0;
          try {
            likeCount = await getTripReviewLikeCount(r.id ?? r.tripReviewId);
          } catch (_) { }
          return {
            ...r,
            id: r.id ?? r.tripReviewId,
            likeCount,
            liked: r.liked ?? false,
            commentCount: r.commentCount ?? 0,
          };
        })
      );

      setReviews(enriched);
    } catch (e) {
      console.error(e);
      alert("리뷰 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.region.trim()) {
      return alert("제목/내용/지역을 입력하세요.");
    }
    if (submitting) return;
    setSubmitting(true);

    const body = {
      ...form,
      rating: clampRating(form.rating),
      userId: user?.id ?? form.userId,
    };

    try {
      if (editingId) {
        const updated = await updateTripReview(editingId, body);
        setReviews((prev) =>
          prev.map((r) => (r.id === editingId ? { ...r, ...updated } : r))
        );
        setEditingId(null);
      } else {
        const created = await createTripReview(body);
        setReviews((prev) => [
          {
            ...(created ?? {}),
            id: (created?.id ?? created?.tripReviewId),
            likeCount: 0,
            liked: false,
            commentCount: 0,
          },
          ...prev,
        ]);
      }
      setForm({
        title: "",
        content: "",
        region: "",
        rating: 5,
        userId: user?.id ?? 1,
        planId: 1,
      });
    } catch (e) {
      console.error(e);
      alert("등록/수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (r) => {
    setEditingId(r.id);
    setForm({
      title: r.title ?? "",
      content: r.content ?? "",
      region: r.region ?? "",
      rating: r.rating ?? 5,
      userId: r.userId ?? user?.id ?? 1,
      planId: r.planId ?? 1,
    });
  };

  const onDelete = async (id) => {
    if (!confirm("정말 삭제할까요?")) return;
    const backup = [...reviews];
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteTripReview(id);
    } catch (e) {
      console.error(e);
      alert("삭제 실패");
      setReviews(backup);
    }
  };

  const onToggleLike = async (r) => {
    if (!requireLogin()) return;
    const before = { liked: !!r.liked, likeCount: r.likeCount ?? 0 };

    setReviews((prev) =>
      prev.map((it) =>
        it.id === r.id
          ? {
            ...it,
            liked: !before.liked,
            likeCount: before.liked
              ? Math.max(0, before.likeCount - 1)
              : before.likeCount + 1,
          }
          : it
      )
    );

    try {
      const { likeCount } = await toggleTripReviewLike(r.id, user.id);
      setReviews((prev) =>
        prev.map((it) => (it.id === r.id ? { ...it, likeCount } : it))
      );
    } catch (e) {
      console.error(e);
      setReviews((prev) =>
        prev.map((it) =>
          it.id === r.id
            ? { ...it, liked: before.liked, likeCount: before.likeCount }
            : it
        )
      );
      alert("좋아요 처리 실패");
    }
  };

  const ensureCommentState = (reviewId) => {
    setCommentState((s) =>
      s[reviewId] ? s : { ...s, [reviewId]: { list: [], loading: false, input: "" } }
    );
  };

  const loadComments = async (reviewId) => {
    if (!requireLogin()) return;
    ensureCommentState(reviewId);
    setCommentState((s) => ({
      ...s,
      [reviewId]: { ...s[reviewId], loading: true },
    }));
    try {
      const list = await listTripReviewComments(reviewId);
      setCommentState((s) => ({
        ...s,
        [reviewId]: { ...s[reviewId], list, loading: false },
      }));
    } catch (e) {
      console.error(e);
      alert("댓글을 불러오지 못했습니다.");
      setCommentState((s) => ({
        ...s,
        [reviewId]: { ...s[reviewId], loading: false },
      }));
    }
  };

  const submitComment = async (reviewId) => {
    if (!requireLogin()) return;
    const cs = commentState[reviewId] || { input: "" };
    const content = (cs.input || "").trim();
    if (!content) return alert("댓글을 입력하세요.");

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      content,
      username: user?.username ?? "나",
      userId: user?.id ?? 0,
      createdAt: new Date().toISOString(),
    };

    setCommentState((s) => ({
      ...s,
      [reviewId]: {
        ...(s[reviewId] ?? { list: [], loading: false, input: "" }),
        list: [optimistic, ...(s[reviewId]?.list ?? [])],
        input: "",
      },
    }));

    try {
      const saved = await createTripReviewComment(reviewId, { content }, user.id);
      setCommentState((s) => ({
        ...s,
        [reviewId]: {
          ...s[reviewId],
          list: (s[reviewId]?.list ?? []).map((c) =>
            c.id === tempId ? saved : c
          ),
        },
      }));
    } catch (e) {
      console.error(e);
      alert("댓글 등록 실패");
      setCommentState((s) => ({
        ...s,
        [reviewId]: {
          ...s[reviewId],
          list: (s[reviewId]?.list ?? []).filter((c) => c.id !== tempId),
        },
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl p-6 mx-auto bg-gray-200 rounded-2xl shadow-xl sm:p-8">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-900">
          여행 후기
        </h1>

        <div className="flex gap-2 p-4">
          <input
            placeholder="지역 필터 (예: 서울)"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="flex-[5] px-4 py-3 text-gray-800 rounded-lg focus:outline-none bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
          <button
            onClick={load}
            disabled={loading}
            className="flex-1 px-3 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            검색
          </button>
          <button
            onClick={() => {
              setRegionFilter("");
              load();
            }}
            disabled={loading}
            className="flex-1 px-3 py-2 font-medium text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors duration-200"
          >
            초기화
          </button>
        </div>

        <div className="pt-4 pb-6 space-x-4 border-t border-gray-300">
          <form onSubmit={submit} className="space-y-8">
            <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
              <input
                placeholder="제목"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 text-gray-800 rounded-lg focus:outline-none bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <input
                placeholder="지역 (예: 서울)"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full px-4 py-3 text-gray-800 rounded-lg focus:outline-none bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
            <textarea
              placeholder="내용"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-4 py-3 text-gray-800 rounded-lg focus:outline-none bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <div className="flex items-center gap-3">
              <label className="text-gray-500 text-md">별점</label>
              <input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: clampRating(e.target.value) })
                }
                className=" px-4 py-3 text-gray-800 rounded-lg focus:outline-none bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <div className="ml-auto flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {editingId ? "수정" : "등록"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({ title: "", content: "", region: "", rating: 5, userId: user?.id ?? 1, planId: 1 })
                  }
                  disabled={submitting}
                  className="px-3 py-2 font-medium text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  초기화
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="pt-6 space-x-4 border-t border-gray-400">
          {loading ? (
            <div className="text-gray-500">불러오는 중…</div>
          ) : (
            <div className="grid gap-3">
              {items.length === 0 && <div className="text-gray-500 text-sm">후기가 없습니다.</div>}
              {items.map((r) => {
                const cs = commentState[r.id] || { list: [], loading: false, input: "" };
                return (
                  <article key={r.id} className="bg-gray-400 rounded-xl p-4 grid gap-2">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">{r.title ?? `리뷰 #${r.id}`}</h3>
                      <div className="flex gap-2">
                        <button onClick={() => onEdit(r)} disabled={submitting} className="px-3 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                          수정
                        </button>
                        <button onClick={() => onDelete(r.id)} disabled={submitting} className="px-3 py-2 font-medium text-white bg-red-500 rounded-lg hover:bg-red-700 transition-colors duration-200">
                          삭제
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-800 whitespace-pre-wrap">{r.content}</p>
                    <div className="text-sm text-gray-800">
                      지역: {r.region} · 별점: {r.rating}
                      {r.username && <> · 작성자: {r.username}</>}
                    </div>

                    <div className="flex items-center gap-3 mt-1">
                      <button
                        type="button"
                        onClick={() => onToggleLike(r)}
                        className={`px-2 py-1 rounded border ${r.liked ? "bg-blue-600 text-white" : ""}`}
                      >
                        👍 좋아요 {r.likeCount ?? 0}
                      </button>

                      <button
                        type="button"
                        onClick={() => loadComments(r.id)}
                        className="px-2 py-1 rounded border text-gray-800"
                        disabled={cs.loading}
                      >
                        💬 댓글 {r.commentCount ?? cs.list.length ?? 0}
                      </button>
                    </div>

                    {cs.list.length > 0 && (
                      <div className="mt-2 grid gap-2">
                        {cs.list.map((c) => (
                          <div key={c.id} className="bg-gray-300 border border-gray-300 rounded-lg p-2">
                            <div className="text-sm text-gray-700 flex justify-between">
                              <span>{c.username ?? `user#${c.userId ?? ""}`}</span>
                              <span>{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</span>
                            </div>
                            <div className="text-gray-800 whitespace-pre-wrap">{c.content}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <input
                        value={cs.input || ""}
                        onChange={(e) =>
                          setCommentState((s) => ({
                            ...s,
                            [r.id]: { ...(s[r.id] ?? { list: [], loading: false }), input: e.target.value },
                          }))
                        }
                        placeholder="댓글을 입력하세요"
                        className="flex-1 w-full px-4 py-3 text-gray-800 rounded-lg focus:outline-none bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => submitComment(r.id)}
                        className="px-3 py-3 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        등록
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
