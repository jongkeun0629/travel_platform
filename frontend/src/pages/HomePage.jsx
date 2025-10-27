import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import KakaoMap from "../components/Map/KakaoMap";
import planService from "../services/plan";
import useAuthStore from "../store/authStore";
import usePlanStore from "../store/planStore";

export default function HomePage() {
  const currentUserId = useAuthStore((state) => state.user?.id);

  const userPlans = usePlanStore((state) => state.userPlans);
  const loading = usePlanStore((state) => state.loading);
  const error = usePlanStore((state) => state.error);
  const getUserPlans = usePlanStore((state) => state.getUserPlans);
  const deletePlan = usePlanStore((state) => state.deletePlan);

  useEffect(() => {
    if (currentUserId) {
      getUserPlans(0, currentUserId);
    }
  }, [getUserPlans, currentUserId]);

  const handleDeletePlan = async (planId) => {
    if (!confirm("정말로 이 여행 계획을 삭제하시겠습니까?")) return;
    try {
      await deletePlan(planId);
    } catch (e) {
      console.error("Failed to delete plan", e);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-8">
      {/* 여행 계획 목록 */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-5">
        <h3 className="text-xl font-semibold mb-4 text-white">
          🧳 내 여행 계획
        </h3>

        {loading ? (
          <p className="text-gray-400 text-center py-6">로딩 중...</p>
        ) : error ? (
          <p className="text-red-400 text-center py-6">{error}</p>
        ) : userPlans.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            아직 여행 계획이 없습니다.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {userPlans.map((plan) => (
              <div
                key={plan.planId}
                className="bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-2xl font-semibold text-blue-400 mb-2">
                    {plan.title}
                  </h4>
                  <p className="text-gray-400">
                    도시: {plan.destination || "미정"}
                  </p>

                  <p className="text-gray-400">
                    여행 기간: {new Date(plan.startDate).toLocaleDateString()} ~{" "}
                    {new Date(plan.endDate).toLocaleDateString()}
                  </p>

                  <p className="text-gray-400">
                    타입: {plan.type}, 공개 여부: {plan.visibility}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/traveldetail/${plan.planId}`}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
                  >
                    보기
                  </Link>
                  <button
                    onClick={() => handleDeletePlan(plan.planId)}
                    className="text-red-400 hover:text-red-500"
                  >
                    ✕ 삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 섹션 */}
      <div className="flex justify-center items-center h-100">
        <Link
          to="/createplan"
          className="text-blue-400 hover:underline text-3xl"
        >
          여행 시작하기
        </Link>
      </div>

      {/* 지도 */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">지도(test)</h3>
        <KakaoMap />
      </div>
    </div>
  );
}
