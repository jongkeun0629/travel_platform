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
          } catch (_) {}
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
    <div className="max-w-3xl mx-auto p-6 grid gap-4">
      <h1 className="text-2xl font-bold">여행 후기 (Trip Reviews)</h1>

      <div className="flex gap-2">
        <input
          placeholder="지역 필터 (예: 서울)"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="w-full border border-gray-600 bg-gray-800 rounded-lg px-3 py-2 outline-none"
        />
        <button
          onClick={load}
          disabled={loading}
          className="px-3 py-2 rounded-lg border bg-white text-black w-20"
        >
          검색
        </button>
        <button
          onClick={() => {
            setRegionFilter("");
            load();
          }}
          disabled={loading}
          className="px-3 py-2 rounded-lg border w-25"
        >
          초기화
        </button>
      </div>

      <form onSubmit={submit} className="bg-gray-800 rounded-xl p-4 grid gap-3">
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
          <input
            placeholder="제목"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-600 bg-gray-900 rounded-lg px-3 py-2 outline-none"
          />
          <input
            placeholder="지역 (예: 서울)"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            className="w-full border border-gray-600 bg-gray-900 rounded-lg px-3 py-2 outline-none"
          />
        </div>
        <textarea
          placeholder="내용"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full border border-gray-600 bg-gray-900 rounded-lg px-3 py-2 outline-none min-h-[100px]"
        />
        <div className="flex items-center gap-3">
          <label className="text-gray-400 text-sm">별점</label>
          <input
            type="number"
            min={1}
            max={5}
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: clampRating(e.target.value) })
            }
            className="w-20 border border-gray-600 bg-gray-900 rounded-lg px-3 py-2 outline-none"
          />
          <div className="ml-auto flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-3 py-2 rounded-lg bg-blue-600 text-white"
            >
              {editingId ? "수정" : "등록"}
            </button>
            <button
              type="button"
              onClick={() =>
                setForm({ title: "", content: "", region: "", rating: 5, userId: user?.id ?? 1, planId: 1 })
              }
              disabled={submitting}
              className="px-3 py-2 rounded-lg border"
            >
              초기화
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="text-gray-400">불러오는 중…</div>
      ) : (
        <div className="grid gap-3">
          {items.length === 0 && <div className="text-gray-400 text-sm">후기가 없습니다.</div>}
          {items.map((r) => {
            const cs = commentState[r.id] || { list: [], loading: false, input: "" };
            return (
              <article key={r.id} className="bg-gray-800 rounded-xl p-4 grid gap-2">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold">{r.title ?? `리뷰 #${r.id}`}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(r)} disabled={submitting} className="px-3 py-1 rounded-lg border">
                      수정
                    </button>
                    <button onClick={() => onDelete(r.id)} disabled={submitting} className="px-3 py-1 rounded-lg bg-red-600 text-white">
                      삭제
                    </button>
                  </div>
                </div>

                <p className="text-gray-200 whitespace-pre-wrap">{r.content}</p>
                <div className="text-sm text-gray-400">
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
                    className="px-2 py-1 rounded border"
                    disabled={cs.loading}
                  >
                    💬 댓글 {r.commentCount ?? cs.list.length ?? 0}
                  </button>
                </div>

                {cs.list.length > 0 && (
                  <div className="mt-2 grid gap-2">
                    {cs.list.map((c) => (
                      <div key={c.id} className="bg-gray-900 rounded-lg p-2">
                        <div className="text-sm text-gray-400 flex justify-between">
                          <span>{c.username ?? `user#${c.userId ?? ""}`}</span>
                          <span>{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</span>
                        </div>
                        <div className="text-gray-200 whitespace-pre-wrap">{c.content}</div>
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
                    className="flex-1 border border-gray-600 bg-gray-900 rounded-lg px-3 py-2 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => submitComment(r.id)}
                    className="px-3 py-2 rounded-lg bg-white text-black border"
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
  );
}
