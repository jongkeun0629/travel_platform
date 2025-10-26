import { useEffect, useMemo, useState } from 'react';
import {
  listTripReviews,
  createTripReview,
  updateTripReview,
  deleteTripReview,
  listTripReviewsByRegion,
} from '../services/tripReview';

const clampRating = (v) => Math.min(5, Math.max(1, Number(v) || 1));

export default function TripReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [regionFilter, setRegionFilter] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    region: '',
    rating: 5,
    userId: 1, // 테스트용
    planId: 1, // 테스트용
  });

  // 서비스에서 normalize로 id가 보장되므로 그대로 사용
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
      alert('리뷰 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // 최초 로드

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.region.trim()) {
      return alert('제목/내용/지역을 입력하세요.');
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
      setForm({ title: '', content: '', region: '', rating: 5, userId: 1, planId: 1 });
    } catch (e) {
      console.error(e);
      alert('등록/수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (r) => {
    setEditingId(r.id);
    setForm({
      title: r.title ?? '',
      content: r.content ?? '',
      region: r.region ?? '',
      rating: r.rating ?? 5,
      userId: r.userId ?? 1,
      planId: r.planId ?? 1,
    });
  };

  const onDelete = async (id) => {
    if (!confirm('정말 삭제할까요?')) return;
    const backup = [...reviews];
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteTripReview(id);
    } catch (e) {
      console.error(e);
      alert('삭제 실패');
      setReviews(backup);
    }
  };

  const applyRegionFilter = async () => { await load(); };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>여행 후기 (Trip Reviews)</h1>

      {/* 필터 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          placeholder="지역 필터 (예: 서울)"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          style={inputStyle}
        />
        <button onClick={applyRegionFilter} style={btnStyle} disabled={loading}>검색</button>
        <button
          onClick={() => { setRegionFilter(''); load(); }}
          style={btnGhost}
          disabled={loading}
        >
          초기화
        </button>
      </div>

      {/* 작성/수정 폼 */}
      <form onSubmit={submit} style={cardStyle}>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
          <input
            placeholder="제목"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="지역 (예: 서울)"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            style={inputStyle}
          />
        </div>
        <textarea
          placeholder="내용"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          style={{ ...inputStyle, minHeight: 100 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ color: '#6b7280', fontSize: 14 }}>별점</label>
          <input
            type="number" min={1} max={5}
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: clampRating(e.target.value) })}
            style={{ ...inputStyle, width: 80 }}
          />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button type="submit" style={btnPrimary} disabled={submitting}>
              {editingId ? '수정' : '등록'}
            </button>
            <button
              type="button"
              onClick={() => setForm({ title: '', content: '', region: '', rating: 5, userId: 1, planId: 1 })}
              style={btnGhost}
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
            <article key={r.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>{r.title ?? `리뷰 #${r.id}`}</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => onEdit(r)} style={btnGhost} disabled={submitting}>수정</button>
                  <button onClick={() => onDelete(r.id)} style={btnDanger} disabled={submitting}>삭제</button>
                </div>
              </div>
              <p style={{ marginTop: 6, color: '#374151', whiteSpace: 'pre-wrap' }}>{r.content}</p>
              <div style={{ marginTop: 6, fontSize: 14, color: '#6b7280' }}>
                <span>지역: {r.region}</span> <span style={{ margin: '0 6px' }}>•</span>
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

const cardStyle = { background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: 16, display: 'grid', gap: 8 };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 12, padding: '10px 12px', outline: 'none' };
const btnStyle = { borderRadius: 12, padding: '8px 12px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' };
const btnGhost = { ...btnStyle };
const btnPrimary = { ...btnStyle, background: '#111827', color: '#fff', borderColor: '#111827' };
const btnDanger = { ...btnStyle, background: '#dc2626', color: '#fff', borderColor: '#dc2626' };
