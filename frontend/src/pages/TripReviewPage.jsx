import { useEffect, useMemo, useState } from "react";
import {
  listTripReviews,
  listTripReviewsByRegion,
  createTripReview,
  updateTripReview,
  deleteTripReview,
} from "../services/tripReview";

const clampRating = (v) => Math.min(5, Math.max(1, Number(v) || 1));

export default function TripReviewPage() {
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
    userId: 1, // TODO: 로그인 연동 시 제거하고 서버에서 사용자 식별
    planId: 1, // TODO: 실제 플랜 연결로 교체
  });

  const items = useMemo(() => reviews, [reviews]);

  const load = async () => {
    setLoading(true);
    try {
      const data = regionFilter
        ? await listTripReviewsByRegion(regionFilter)
        : await listTripReviews();
      setReviews(data);
    } catch (e) {
      console.error(e);
      alert("리뷰 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.region.trim()) {
      return alert("제목/내용/지역을 입력하세요.");
    }
    if (submitting) return;
    setSubmitting(true);

    const body = { ...form, rating: clampRating(form.rating) };

    try {
      if (editingId) {
        const updated = await updateTripReview(editingId, body);
        setReviews((prev) => prev.map((r) => (r.id === editingId ? updated : r)));
        setEditingId(null);
      } else {
        const created = await createTripReview(body);
        setReviews((prev) => [created, ...prev]);
      }
      setForm({ title: "", content: "", region: "", rating: 5, userId: 1, planId: 1 });
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
      userId: r.userId ?? 1,
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

  return (
    <div className="max-w-3xl mx-auto p-6 grid gap-4">
      <h1 className="text-2xl font-bold">여행 후기 (Trip Reviews)</h1>

      {/* 필터 */}
      <div className="flex gap-2">
        <input
          placeholder="지역 필터 (예: 서울)"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="w-full border border-gray-600 bg-gray-800 rounded-lg px-3 py-2 outline-none"
        />
        <button onClick={load} disabled={loading} className="px-3 py-2 rounded-lg border bg-white text-black">
          검색
        </button>
        <button
          onClick={() => { setRegionFilter(""); load(); }}
          disabled={loading}
          className="px-3 py-2 rounded-lg border"
        >
          초기화
        </button>
      </div>

      {/* 작성/수정 폼 */}
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
            type="number" min={1} max={5}
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: clampRating(e.target.value) })}
            className="w-20 border border-gray-600 bg-gray-900 rounded-lg px-3 py-2 outline-none"
          />
          <div className="ml-auto flex gap-2">
            <button type="submit" disabled={submitting} className="px-3 py-2 rounded-lg bg-blue-600 text-white">
              {editingId ? "수정" : "등록"}
            </button>
            <button
              type="button"
              onClick={() => setForm({ title: "", content: "", region: "", rating: 5, userId: 1, planId: 1 })}
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
          {items.length === 0 && <div className="text-gray-400 text-sm">후기가 없습니다.</div>}
          {items.map((r) => (
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
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
