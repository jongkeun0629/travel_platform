import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import TravelPlanForm from "../components/Travel/TravelPlanForm";
import TravelPlanList from "../components/Travel/TravelPlanList";
import KakaoMap from "../components/Map/KakaoMap";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    if (!currentUser) {
      navigate("/login", { replace: true });
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  const handleAddPlan = (plan) => setPlans([...plans, plan]);
  const handleDeletePlan = (id) =>
    setPlans(plans.filter((plan) => plan.id !== id));
  const handleLogout = () => {
    userService.logout();
    navigate("/login");
  };

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="flex justify-between items-center bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-white">
          안녕하세요, <span className="text-blue-400">test</span> 님
        </h2>
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg px-4 py-2 font-medium"
        >
          로그아웃
        </button>
      </div>

      {/* 여행 계획 폼 섹션 */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">새 여행 계획</h3>
        <TravelPlanForm onAddPlan={handleAddPlan} />
      </div>

      {/* 여행 계획 리스트 섹션 */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">
          나의 여행 계획
        </h3>
        <TravelPlanList plans={plans} onDelete={handleDeletePlan} />
      </div>

      {/* 지도 섹션 */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">지도</h3>
        <KakaoMap />
      </div>
    </div>
  );
}
