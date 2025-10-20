// src/pages/TravelDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";

export default function TravelDetail() {
  const { id } = useParams();

  // 실제로는 id를 이용해 API에서 여행 기록 데이터를 가져와야 합니다.

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">여행 기록 상세 (ID: {id})</h1>
      <p>이곳에 여행 기록의 상세 내용을 표시합니다.</p>
      {/* 여행 기록 컴포넌트, 사진, 지도 등을 추가 */}
    </div>
  );
}
