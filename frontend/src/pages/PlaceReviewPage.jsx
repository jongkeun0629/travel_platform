// src/pages/PlaceReviewPage.jsx
import { useEffect, useMemo, useState } from 'react';
import {
  listPlaceReviewsByPlace,
  searchPlaceReviews,
  createPlaceReview,
  updatePlaceReview,
  deletePlaceReview,
} from '../services/placeReview';

const clampRating = (v) => Math.min(5, Math.max(1, Number(v) || 1));

export default function PlaceReviewPage() {
  const [placeId, setPlaceId] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ placeId: 1, userId: 1, content: '', rating: 5 });

  const items = useMemo(() => reviews, [reviews]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listPlaceReviewsByPlace(placeId);
      setReviews(data);
      setForm((f) => ({ ...f, placeId }));
    } catch (e) {
      console.error(e);
      alert('후기 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [placeId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) return alert('내용을 입력하세요.');
    if (submitting) return;
    setSubmitting(true);

    const body = { ...form, rating: clampRating(form.rating), placeId };

    try {
      if (editingId) {
        const updated = await updatePlaceReview(editingId, body);
        setReviews(prev => prev.map(r => (r.id === editingId ? updated : r)));
        setEditingId(null);
      } else {
        const created = await createPlaceReview(body);
        setReviews(prev => [created, ...prev]);
      }
      setForm({ placeId, userId: 1, content: '', rating: 5 });
    } catch (e) {
      console.error(e);
      alert('등록/수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (r) => {
    setEditingId(r.id);
    setForm({ placeId: r.placeId, userId: r.userId ?? 1, content: r.content ?? '', rating: r.rating ?? 5 });
  };

  const onDelete = async (id) => {
    if (!confirm('정말 삭제할까요?')) return;
    const backup = [...reviews];
    setReviews(prev => prev.filter(r => r.id !== id));
    try {
      await deletePlaceReview(id);
    } catch (e) {
      console.error(e);
      alert('삭제 실패');
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
      alert('검색 실패');
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = async () => {
    setKeyword('');
    await load();
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>장소 후기 (Place Reviews)</h1>

      {/* placeId 선택 & 검색 */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#6b7280', fontSize: 14 }}>placeId</span>
          <input type="number" value={placeId} onChange={(e) => setPlaceId(Number(e.target.value))} style={{ width: 100, border: '1px solid #e5e7eb', borderRadius: 12, padding: '10px 12px', outline: 'none' }} />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <input placeholder="키워드 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 12, padding: '10px 12px', outline: 'none' }} />
          <button onClick={doSearch} style={{ borderRadius: 12, padding: '8px 12px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }} disabled={loading}>검색</button>
          <button onClick={resetSearch} style={{ borderRadius: 12, padding: '8px 12px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }} disabled={loading}>초기화</button>
        </div>
      </div>

      {/* 작성/수정 폼 */}
      <form onSubmit={submit} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: 16 }}>
        <textarea
          placeholder="내용"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 12, padding: '10px 12px', outline: 'none', minHeight: 100 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ color: '#6b7280', fontSize: 14 }}>별점</label>
          <input
            type="number" min={1} max={5}
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: clampRating(e.target.value) })}
            style={{ width: 80, border: '1px solid #e5e7eb', borderRadius: 12, padding: '10px 12px', outline: 'none' }}
          />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button type="submit" style={{ borderRadius: 12, padding: '8px 12px', border: '1px solid #111827', background: '#111827', color: '#fff', cursor: 'pointer' }} disabled={submitting}>
              {editingId ? '수정' : '등록'}
            </button>
            <button
              type="button"
              onClick={() => { setEditingId(null); setForm({ placeId, userId: 1, content: '', rating: 5 }); }}
              style={{ borderRadius: 12, padding: '8px 12px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}
              disabled={submitting}
            >
              초기화
            </button>
          </div>
        </div>
      </form>

      {/* 목록 */}
      {loading ? (
        <div style={{ color: '#6b7280' }}>불러오는 중…</div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {items.length === 0 && <div style={{ color: '#6b7280', fontSize: 14 }}>후기가 없습니다.</div>}
          {items.map((r) => (
            <article key={r.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>리뷰 #{r.id}</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => onEdit(r)} style={{ borderRadius: 12, padding: '8px 12px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }} disabled={submitting}>수정</button>
                  <button onClick={() => onDelete(r.id)} style={{ borderRadius: 12, padding: '8px 12px', border: '1px solid #dc2626', background: '#dc2626', color: '#fff', cursor: 'pointer' }} disabled={submitting}>삭제</button>
                </div>
              </div>
              <p style={{ marginTop: 6, color: '#374151', whiteSpace: 'pre-wrap' }}>{r.content}</p>
              <div style={{ marginTop: 6, fontSize: 14, color: '#6b7280' }}>
                <span>장소: {r.placeId}</span> <span style={{ margin: '0 6px' }}>•</span>
                <span>별점: {r.rating}</span>
                {r.username && (<><span style={{ margin: '0 6px' }}>•</span><span>작성자: {r.username}</span></>)}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
