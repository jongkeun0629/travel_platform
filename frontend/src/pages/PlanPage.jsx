import React, { useEffect } from "react";
import usePlanStore from "../store/planStore";
import { Link } from "react-router-dom";

export default function PlanPage() {
    const plans = usePlanStore((state) => state.plans);
    const loading = usePlanStore((state) => state.loading);
    const error = usePlanStore((state) => state.error);
    const fetchPlans = usePlanStore((state) => state.fetchPlans);

    useEffect(() => {
        fetchPlans(0);
    }, [fetchPlans]);

    return (
        <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-5">
                <h3 className="text-xl font-semibold mb-4 text-white">
                    모든 여행 계획
                </h3>

                {loading ? (
                    <p className="text-gray-400 text-center py-6">로딩 중...</p>
                ) : error ? (
                    <p className="text-red-400 text-center py-6">{error}</p>
                ) : plans.length === 0 ? (
                    <p className="text-gray-400 text-center py-6">
                        아직 '전체 공개'된 여행 계획이 없습니다.
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {plans.map((plan) => (
                            <div
                                key={plan.planId}
                                className="bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-xl transition flex flex-col justify-between"
                            >
                                <div>
                                    <h4 className="text-2xl font-semibold text-blue-400 mb-2">
                                        {plan.title}
                                    </h4>
                                    <p className="text-gray-300">
                                        작성자: {plan.user?.username || "알 수 없음"}
                                    </p>
                                    <p className="text-gray-400">
                                        도시: {plan.destination || "미정"}
                                    </p>
                                    <p className="text-gray-400">
                                        여행 기간: {new Date(plan.startDate).toLocaleDateString()} ~{" "}
                                        {new Date(plan.endDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-400">타입: {plan.type}</p>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <Link
                                        to={`/traveldetail/${plan.planId}`}
                                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
                                    >
                                        보기
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}