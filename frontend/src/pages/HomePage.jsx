import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import KakaoMap from "../components/Map/KakaoMap";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    setUser(currentUser);
    const savedPlans = JSON.parse(localStorage.getItem("travelPlans") || "[]");
    setPlans(savedPlans);
  }, [navigate]);

  const handleLogout = () => {
    userService.logout();
    navigate("/login");
  };

  const handleDeletePlan = (id) => {
    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    localStorage.setItem("travelPlans", JSON.stringify(updated));
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-white">
          안녕하세요, <span className="text-blue-400">{user.userId}</span> 님
        </h2>
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 font-medium"
        >
          로그아웃
        </button>
      </div>

      {/* 여행 계획 목록 */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">
          🧳 내 여행 계획
        </h3>

        {plans.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            아직 여행 계획이 없습니다.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-2xl font-semibold text-blue-400 mb-2">
                    {plan.travelTitle}
                  </h4>
                  <p className="text-gray-300">
                    작성자: {plan.author || "알 수 없음"}
                  </p>
                  <p className="text-gray-400">
                    도시: {plan.selectedCities?.join(", ") || "미정"}
                  </p>
                  {plan.travelPeriod && (
                    <p className="text-gray-400">
                      기간:{" "}
                      {new Date(
                        plan.travelPeriod.startDate
                      ).toLocaleDateString()}{" "}
                      ~{" "}
                      {new Date(plan.travelPeriod.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/traveldetail/${plan.id}`}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
                  >
                    보기
                  </Link>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
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
      <div className="flex justify-center items-center">
        <Link
          to="/startpage"
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
