import { useEffect, useMemo, useState } from "react";
import {
  listPlaceReviewsByPlace,
  searchPlaceReviews,
  createPlaceReview,
  updatePlaceReview,
  deletePlaceReview,
} from "../services/placeReview";

const clampRating = (v) => Math.min(5, Math.max(1, Number(v) || 1));

export default function PlaceReviewPage() {
  const [placeId, setPlaceId] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    placeId: 1,
    userId: 1,
    content: "",
    rating: 5,
  });

  const items = useMemo(() => reviews, [reviews]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listPlaceReviewsByPlace(placeId);
      setReviews(data);
      setForm((f) => ({ ...f, placeId }));
    } catch (e) {
      console.error(e);
      alert("후기 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [placeId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) return alert("내용을 입력하세요.");
    if (submitting) return;
    setSubmitting(true);

    const body = { ...form, rating: clampRating(form.rating), placeId };

    try {
      if (editingId) {
        const updated = await updatePlaceReview(editingId, body);
        setReviews((prev) =>
          prev.map((r) => (r.id === editingId ? updated : r))
        );
        setEditingId(null);
      } else {
        const created = await createPlaceReview(body);
        setReviews((prev) => [created, ...prev]);
      }
      setForm({ placeId, userId: 1, content: "", rating: 5 });
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
      placeId: r.placeId,
      userId: r.userId ?? 1,
      content: r.content ?? "",
      rating: r.rating ?? 5,
    });
  };

  const onDelete = async (id) => {
    if (!confirm("정말 삭제할까요?")) return;
    const backup = [...reviews];
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await deletePlaceReview(id);
    } catch (e) {
      console.error(e);
      alert("삭제 실패");
      setReviews(backup);
    }
  };

  const doSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const data = await searchPlaceReviews(keyword.trim());
      setReviews(data);
    } catch (e) {
      console.error(e);
      alert("검색 실패");
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = async () => {
    setKeyword("");
    await load();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 grid gap-4">
      <h1 className="text-2xl font-bold">장소 후기 (Place Reviews)</h1>

      {/* placeId 선택 & 검색 */}
      <div className="bg-gray-800 rounded-xl p-4 flex gap-2 items-center">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">placeId</span>
          <input
            type="number"
            value={placeId}
            onChange={(e) => setPlaceId(Number(e.target.value))}
            className="w-24 border border-gray-600 bg-gray-900 rounded-lg px-3 py-2 outline-none"
          />
        </div>
        <div className="ml-auto flex gap-2 w-full">
          <input
            placeholder="키워드 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full border border-gray-600 bg-gray-900 rounded-lg px-3 py-2 outline-none"
          />
          <button
            onClick={doSearch}
            disabled={loading}
            className="px-3 py-2 rounded-lg border w-20"
          >
            검색
          </button>
          <button
            onClick={resetSearch}
            disabled={loading}
            className="px-3 py-2 rounded-lg border w-25"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 작성/수정 폼 */}
      <form onSubmit={submit} className="bg-gray-800 rounded-xl p-4 grid gap-3">
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
              onClick={() => {
                setEditingId(null);
                setForm({ placeId, userId: 1, content: "", rating: 5 });
              }}
              disabled={submitting}
              className="px-3 py-2 rounded-lg border"
            >
              초기화
            </button>
          </div>
        </div>
      </form>

      {/* 목록 */}
      {loading ? (
        <div className="text-gray-400">불러오는 중…</div>
      ) : (
        <div className="grid gap-3">
          {items.length === 0 && (
            <div className="text-gray-400 text-sm">후기가 없습니다.</div>
          )}
          {items.map((r) => (
            <article key={r.id} className="bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold">리뷰 #{r.id}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(r)}
                    disabled={submitting}
                    className="px-3 py-1 rounded-lg border"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(r.id)}
                    disabled={submitting}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p className="text-gray-200 whitespace-pre-wrap mt-1">
                {r.content}
              </p>
              <div className="text-sm text-gray-400 mt-1">
                장소: {r.placeId} · 별점: {r.rating}
                {r.username && <> · 작성자: {r.username}</>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
